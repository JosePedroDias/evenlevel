var NODE = !window;
//console.log('NODE?', NODE);


(function() {
	'use strict'
	var leveldb;

	if (NODE) {
		leveldb = require('leveldown');
	}
	else {
		leveldb = require('level-js');
	}


	/*var cb = function(err, res) { console.log(err, res); };
	window.cb = cb;

	var cb1 = function(v) { console.log(v); };
	window.cb1 = cb1;

	var expose = function(err, x) {
		if (err) { return console.error(err); }
		window.x = x;
	};
	window.expose = expose;
	var clone = function(o) {
		return JSON.parse( JSON.stringify(o) );
	};
	window.clone = clone;
	window.O = {};
	window.cbTrue = function(v) { console.log(v); return true; };*/




	var now = function() { return (new Date()).valueOf(); };

	var _32Pow4 = Math.pow(32, 4);
	var counter = 0;
	var nowS = function() {
		counter = (counter + 1) % _32Pow4;
		return now().toString(32) + counter.toString(32);
	};

	var noop = function() {};

	var ident = function(v) { return v; };

	var modes = {
		raw: {
			encode: ident,
			decode: ident
		},
		json: {
			encode: function(v) { return JSON.stringify(v); },
			decode: function(v) { return JSON.parse(v); }
		},
		withMeta: {
			encode: function(v, k) {
				var ts = now();
				if (!('_createdAt' in v)) {
					v._createdAt = ts;
					v._version = 1;
					v._id = k;
				}
				else {
					++v._version;
				}
				v._updatedAt = ts;
				if (this.author) { v._author = this.author; }
				return JSON.stringify(v);
			},
			decode: function(v) { return JSON.parse(v); }
		}
	}

	var elStore = function elStore(lowLevelStore, options) {
		var bag = modes[options.mode];
		if (!bag) {
			options.mode = 'raw';
			bag = modes[options.mode];
		}
		var enc = bag.encode.bind(options);
		var dec = bag.decode;

		var handleKeyRange = function(startK, endK) {
			var kr = lowLevelStore.keyRange;
			if (startK !== undefined && endK !== undefined) {
				return kr.bound(startK, endK);
			}
			else if (startK !== undefined) {
				return kr.lowerBound(startK);
			}
			else if (endK !== undefined) {
				return kr.upperBound(endK);
			}
			return null;
		};

		var getRanging = NODE ?
		function(isKeys, itemCb, descending, startK, endK) {
			var opts = {
				reverse: !!descending,
				keys:    isKeys,
				values:  !isKeys,
				keyAsBuffer: false,
				valueAsBuffer: false,
			};
			if (startK) { opts.gte = startK; }
			if (endK  ) { opts.lte = endK;   }
			var it = lowLevelStore.iterator(opts);
			var onNext = function onNext(err, k, v) {
				if (k === undefined) {
					return itemCb(null);
				}
				else {
					var res = itemCb( isKeys ? k : dec(v) );
					if (res) { it.next(onNext); }
					else { it.end(noop); }
				}
			};
			it.next(onNext);
		} :
		function(isKeys, itemCb, descending, startK, endK) {
			var itemCb2 = function(v, cur, trans) {
				if (v === null) { return itemCb(null); }
				var res = itemCb( isKeys ? cur.key : dec(v) );
				if (res) { cur['continue'](); }
			};
			lowLevelStore.iterate(itemCb2, {
				order:        descending ? 'desc' : 'asc',
				keyRange:     handleKeyRange(startK, endK),
				autoContinue: false,
				onError:      noop // to avoid errors on early exit
			});
		};
		
		return {
			put: function put(k, v, cb) {
				if (!cb) { cb = noop; }
				if (k === null || k === undefined) { k = (v._id !== undefined ? v._id : nowS() ); }
				lowLevelStore.put(k, enc(v, k), function(err) {
					cb(err, k);
				});
			},
			get: function get(k, cb) {
				lowLevelStore.get(k, /*{asBuffer:false},*/
					NODE ? 
					function(err, v) {
						if (err) { return cb(err); }
						if (v === undefined || v === null) { return cb(undefined); }
						cb(null, dec( v.toString() ) );
					} :
					function(v) {
						if (v === undefined || v === null) { return cb(undefined); }
						cb(null, dec(v) );
					}
				);
			},
			del: function del(k, cb) {
				if (!cb) { cb = noop; }
				lowLevelStore[ NODE ? 'del' : 'remove' ](k, cb);
			},
			batch: function batch(items, cb) { // [{type, key, value}], cb(err)
				if (!cb) { cb = noop; }
				items = items.map(function(item) {
					if (!NODE && item.type === 'del') {
						item.type = 'remove';
					}
					else {
						if (item.key === null || item.key === undefined) { item.key = (item.value._id !== undefined ? item.value._id : nowS() ); }
						if (item.type === undefined) { item.type = 'put'; }
						item.value = enc(item.value, item.key);
					}
					return item;
				});
				lowLevelStore.batch(items, function() {
					cb(null);
				}, function(err) {
					cb(err);
				});
			},
			getKeysRanging: function getKeysRanging(itemCb, descending, startK, endK) {
				getRanging(true, itemCb, descending, startK, endK);
			},
			getValuesRanging: function getValuesRanging(itemCb, descending, startK, endK) {
				getRanging(false, itemCb, descending, startK, endK);
			},
			/*getAllValues: function getAllValues(cb) {
				lowLevelStore.getAll(function(res) {
					cb(res.map(dec));
				});
			},*/
			/*truncate: function truncate(cb) { // remove all entries
				lowLevelStore.clear(cb);
			},*/
			drop: function drop() {
				if (NODE) {
					lowLevelStore.destroy(options.storeName);
				}
				else {
					lowLevelStore.deleteDatabase();
				}
				var api = this;
				var keys = Object.keys(api); // remove api methods
				keys.forEach(function(key) {
					delete api[key];
				});
			},
			_: lowLevelStore
		};
	};

	var evenlevel = {
		getStore: function getStore(storeName, options, cb) { // also accepts storeName, cb
			if (typeof options === 'function') {
				cb = options;
				options = {};
			}
			options.storeName = storeName;
			// so far supported options: mode:raw|json|withMeta, author:string

			//leveldb(storeName).open(function(err, lowLevelStore) {
			var lowLevelStore0 = leveldb(storeName);
			console.log(lowLevelStore0);
			lowLevelStore0.open(function(err, lowLevelStore) {
				if (!lowLevelStore) {
					lowLevelStore = lowLevelStore0;
				}
			
				if (err) { return cb(err); }
				cb(null, elStore(lowLevelStore, options));
			});
		},
		availableModes: function availableModes() {
			return Object.keys(modes);
		}
	};

	if (!NODE) {
		window.evenlevel = evenlevel;
	}

})();
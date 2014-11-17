'use strict';

var cb = function(err, res) { console.log(err, res); };

var cbTrue = function(v) { console.log(v); return true; };

var clone = function(o) {
	return JSON.parse( JSON.stringify(o) );
};

var O = {};


// to keep this legible, I'm not wrapping each consecutive call on function callbacks
// of course you should


evenlevel.getStore('bag0', function(err, x) {
	x.put('a', 'b');
	x.get('a', cb);
});

evenlevel.getStore('bag1', {mode:'json'}, function(err, x) {
	x.put('a', {name:'john', age:20});
	x.get('a', cb);
});

evenlevel.getStore('bag2', {mode:'withMeta', author:'jsad'}, function(err, x) {
	x.put('a', {name:'john', age:20});

	x.get('a', cb);

	x.get('a', function(o) {
		o.surname = 'rambo';
		x.put('a', o);
	});

	x.get('a', cb);

	'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(k) {
		x.put(k, clone(O));
	});

	x.getValuesRanging(function(v) { console.log(v); return Math.random() < 0.95; });

	x.getValuesRanging(cbTrue);

	x.getValuesRanging(cbTrue, 0, 'f', 'j');

	x.getValuesRanging(cbTrue, 1, 'f', 'j');

	x.batch([
		{type:'del', key:'zxc', value:clone(O)},
		{type:'put', key:'zxd', value:clone(O)},
		{type:'put', key:'zxz', value:clone(O)}], cb);

	x.batch([{value:clone(O)}, {value:clone(O)}, {value:clone(O)}], cb);

	x.batch([{type:'del', key:'undef'}], cb);
});

evenlevel.getStore('table_x', {mode:'withMeta'}, function(err, store) {
	if (err) { throw err; }

	store.put('key1', {name:'Jesus', age:33}); // cb is optional
	store.put(null, {name:'Mahometh', age:50}); // autogens key if not provided

	store.put('key1', {name:'Jesus', age:33, year:0}); // overriding

	store.get('key1', cb); // notice how the version has increased

	store.del('key1');

	store.batch([
		{type:'put', key:'xcv', value:{name:'batman'},    // simple case: everything specified in put
		{type:'put', value:{_id:'zxc', name:'spiderman'}, // if _id is set, it is used
		{type:'put', value:{name:'he-man'},               // no key or _id, autogen
		{value:{name:'sheena'},                           // put is the default op
		{type:'del', key:'key1'}                          // delete, requires key and only key.
	], errOrOk);

	store.getKeysRanging(logTrue, true) // all keys descending
	// NOTICE: the itemFn will only keep fetching if returns trueish, therefore the logTrue usage.

	store.getKeysRanging(logTrue, false, 'd', 'j'); // keys from 'd' to 'j' ascending

	store.getValuesRanging(logTrue, false, 'd', 'j'); // values from 'd' to 'j' ascending

	//store.drop() // store deleted. unusable from now on.
});

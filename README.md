[![dependency status](https://david-dm.org/josepedrodias/evenlevel.png)](https://david-dm.org/josepedrodias/evenlevel)
[![published version](https://badge.fury.io/js/evenlevel.png)](http://badge.fury.io/js/evenlevel)
[![still maintained?](http://stillmaintained.com/JosePedroDias/evenlevel.png)](http://stillmaintained.com/JosePedroDias/evenlevel)

[![NPM](https://nodei.co/npm/evenlevel.png?compact=true)](https://nodei.co/npm/evenlevel/)
[![NPM](https://nodei.co/npm-dl/evenlevel.png?months=3)](https://nodei.co/npm/evenlevel/)


Easy API for leveldb on both node.js and the browser.
Isomorphic JavaScript FTW!

It uses these internally:

* [level-js](https://github.com/maxogden/level.js) (on the browser, via indexedDB)
* [leveldown](https://github.com/rvagg/node-leveldown) (on node.js)


to use it in node.js:

`var evenlevel = require('evenlevel');`

to use it in a browser, link to evenlevel files in the dist dir

`<script src="dist/evenlevel.min.js"></script>`


## API

check [here](API.md)


## TODO

* needs unit tests!
* better examples



```javascript
	// the following are disconnected examples of calls. will write better examples later :P

	evenlevel.getStore('table_x', {mode:'withMeta'}, function(err, store) {
	if (err) { throw err; }

	var errOrOk = function(err) { console.log(err ? err : 'OK'); };
	var log = function(v) { console.log(v); };
	var logTrue = function(v) { console.log(v); return true; };

	store.put('key1', {name:'Jesus', age:33}); // cb is optional
	store.put(null, {name:'Mahometh', age:50}); // autogens key if not provided

	store.put('key1', {name:'Jesus', age:33, year:0}); // overriding

	store.get('key1', function(err, val) {
		if (err) { return console.error(err); }
		console.log(val); // notice how the version has increased
	});

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
```

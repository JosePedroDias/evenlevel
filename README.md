easy API for leveldb on both nodejs and browser

uses these internally:

* [level-js](https://github.com/maxogden/level.js) (on the browser)
* [leveldown](https://github.com/rvagg/node-leveldown) (on node.js)


to use it in node.js, require the evenlevel.js on the root
to use it in a browser, link to evenlevel files in the dist dir


## API

check [here](API.md)


## TODO

* needs unit tests!
* better examples



```javascript
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

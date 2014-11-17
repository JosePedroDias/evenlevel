'use strict';

/*global evenlevel:false*/


/*
  -- evenlevel test drive --
  
  open your console and copy &amp; paste these
  empty lines mean submit and watch the result
*/


// aux functions
var cb = function(err, res) { console.log(err, res); };
var cb1 = function(v) { console.log(v); };
var cbTrue = function(v) { console.log(v); return 1; };
var clone = function(o) {
  return JSON.parse( JSON.stringify(o) );
};
var O = {};



// using default raw mode on d1
evenlevel.getStore('demo1', function(err, store) {
  if (err) { return window.alert(err); }
  window.d1 = store;
});

d1.put('lennon', 'john')

d1.put(null, 'paul', cb1) // autogen key

d1.batch([
  {key:'starr', value:'ringo'}, // auto type 'put'
  {value:'george'}, // autogen key
  {type:'del', key:'lennon'} // removing, value is irrelevant here
], cb1)

d1.getPairsRanging(cbTrue)

d1.truncate() // no docs now!

d1.getPairsRanging(cbTrue)



// using json mode on d2
evenlevel.getStore('demo2', {mode:'json'}, function(err, store) {
  if (err) { return window.alert(err); }
  window.d2 = store;
});

// create some docs
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(k) {
	d2.put(k, clone(O));
});

// ranged queries
d2.getValuesRanging(cbTrue)

d2.getKeysRanging(cbTrue)

d2.getPairsRanging(cbTrue, true)

d2.getPairsRanging(cbTrue, false, 'd', 'g')



// using with meta mode on d2
evenlevel.getStore('demo3', {mode:'withMeta'}, function(err, store) {
  if (err) { return window.alert(err); }
  window.d3 = store;
});

// create some docs
'abcdef'.split('').forEach(function(k) {
	d3.put(k, clone(O));
});

d3.getValuesRanging(cbTrue)

// update some docs
'bcd'.split('').forEach(function(k) {
	d3.put(k, clone(O));
});

d3.getValuesRanging(cbTrue)

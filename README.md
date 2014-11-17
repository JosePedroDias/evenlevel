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


## Example usage

check [here](examples.js)


## TODO

* needs unit tests!
* better examples

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


## if you want to develop

get the code from github:

    git clone git@github.com:JosePedroDias/evenlevel.git
    cd evenlevel

install dependencies

    npm install
    make deps

do your editing of `evenlevel.js` ...

rebuild browser bundles:

    make build

check demos for using in both the browser and node.js...


## TODO

* needs unit tests!
* better examples

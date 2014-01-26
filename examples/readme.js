/*

readme.js - readme example script

The MIT License (MIT)

Copyright (c) 2014 Dale Schumacher, Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var adapter = require('../index.js');
var tart = require('tart');

var syncCountVal = 0;
var syncCount = function syncCount() {
    return ++syncCountVal;
};

var obj = {
    value : 0
};
var syncInc = function syncInc(increment) {
    this.value = this.value + increment;
    return this.value;
};

var asyncCountBeh = adapter(syncCount);
var asyncIncBeh = adapter(obj, syncInc);

var sponsor = tart.minimal();

var asyncCount = sponsor(asyncCountBeh);
var asyncInc = sponsor(asyncIncBeh);

var countOk = sponsor(function countOkBeh(message) {
    var self = this.self;
    console.log('current count', message);
    setTimeout(function () {
        asyncCount({ok: self, fail: fail}); // send message to async count
    }, 1000);
});

var incOk = sponsor(function incOkBeh(message) {
    var self = this.self;
    console.log('current inc', message);
    var randomInc = Math.floor(Math.random() * 4);
    setTimeout(function () {
        asyncInc({ok: self, fail: fail, arguments: [randomInc]}); // send message to async inc
    }, Math.random() * 1000);
});

var fail = sponsor(function failBeh(message) {
    console.error('failure', message);
});

asyncCount({ok: countOk, fail: fail});
asyncInc({ok: incOk, fail: fail, arguments: [1]});
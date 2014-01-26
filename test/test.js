/*

test.js - test

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
var tart = require('tart-stepping');

var test = module.exports = {};

test['adapter returns a function'] = function (test) {
    test.expect(1);
    var func = function func () {
        return 42;
    };
    var adaptedBeh = adapter({}, func);
    test.ok(typeof adaptedBeh === 'function');
    test.done();
};

test['adapted behavior sends return value to ok actor'] = function (test) {
    test.expect(2);
    var stepping = tart.stepping();
    var func = function func () {
        return 42;
    };
    var adaptedBeh = adapter({}, func);
    var ok = stepping.sponsor(function (message) {
        test.equal(message, 42);
    });
    stepping.sponsor(adaptedBeh)({ok: ok});
    test.ok(stepping.eventLoop());
    test.done();
};

test['adapted behavior does not crash if no ok actor'] = function (test) {
    test.expect(1);
    var stepping = tart.stepping();
    var func = function func () {
        return 42;
    };
    var adaptedBeh = adapter({}, func);
    stepping.sponsor(adaptedBeh)();
    test.ok(stepping.eventLoop());
    test.done();
};

test['adapted behavior sends exception to fail actor'] = function (test) {
    test.expect(2);
    var stepping = tart.stepping();
    var exception = new Error("boom!");
    var func = function func () {
        throw exception;
    };
    var adaptedBeh = adapter({}, func);
    var fail = stepping.sponsor(function (message) {
        test.strictEqual(message, exception);
    });
    stepping.sponsor(adaptedBeh)({fail: fail});
    test.ok(stepping.eventLoop());
    test.done();
};

test['adapted behavior does not crash if no fail actor'] = function (test) {
    test.expect(1);
    var stepping = tart.stepping();
    var exception = new Error("boom!");
    var func = function func () {
        throw exception;
    };
    var adaptedBeh = adapter({}, func);
    stepping.sponsor(adaptedBeh)();
    test.ok(stepping.eventLoop());
    test.done();
};

test['adapter uses obj as "this"'] = function (test) {
    test.expect(2);
    var stepping = tart.stepping();
    var func = function func () {
        return this.value;
    };
    var adaptedBeh = adapter({value: 42}, func);
    var ok = stepping.sponsor(function (message) {
        test.equal(message, 42);
    });
    stepping.sponsor(adaptedBeh)({ok: ok});
    test.ok(stepping.eventLoop());
    test.done();
};

test['obj is optional'] = function (test) {
    test.expect(2);
    var stepping = tart.stepping();
    var func = function func () {
        return 42;
    };
    var adaptedBeh = adapter(func);
    var ok = stepping.sponsor(function (message) {
        test.equal(message, 42);
    });
    stepping.sponsor(adaptedBeh)({ok: ok});
    test.ok(stepping.eventLoop());
    test.done();
};

test['adapted behavior applies message.arguments to the function'] = function (test) {
    test.expect(2);
    var stepping = tart.stepping();
    var func = function func(add, sub) {
        return 42 + add - sub;
    };
    var adaptedBeh = adapter(func);
    var ok = stepping.sponsor(function (message) {
        test.equal(message, 44); // 42 + 5 - 3
    });
    stepping.sponsor(adaptedBeh)({ok: ok, arguments: [5, 3]});
    test.ok(stepping.eventLoop());
    test.done();
};
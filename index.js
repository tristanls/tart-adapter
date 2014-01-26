/*

index.js - "tart-adapter": Adapter turning syncrhonous functions into asynchronous Tart actors.

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

var tart = require('tart');

/*
  * `obj`: _Object_ _(Default: {})_ Object to bind `this` to when invoking `fn`.
  * `fn`: _Function_ Function to invoke on `obj`.
  * Return: _Behavior_ `function (message) {}` An actor behavior that will call
      `fn` with `message.arguments` and return result as a message to `message.ok`.
      If an exception is thrown, it will be sent to `message.fail`.
*/
var adapter = module.exports = function adapter(obj, fn) {
    // obj is optional and can be skipped
    if (typeof obj === 'function' && fn === undefined) {
        fn = obj;
        obj = {};
    }
    return function applyBeh(message) {
        try {
            var result = fn.apply(obj, message.arguments);
            message && message.ok && message.ok(result);
        } catch (ex) {
            message && message.fail && message.fail(ex);
        }
    };
};
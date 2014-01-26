# tart-adapter

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/tart-adapter.png)](http://npmjs.org/package/tart-adapter)

Adapter turning synchronous functions into asynchronous [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs) actors.

## Contributors

[@dalnefre](https://github.com/dalnefre), [@tristanls](https://github.com/tristanls)

## Overview

Tart adapter turns synchronous functions into asynchronous [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs) actors.

  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
  * [Sources](#sources)

## Usage

To run the below example run:

    npm run readme

```javascript
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
```

## Tests

    npm test

## Documentation

**Public API**

  * [adapter(obj, fn)](#adapterobj-fn)

### adapter(obj, fn)

  * `obj`: _Object_ _(Default: {})_ Object to bind `this` to when invoking `fn`.
  * `fn`: _Function_ Function to invoke on `obj`.
  * Return: _Behavior_ `function (message) {}` An actor behavior that will call `fn` with `message.arguments` and return result as a message to `message.ok`. If an exception is thrown, it will be sent to `message.fail`.

Sets up an actor behavior that wraps invocation of `fn` on `obj`. If `obj` is not provided, it is set to `{}`.

`message.arguments` must be either an `Array` or a pseudo-array `arguments` object.

## Sources

  * [Tiny Actor Run-Time (JavaScript)](https://github.com/organix/tartjs)

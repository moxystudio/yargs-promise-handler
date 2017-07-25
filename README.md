# yargs-promise-handler

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/yargs-promise-handler
[npm-image]:http://img.shields.io/npm/v/yargs-promise-handler.svg
[downloads-image]:http://img.shields.io/npm/dm/yargs-promise-handler.svg
[travis-url]:https://travis-ci.org/moxystudio/yargs-promise-handler
[travis-image]:http://img.shields.io/travis/moxystudio/yargs-promise-handler/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/yargs-promise-handler
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/yargs-promise-handler/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/yargs-promise-handler
[david-dm-image]:https://img.shields.io/david/moxystudio/yargs-promise-handler.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/yargs-promise-handler?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/yargs-promise-handler.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/yargs-promise-handler.svg
[greenkeeper-url]:https://greenkeeper.io

Adds support for promises in yargs handlers and enables composing handlers.


## Installation

`$ npm install yargs-promise-handler --save`


## Why?

`yargs` does [not](https://github.com/yargs/yargs/issues/510) support command handlers that return promises. Users must handle promises and call `process.exit()` manually.

This packages does exactly that under the hood and exposes the original promise under `handler.promise()` to allow handlers to be composable.


## Usage

```js
// commands/random
export const command = 'random';
export const describe = 'A command that either fails or succeeds based on randomness';

export const builder = (argv) => argv;
export const handler = promiseHandler((argv) => Math.random() > 0.5 ?
    Promise.resolve() :
    Promise.reject(Object.assign(new Error('Oh noes'), { exitCode: 5 })));
```

The code above will either exit with code `0` or `5` if the promise either fulfills or rejects respectively.   
Note that if the `error.exitCode` is undefined, it will default to `1`.

The second argument of `promiseHandler` accepts an options object:

- `logError`: Call `console.error(err)` before exiting if the promise fails, defaults to `true`


## Tests

`$ npm test`   
`$ npm test:watch` during development


## License

[MIT License](http://opensource.org/licenses/MIT)

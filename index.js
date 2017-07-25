'use strict';

const pTry = require('p-try');

function promiseHandler(fn, options) {
    options = Object.assign({
        logError: true,
    }, options);

    const promise = (argv) => pTry(() => fn(argv));
    const handler = (argv) =>
        promise(argv)
        .then(() => process.exit(0), (err) => {
            options.logError && console.error(err);
            process.exit(err.exitCode || 1);
        });

    handler.promise = promise;

    return handler;
}

module.exports = promiseHandler;

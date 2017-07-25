'use strict';

const promiseHandler = require('../');

const originalExit = process.originalExit;

function mockExit() {
    return new Promise((resolve) => {
        process.exit = resolve;
    });
}

afterEach(() => {
    process.exit = originalExit;
});

it('should make it exit with 0 if promise fulfills', () => {
    const fn = jest.fn(() => Promise.resolve());
    const handler = promiseHandler(fn, { logError: false });

    handler({ foo: 'bar' });

    return mockExit()
    .then((code) => {
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({ foo: 'bar' });
        expect(code).toBe(0);
    });
});

it('should make it exit with 1 if promise rejects', () => {
    const fn = jest.fn(() => Promise.reject(new Error('foo')));
    const handler = promiseHandler(fn, { logError: false });

    handler({ foo: 'bar' });

    return mockExit()
    .then((code) => {
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({ foo: 'bar' });
        expect(code).toBe(1);
    });
});

it('should make it exit with <code> if promise rejects with an error with exitCode', () => {
    const fn = jest.fn(() => Promise.reject(Object.assign(new Error('foo'), { exitCode: 5 })));
    const handler = promiseHandler(fn, { logError: false });

    handler({ foo: 'bar' });

    return mockExit()
    .then((code) => {
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({ foo: 'bar' });
        expect(code).toBe(5);
    });
});

it('should support sync usage', () => {
    const fn = jest.fn(() => {});
    const handler = promiseHandler(fn, { logError: false });

    handler({ foo: 'bar' });

    return mockExit()
    .then((code) => {
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({ foo: 'bar' });
        expect(code).toBe(0);
    });
});

it('should support sync throw of errors', () => {
    const fn = jest.fn(() => { throw Object.assign(new Error('foo'), { exitCode: 5 }); });
    const handler = promiseHandler(fn, { logError: false });

    handler({ foo: 'bar' });

    return mockExit()
    .then((code) => {
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith({ foo: 'bar' });
        expect(code).toBe(5);
    });
});

it('should have a promise() function', () => {
    const fn = jest.fn(() => Promise.resolve('yea'));
    const handler = promiseHandler(fn, { logError: false });

    expect(typeof handler.promise).toBe('function');

    const promise = handler.promise({ foo: 'bar' });

    expect(typeof promise.then).toBe('function');

    return promise
    .then((ret) => {
        expect(ret).toBe('yea');
    });
});

describe('options', () => {
    const originalConsoleError = console.error;

    afterEach(() => {
        process.exit = originalExit;
        console.error = originalConsoleError;
    });

    it('should not log any error if logError is falsy', () => {
        const err = new Error('foo');
        const handler = promiseHandler(() => Promise.reject(err), { logError: false });

        handler({ foo: 'bar' });

        console.error = jest.fn();

        return mockExit()
        .then((code) => {
            expect(code).toBe(1);
            expect(console.error).toHaveBeenCalledTimes(0);
        });
    });

    it('should log error if logError is truthy', () => {
        const err = new Error('foo');
        const handler = promiseHandler(() => Promise.reject(err));

        handler({ foo: 'bar' });

        console.error = jest.fn();

        return mockExit()
        .then((code) => {
            expect(code).toBe(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledWith(err);
        });
    });
});

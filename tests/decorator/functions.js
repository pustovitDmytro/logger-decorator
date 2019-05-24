import { assert } from 'chai';
import Decorator from '../entry';
import Logger from '../Logger';
import { verifyStdout } from '../utils';

suite('Functions');

test('Decorate a function', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const decorated = decorator()(function (a) {
        return a + 1;
    });

    const res = decorated(5);

    assert.equal(res, 6);
    verifyStdout(logger, { params: '[ 5 ]', result: '6' });
});

test('Decorate a named function', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const decorated = decorator()(function sum(a, b) {
        return a + b;
    });

    const res = decorated(5, 8);

    assert.equal(res, 13);
    verifyStdout(logger, { method: 'sum', params: '[ 5, 8 ]', result: '13' });
});


test('Decorate async function', async function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const decorated = decorator()(
        async function double(a) {
            const t = await new Promise((res) => {
                setTimeout(() => {
                    return res(a * 2);
                }, 50);
            });

            return t;
        });

    const res = await decorated(5);

    assert.equal(res, 10);
    verifyStdout(logger, { method: 'double', params: '[ 5 ]', result: '10' });
});


test('Decorate function, returning a promise', async function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const decorated = decorator()(
        function (a) {
            return new Promise((res) => {
                setTimeout(() => {
                    return res(a * 3);
                }, 50);
            });
        });

    const res = await decorated(5);

    assert.equal(res, 15);
    verifyStdout(logger, { params: '[ 5 ]', result: '15' });
});


test('Function context', async function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    function increment(a) {
        return this.base + a;
    }
    const contextSanitizer = data => data.base;
    const context = { base: 10, _secret: 'wHHXHkd8n' };
    const decorated = decorator({ contextSanitizer })(increment).bind(context);
    const result = decorated(5);

    assert.equal(result, 15);
    verifyStdout(logger, { params: '[ 5 ]', result: '15', context: 10 });
});

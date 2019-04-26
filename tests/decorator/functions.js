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

    decorated(5);

    verifyStdout(logger, { params: '[ 5 ]', result: '6' });
});

test('Decorate a named function', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const decorated = decorator()(function sum(a, b) {
        return a + b;
    });

    decorated(5, 8);

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
                }, 200);
            });

            return t;
        });

    await decorated(5);

    verifyStdout(logger, { method: 'double', params: '[ 5 ]', result: '10' });
});


test('Decorate function, returning a promise', async function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const decorated = decorator()(
        function (a) {
            return new Promise((res) => {
                setTimeout(() => {
                    return res(a * 2);
                }, 200);
            });
        });

    await decorated(5);

    verifyStdout(logger, { params: '[ 5 ]', result: '10' });
});

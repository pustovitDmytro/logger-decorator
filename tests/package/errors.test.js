import { assert } from 'chai';
import { Decorator } from '../entry';
import Logger from '../Logger';

suite('Errors');

test('Negative: function throws error', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    const error = new Error('Please set correct params');
    const decorated = decorator()(function () {
        throw error;
    });

    assert.throws(decorated.bind(null, 5), error);
    assert.isEmpty(logger.stack.verbose);
    assert.include(logger.stack.error[0].error, error.toString());
});

test('Negative: async function throws error', async function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    const error = new Error('care toy degree shirt heart');
    const decorated = decorator()(async function double() {
        await new Promise((res, rej) => {
            setTimeout(() => {
                return rej(error);
            }, 50);
        });
    });

    try {
        await decorated();
    } catch (err) {
        assert.equal(err.toString(), error.toString());
    }

    assert.isEmpty(logger.stack.verbose);
    assert.include(logger.stack.error[0].error, error.toString());
});

test('Negative: function return rejected promise', async function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    const error = new Error('mill share from cattle muscle musical structure progress');
    const decorated = decorator()(function double() {
        return new Promise((res, rej) => {
            setTimeout(() => {
                return rej(error);
            }, 50);
        });
    });

    try {
        await decorated();
    } catch (err) {
        assert.equal(err.toString(), error.toString());
    }

    assert.isEmpty(logger.stack.verbose);
    assert.include(logger.stack.error[0].error, error.toString());
});

test('Negative: different errorLevels on different errors', function () {
    const logger = new Logger({ levels: [ 'warn', 'error' ] });
    const decorator = new Decorator({
        logger,
        errorLevel : ({ error }) => error.message === 'NOT_FOUND' ? 'warn' : 'error'
    });

    const decorated = decorator()(function (err) {
        throw err;
    });

    assert.throws(decorated.bind(null, new Error('NOT_FOUND')));
    assert.isEmpty(logger.stack.error);
    assert.notEmpty(logger.stack.warn);

    logger.clear();

    assert.throws(decorated.bind(null, new Error('FORMAT_ERROR')));
    assert.notEmpty(logger.stack.error);
    assert.isEmpty(logger.stack.warn);
});

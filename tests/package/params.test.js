import { assert } from 'chai';
import { Decorator } from '../entry';
import Logger from '../Logger';
import { verifyStdout } from '../utils';

suite('Params');

test('Positive: function paramsLevel', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger, paramsLevel: 'verbose' });

    const decorated = decorator()(function x(n) {
        if (n > 0) return n * 2;

        return n;
    });

    assert.equal(decorated(4), 8);
    assert.isNotEmpty(logger.stack.verbose);
    verifyStdout(logger, { params: '[ 4 ]', result: '8' }, { level: 'info' });
    verifyStdout(logger, { method: 'x', params: '[ 4 ]' }, { level: 'verbose' });
});


test('Negative: function paramsLevel', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    const decorated = decorator()(function (n) {
        if (n > 0) return n * 2;

        return n;
    });

    assert.equal(decorated(4), 8);

    verifyStdout(logger, { params: '[ 4 ]', result: '8' }, { level: 'info' });

    assert.isEmpty(logger.stack.verbose);
});

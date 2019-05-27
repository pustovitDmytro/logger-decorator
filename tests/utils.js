import { assert } from 'chai';
import { stdout } from 'test-console';
import { toArray } from '../src/utils';

export const testFunction = func => (input, expected) => {
    const out = func(input);

    assert.deepEqual(out, expected);
};

export function verifyStdout(logger, expected, { level = 'info', single = true } = {}) {
    if (single) {
        assert.deepOwnInclude(logger.stdout(level)[0], expected);
    } else {
        assert.deepEqual(logger.stdout(level), toArray(expected));
    }
}

export function verifyConsoleStdout(functionUnderTest, expected, opts = { json: true }) {
    const inspect = stdout.inspect();

    functionUnderTest();
    inspect.restore();
    const [ output ] = inspect.output;

    if (!expected) {
        return assert.notExists(output);
    }
    if (opts.json) {
        const { level, ...message } = JSON.parse(output); // eslint-disable-line no-unused-vars

        return assert.deepEqual(message, expected);
    }
    if (opts.regexp) {
        return expected.forEach(reg => assert.match(output, reg));
    }
    assert.equal(output, expected);
}

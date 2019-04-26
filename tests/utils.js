import { assert } from 'chai';
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

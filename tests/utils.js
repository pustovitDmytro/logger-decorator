import path from 'path';
import { assert } from 'chai';
import { stdout } from 'test-console';
import { toArray } from '../src/utils';
import { entry } from './constants';

export const testFunction = func => (input, expected) => {
    const out = func(input);

    assert.deepEqual(out, expected);
};

export function verifyStdout(logger, expected, { level = 'info', single = true } = {}) {
    if (single) {
        assert.notEmpty(logger.stdout(level));
        assert.deepOwnInclude(logger.stdout(level)[0], expected);
    } else {
        assert.lengthOf(logger.stdout(level), toArray(expected).length);
        for (const [ ind, item ] of logger.stdout(level).entries()) {
            assert.deepOwnInclude(item, toArray(expected)[ind]);
        }
    }
}

// eslint-disable-next-line unicorn/no-object-as-default-parameter
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
        // eslint-disable-next-line unicorn/no-array-for-each
        return expected.forEach(reg => assert.match(output, reg));
    }

    assert.equal(output, expected);
}

export function load(relPath, clearCache) {
    const absPath = path.resolve(entry, relPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];
    // eslint-disable-next-line security/detect-non-literal-require
    const result =  require(absPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];

    return result;
}

export function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

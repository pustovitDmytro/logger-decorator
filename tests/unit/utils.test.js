import { assert } from 'chai';
import { testFunction } from '../utils';
import {
    cleanUndefined,
    mergeConfigs
} from '../../src/utils';

suite('Utils');

test('cleanUndefined', function () {
    const verify = testFunction(cleanUndefined);

    verify({}, {});
    verify({ a: 1, b: 2 }, { a: 1, b: 2 });
    verify({ a: null }, { a: null });
    verify({ a: 1, b: 2, c: null, d: undefined }, { a: 1, b: 2, c: null });
});

test('mergeConfigs', function () {
    const config = mergeConfigs(
        [ { logger: console, contextSanitizer: () => 1 } ],
        [],
        [ { level: 'info', contextSanitizer: () => 2 } ]
    );

    assert.isObject(config);

    assert.equal(config.level, 'info');
    assert.equal(config.contextSanitizer(), 1);
});

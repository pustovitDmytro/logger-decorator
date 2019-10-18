import { testFunction } from '../utils';
import {
    cleanUndefined
} from '../../src/utils';

suite('Utils');

test('cleanUndefined', function () {
    const verify = testFunction(cleanUndefined);

    verify({}, {});
    verify({ a: 1, b: 2 }, { a: 1, b: 2 });
    verify({ a: null }, { a: null });
    verify({ a: 1, b: 2, c: null, d: undefined }, { a: 1, b: 2, c: null });
});

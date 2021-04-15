import { assert } from 'chai';
import entry from '../entry';

suite('Configurations');

test('Default configuration', function () {
    assert.exists(entry);
});

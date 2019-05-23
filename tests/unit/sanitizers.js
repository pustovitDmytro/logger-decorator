import { assert } from 'chai';
import { testFunction } from '../utils';
import {
    sanitizePasswords,
    simpleSanitizer
} from '../../src/utils/sanitizers';

suite('Sanitizers');

test('simple sanitizer', function () {
    [
        {},
        null,
        [],
        [ 1, 2, 3, 4 ],
        { a: { b: { c: { d: 4 } } } }
    ].forEach(input => {
        const result = simpleSanitizer(input);

        assert.typeOf(result, 'string');
    });
});

test('password sanitizer', function () {
    const verify = testFunction(sanitizePasswords);
    const unsensitive = {
        id      : '9ab31412-1ca1-530e-af7f-eb5fef1c6692',
        name    : 'John Password',
        country : 'Tuvalu',
        pass    : 'passsowrd'
    };
    const sensitive = {
        password    : 'lUo0E6opP',
        newPassword : 'jh5b1n3RPj6jdAjS',
        passwords   : [ 'OhTLUnm1', 'VuSegrYtvGUUCCwy' ]
    };
    const blured = {
        password    : '***',
        newPassword : '***',
        passwords   : '***'
    };

    verify(unsensitive, unsensitive);
    verify(sensitive, blured);
    verify([ unsensitive, { ...unsensitive, sensitive } ], [ unsensitive, { ...unsensitive, sensitive: blured  } ]);
});

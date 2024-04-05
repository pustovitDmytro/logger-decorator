import fs from 'fs';
import { assert } from 'chai';
import log, { Decorator, sanitizeRegexp } from '../entry';
import { verifyConsoleStdout } from '../utils';

suite('Configurations');

const isIsoRegexp = /(\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

function sum(a, b) {
    return a + b;
}

test('Import regexp sanitizer', function () {
    const obj = {
        a : 'abc',
        b : 123,
        f : async () => {},
        s : fs.createReadStream('./package.json')
    };

    obj.circular = obj;
    const sanitizer = sanitizeRegexp(/ab/);

    assert.exists(sanitizer(obj));
    assert.deepEqual(sanitizer(obj), {
        a        : 'abc',
        b        : 123,
        circular : '[Circular]',
        f        : '[Function]',
        s        : '[Stream]'
    });
});

test('Default logger', function () {
    const decorated = log()(function (a) {
        return a + 1;
    });

    const expected = [
        /level.*:.*'info'/,
        /params.*:.*'\[ 5 ]'/,
        /result.*:.*'6'/,
        /benchmark.*:.*'\d+\.\d+'/
    ];

    verifyConsoleStdout(() => {
        const res = decorated(5);

        assert.equal(res, 6);
    }, expected, { regexp: true });
});

test('Default configuration for functions', function () {
    const decorator = new Decorator();
    const decorated = decorator()(function (a) {
        return a + 1;
    });

    const expected = [
        /level.*:.*'info'/,
        /params.*:.*'\[ 5 ]'/,
        /result.*:.*'6'/,
        /benchmark.*:.*'\d+\.\d+'/
    ];

    verifyConsoleStdout(() => {
        const res = decorated(5);

        assert.equal(res, 6);
    }, expected, { regexp: true });
});

test('Default configuration for classes', function () {
    const decorator = new Decorator();

    @decorator()
    class Calc {
        sum(a, b) {
            return sum(a, b);
        }
    }
    const instance = new Calc();

    const expected = [
        /level.*:.*'info'/,
        /method.*:.*'sum'/,
        /service.*:.*'Calc'/,
        /params.*:.*'\[ 5, 1 ]'/,
        /result.*:.*'6'/,
        /benchmark.*:.*'\d+\.\d+'/
    ];

    verifyConsoleStdout(() => {
        const res = instance.sum(5, 1);

        assert.equal(res, 6);
    }, expected, { regexp: true });
});

test('Timestamp', function () {
    const decorator = new Decorator({ timestamp: true });
    const decorated = decorator()(sum);
    const expected = [
        /method.*:.*'sum'/,
        /level.*:.*'info'/,
        /params.*:.*'\[ 5, 8 ]'/,
        /result.*:.*'13'/,
        /benchmark.*:.*'\d+\.\d+'/,
        new RegExp(/timestamp.*:.*'/.source + isIsoRegexp.source)
    ];

    verifyConsoleStdout(() => {
        const res = decorated(5, 8);

        assert.equal(res, 13);
    }, expected, { regexp: true });
});

test('Negative: missing target', function () {
    const decorator = new Decorator();

    assert.throws(() => {
        decorator()('dM6u00XwhnJMFSc');
    }, Error, "Can't decorate");
});

test('Negative: broken logger', function () {
    const decorator = new Decorator({ logger: {} });
    const decorated = decorator()(sum);

    assert.throws(() => {
        decorated(5, 9);
    }, Error, 'logger does not support');
});

test('Positive: function logger', function () {
    const catched = [];
    const decorator = new Decorator({ level: 'several', logger: (type, data) => catched.push({ type, data }) });
    const decorated = decorator()(sum);
    const res = decorated(5, 9);

    assert.equal(res, 14);
    assert.equal(catched[0].type, 'several');
    assert.deepOwnInclude(catched[0].data, {
        method : 'sum',
        params : '[ 5, 9 ]',
        result : '14'
    });
});

test('Positive: specify application name', function () {
    const catched = [];
    const decorator = new Decorator({
        name   : 'Atons Forts Bassent',
        logger : (type, data) => catched.push({ type, data })
    });
    const decorated = decorator()(sum);
    const res = decorated(5, 11);

    assert.equal(res, 16);
    assert.deepOwnInclude(catched[0].data, {
        method      : 'sum',
        params      : '[ 5, 11 ]',
        result      : '16',
        application : 'Atons Forts Bassent'
    });
});

test('Negative: dont specify application name', function () {
    const catched = [];
    const decorator = new Decorator({
        logger : (type, data) => catched.push({ type, data })
    });
    const decorated = decorator()(sum);
    const res = decorated(2, 1);

    assert.equal(res, 3);
    assert.deepOwnInclude(catched[0].data, {
        method : 'sum',
        params : '[ 2, 1 ]',
        result : '3'
    });
    assert.notExists(catched[0].data.application);
});


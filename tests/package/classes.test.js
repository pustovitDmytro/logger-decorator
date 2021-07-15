import { assert } from 'chai';
import { Decorator } from '../entry';
import Logger from '../Logger';
import { verifyStdout } from '../utils';

suite('Classes');

test('Decorate a class', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    @decorator({ contextSanitizer: data => data.base })
    class Calculator {
        base = 10;

        _secret = 'x0Hdxx2o1f7WZJ';

        sum(a, b) {
            return a + b + this.base;
        }
    }
    const calculator = new Calculator();
    const res = calculator.sum(5, 7);

    assert.equal(res, 22);

    verifyStdout(logger, { params: '[ 5, 7 ]', result: '22', context: 10 });
});


test('Logger in class method', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger, contextSanitizer: data => ({ base: data.base }) });

    @decorator({ level: 'verbose', contextSanitizer: data => data.base, dublicates: true })
    class Calculator {
        base = 10;

        _secret = 'x0Hdxx2o1f7WZJ';

        @decorator()
        sum(a, b) {
            return a + b + this.base;
        }
    }
    const calculator = new Calculator();
    const res = calculator.sum(5, 7);

    assert.equal(res, 22);

    verifyStdout(logger, { params: '[ 5, 7 ]', result: '22', context: { base: 10 } }, { level: 'info' });
    verifyStdout(logger, { params: '[ 5, 7 ]', result: '22', context: 10 }, { level: 'verbose' });
});

test('Logger while inheritance', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    class A {
        @decorator()
        sum(a, b) {
            return a + b + 1;
        }
    }
    class B extends A {
        sum() {
            return super.sum(...arguments) - 1;
        }
    }
    const b = new B();

    const res = b.sum(3, 9);

    assert.equal(res, 12);

    verifyStdout(logger, { service: 'A', method: 'sum', params: '[ 3, 9 ]', result: '13' }, { level: 'info' });
});

test('disable double logging', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger, contextSanitizer: data => ({ base: data.base }) });

    @decorator({ level: 'verbose', contextSanitizer: data => data.base })
    class Calculator {
        base = 10;

        _secret = 'x0Hdxx2o1f7WZJ';

        @decorator()
        sum(a, b) {
            return a + b + this.base;
        }
    }
    const calculator = new Calculator();
    const res = calculator.sum(5, 7);

    assert.equal(res, 22);

    verifyStdout(logger, { params: '[ 5, 7 ]', result: '22', context: { base: 10 } }, { level: 'info' });
    verifyStdout(logger, [], { level: 'verbose', single: false });
});


test('include/exlude methods', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger, level: 'info' });

    @decorator({ exclude: [ 'addOne' ], include: [ '_sum' ] })
    class Calculator {
        _one() {
            return 1;
        }

        _sum(a, b) {
            return a + b;
        }

        addOne(num) {
            return this._sum(num, this._one());
        }
    }
    const calculator = new Calculator();

    assert.equal(calculator.addOne(15), 16);
    verifyStdout(logger, [ { method: '_sum', params: '[ 15, 1 ]', result: '16' } ], { level: 'info', single: false });
});

test('Class with getters and setters', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const verbose = decorator({ level: 'verbose', getters: true, setters: true });

    @verbose
    class Calculator {
        get one() {
            return 1;
        }

        two = 2

        addOne = a => {
            return this._sum(a, this.one);
        }

        _sum(a, b) {
            return a + b;
        }
    }
    const calculator = new Calculator();
    const res = calculator.addOne(13);

    assert.equal(res, 14);
    verifyStdout(logger, { params: '[]', result: '1', method: 'one' }, { level: 'verbose' });
});


test('Class support for class-properties (as-class method)', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const verbose = decorator({ level: 'verbose' });

    decorator({ level: 'info', getters: false });
    class Calculator {
        get one() {
            return 1;
        }

        two = 2

        @verbose
        addOne = a => {
            return this._sum(a, this.one);
        }

        _sum(a, b) {
            return a + b;
        }
    }
    const calculator = new Calculator();
    const res = calculator.addOne(13);

    assert.equal(res, 14);
    verifyStdout(logger, { params: '[ 13 ]', result: '14', method: 'addOne' }, { level: 'verbose' });
});

test('Class support for class-properties in class decorator', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });
    const verbose = decorator({ level: 'verbose', classProperties: true });

    @verbose
    class Calculator {
        get one() {
            return 1;
        }

        two = 2

        addOne = a => {
            return this._sum(a, this.one);
        }

        _sum(a, b) {
            return a + b;
        }
    }
    const calculator = new Calculator();

    assert.equal(calculator.addOne(13), 14);
    verifyStdout(logger, { params: '[ 13 ]', result: '14', method: 'addOne' }, { level: 'verbose' });
});

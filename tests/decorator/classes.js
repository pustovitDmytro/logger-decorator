import { assert } from 'chai';
import Decorator from '../entry';
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
    verifyStdout(logger, { params: '[ 5, 7 ]', result: '22', context: 10 }, { level: 'verbose' });
});

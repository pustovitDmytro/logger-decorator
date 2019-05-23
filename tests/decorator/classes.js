import { assert } from 'chai';
import Decorator from '../entry';
import Logger from '../Logger';
import { verifyStdout } from '../utils';

suite('Classes');

test('Decorate a class', function () {
    const logger = new Logger();
    const decorator = new Decorator({ logger });

    @decorator()
    class Calculator {
        sum(a, b) {
            return a + b;
        }
    }
    const calculator = new Calculator();

    const res = calculator.sum(5, 7);

    assert(res, 12);

    verifyStdout(logger, { params: '[ 5, 7 ]', result: '12' });
});

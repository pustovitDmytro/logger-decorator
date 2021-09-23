import { inspect } from 'util';
import { assert } from 'chai';
import { pause, startBenchmark, getBenchmark } from 'myrmidon';
import { Decorator } from '../entry';

const logger = {
    info  : () => {},
    error : () => {}
};

suite('Performance: Classes');

class PerformanceTester {
    async timer(time, val) {
        await pause(time);

        return val;
    }
}

const defaultPauseTime = 10;
const allowedPerformanceLossesMS = 10;

const seeds = {};

async function bench(func) {
    const start = startBenchmark();

    await func();

    return +getBenchmark(start);
}

before(async function () {
    const runner = new PerformanceTester();

    seeds.default = await bench(() => runner.timer(defaultPauseTime));

    seeds.largeArray = Array.from({ length: 10_000 }).map(() => ({
        value : { inner: null }
    }));
});

test('class-logger with inspect sanitizers', async function () {
    const decorator = new Decorator({
        logger,
        timestamp : true,

        resultSanitizer : inspect,
        paramsSanitizer : inspect
    });

    @decorator()
    class Tester extends PerformanceTester {}
    const runner = new Tester();

    const result = await bench(() => runner.timer(defaultPauseTime, seeds.largeArray));

    assert.isAtMost(result, seeds.default + allowedPerformanceLossesMS);
});

test('class-logger errorsOnly', async function () {
    const decorator = new Decorator({
        logger,

        errorsOnly : true,
        timestamp  : true
    });

    @decorator()
    class Tester extends PerformanceTester {}
    const runner = new Tester();

    const result = await bench(() => runner.timer(5, seeds.largeArray));

    assert.isAtMost(result, seeds.default + 4);
});

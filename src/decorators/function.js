
import {
    isPromise,
    isFunction,
    cleanUndefined
} from '../utils';

import {
    getBenchmark,
    startBenchmark
} from '../utils/benchmark';

const _decorated = Symbol('_decorated');

export default function functionDecorator(method, config = {}) {
    const {
        logger,
        methodName,
        level,
        paramsSanitizer,
        resultSanitizer,
        errorSanitizer,
        contextSanitizer,
        timestamp,
        dublicates, // TODO: rename to duplicates
        errorLevel
    } = {
        methodName : method.name,
        ...config
    };

    const basicLogObject = {
        service     : config.serviceName,
        method      : methodName,
        application : config.name,
        level
    };

    const buildLogObject = obj => {
        const { args, result, error, time, context } = obj;

        return cleanUndefined({
            ...basicLogObject,
            params    : paramsSanitizer(args),
            result    : result && resultSanitizer(result),
            error     : error && errorSanitizer(error),
            context   : (contextSanitizer && context) ? contextSanitizer(context) : undefined,
            benchmark : getBenchmark(time),
            timestamp : timestamp ? (new Date()).toISOString() : undefined
        });
    };

    const buildLogLevel = (logLevel, data) => {
        if (isFunction(logLevel)) return logLevel(data);

        return logLevel;
    };

    const log = (logLevel, data) => {
        const lev = buildLogLevel(logLevel, data);
        const dat = buildLogObject(data);

        if (isFunction(logger)) return logger(lev, dat);
        if (isFunction(logger[lev])) return logger[lev](dat);
        throw new Error(`logger not supports ${lev} level`);
    };

    const onSuccess = data => {
        log(level, data);

        return data.result;
    };

    const onError = (data) => {
        log(errorLevel, data);

        throw data.error;
    };

    if (!dublicates && method[_decorated]) return method;

    // eslint-disable-next-line func-style
    const f =  function (...args) {
        const time = startBenchmark();
        const loggerData = { args, time, context: this };

        try {
            const promise = method.apply(this, args);

            if (isPromise(promise)) {
                return promise // eslint-disable-line more/no-then
                    .then(result => onSuccess({ result, ...loggerData }))
                    .catch(error => onError({ error, ...loggerData }));
            }

            return onSuccess({ result: promise, ...loggerData });
        } catch (error) {
            onError({ error, ...loggerData });
        }
    };

    f[_decorated] = true;

    return f;
}

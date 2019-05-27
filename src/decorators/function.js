
import defaults from '../defaults';
import {
    isPromise,
    isFunction,
    cleanUndefined
} from '../utils';
import {
    getBenchmark,
    startBenchmark
} from '../utils/benchmark';

export default function functionDecorator(method, config = {}) {
    const {
        logger,
        methodName,
        level,
        paramsSanitizer,
        resultSanitizer,
        errorSanitizer,
        contextSanitizer,
        timestamp
    } = {
        methodName : method.name,
        ...defaults,
        ...this,
        ...config
    };
    const basicLogObject = {
        service     : config.serviceName,
        method      : methodName,
        application : this.name,
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

    const log = (logLevel, data) => {
        if (isFunction(logger)) return logger(logLevel, data);
        if (isFunction(logger[logLevel])) return logger[logLevel](data);
        throw new Error(`logger not supports ${logLevel} level`);
    };

    const onSuccess = data => {
        log(level, buildLogObject(data));

        return data.result;
    };

    const onError = (data) => {
        log('error', buildLogObject(data));

        throw data.error;
    };

    return function (...args) {
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
}

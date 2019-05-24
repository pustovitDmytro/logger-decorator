
import { defaultSanitizer, defaultLevel } from '../defaults';
import {
    isPromise,
    cleanUndefined
} from '../utils';
import {
    getBenchmark,
    startBenchmark
} from '../utils/benchmark';

// serviceName,
// methodName,
// paramsSanitizer = defaultSanitizer,
// resultSanitizer = defaultSanitizer,
// errorSanitizer = defaultSanitizer,
// contextSanitizer,
// level
export default function functionDecorator(method, config = {}) {
    const methodName = config.methodName || method.name;
    const level = config.level || this.level || defaultLevel;
    const paramsSanitizer = config.paramsSanitizer || defaultSanitizer;
    const resultSanitizer = config.resultSanitizer || defaultSanitizer;
    const errorSanitizer = config.errorSanitizer || defaultSanitizer;
    const contextSanitizer = config.contextSanitizer || this.contextSanitizer;
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
            timestamp : this.timestamp ? new Date() : undefined
        });
    };

    const onSuccess = data => {
        this.logger[level](buildLogObject(data));

        return data.result;
    };

    const onError = (data) => {
        this.logger.error(buildLogObject(data));

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


import { defaultSanitizer, defaultLevel } from '../defaults';
import {
    isPromise,
    cleanUndefined
} from '../utils';
import {
    getBenchmark,
    startBenchmark
} from '../utils/benchmark';

export default function functionDecorator(method, {
    serviceName,
    methodName,
    paramsSanitizer = defaultSanitizer,
    resultSanitizer = defaultSanitizer,
    errorSanitizer = defaultSanitizer,
    contextSanitizer,
    level
} = {}) {
    const logMethodName = methodName || method.name;
    const logLevel = level || this.level || defaultLevel;
    const basicLogObject = {
        service     : serviceName,
        method      : logMethodName,
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
        this.logger[logLevel](buildLogObject(data));

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

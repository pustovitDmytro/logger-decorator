
import defaults from '../defaults';
import {
    isPromise,
    cleanUndefined
} from '../utils';
import {
    getBenchmark,
    startBenchmark
} from '../utils/benchmark';

export default function functionDecorator(method, config = {}) {
    const {
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

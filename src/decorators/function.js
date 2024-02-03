
import {
    isFunction,
    cleanUndefined,

    getBenchmark,
    startBenchmark,
    FunctionDecorator as BaseFunctionDecorator
} from 'myrmidon';

const _decorated = Symbol('_decorated');

const buildLogLevel = (logLevel, data) => {
    if (isFunction(logLevel)) return logLevel(data);

    return logLevel;
};

export default class FunctionDecorator extends BaseFunctionDecorator {
    constructor({ config }) {
        super({
            config : {
                ...config,
                duplicates : config.dublicates
            }
        });
    }

    decoratedKey = _decorated;

    prepareData({ context, methodName }) {
        const {
            logger,
            paramsSanitizer,
            resultSanitizer,
            errorSanitizer,
            contextSanitizer,
            timestamp
        } = this.config;

        const basicLogObject = {
            service     : this.config.serviceName,
            method      : methodName,
            application : this.name
        };

        const buildLogObject = (level, obj) => {
            const { args, result, error, time } = obj;

            return cleanUndefined({
                ...basicLogObject,
                level,
                params    : paramsSanitizer(args),
                result    : result && resultSanitizer(result),
                error     : error && errorSanitizer(error),
                context   : (contextSanitizer && context) ? contextSanitizer(context) : undefined,
                benchmark : time ? getBenchmark(time) : undefined,
                timestamp : timestamp ? (new Date()).toISOString() : undefined
            });
        };

        const log = (logLevel, data) => {
            const lev = buildLogLevel(logLevel, data);
            const dat = buildLogObject(lev, data);

            if (isFunction(logger)) return logger(lev, dat);
            if (isFunction(logger[lev])) return logger[lev](dat);
            throw new Error(`logger not supports ${lev} level`);
        };

        const time = startBenchmark();

        return {
            context,
            methodName,
            log,
            time,
            config : this.config
        };
    }

    onParams({ params, config, log, context }) {
        const { paramsLevel } = config;

        if (paramsLevel) {
            log(paramsLevel, {
                args : params,
                context
            });
        }

        return params;
    }

    onSuccess({ result, log, config, time, context, params }) {
        if (config.level && !config.errorsOnly) {
            log(config.level, {
                result,
                args : params,
                time,
                context
            });
        }

        return result;
    }

    onError({ error, log, config, time, context, params }) {
        const { logErrors, errorLevel } = config;

        const isFirstOnly = logErrors && logErrors === 'deepest';

        if (!isFirstOnly || !error[_decorated]) {
            log(errorLevel, {
                error,
                args : params,
                time,
                context
            });
        }

        if (isFirstOnly)  error[_decorated] = true; // eslint-disable-line no-param-reassign

        throw error;
    }
}

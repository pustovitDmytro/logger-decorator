
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
    prepareData({ context, methodName }) {
        const {
            logger,
            level,
            paramsSanitizer,
            resultSanitizer,
            errorSanitizer,
            contextSanitizer,
            timestamp
        } = this.config;

        const basicLogObject = {
            service     : this.config.serviceName,
            method      : methodName,
            application : this.name,
            level
        };

        const buildLogObject = obj => {
            const { args, result, error, time } = obj;

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
            const lev = buildLogLevel(logLevel, data);
            const dat = buildLogObject(data);

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
        log(config.errorLevel, {
            error,
            args : params,
            time,
            context
        });

        throw error;
    }

    run(method) {
        const {
            dublicates // TODO: rename to duplicates
        } = this.config;

        if (!dublicates && method[_decorated]) return method;

        const f = super.run(method);

        f[_decorated] = true;

        return f;
    }
}

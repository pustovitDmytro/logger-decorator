
import {
    isFunction,
    ClassMethodDecorator as BaseClassMethodDecorator,
    ClassDecorator as BaseClassDecorator
} from 'myrmidon';
import defaults from '../defaults';
import FunctionDecorator from './function';

class ClassMethodDecorator extends BaseClassMethodDecorator {
    constructor(opts) {
        const {
            config
        } = opts;

        super(opts);

        if (config.getters) this.methods.push('get');
        if (config.setters) this.methods.push('set');
    }

    static FunctionDecorator = FunctionDecorator;

    getFunctionDecoratorConfig() {
        return {
            ...super.getFunctionDecoratorConfig(),
            serviceName : this.config.serviceName || this.target.constructor.name
        };
    }
}

export function classMethodDecorator({ target, methodName, descriptor }, config = {}) {
    const a = new ClassMethodDecorator({
        methodName,
        descriptor,
        config,
        target
    });

    return a.run();
}

class ClassDecorator extends BaseClassDecorator {
    static ClassMethodDecorator = ClassMethodDecorator;

    getClassMethodDecoratorConfig(params) {
        const { target } = params;

        return {
            ...super.getClassMethodDecoratorConfig(params),
            serviceName : target.constructor.name
        };
    }

    filterMethodName(name) {
        if (this.config.include?.includes(name)) return true;
        if (this.config.exclude?.includes(name)) return false;

        return isFunction(this.config.methodNameFilter)
            ? this.config.methodNameFilter(name)
            : defaults.methodNameFilter(name);
    }
}

function decorateClass(target, config) {
    const decorator = new ClassDecorator({ config });

    return decorator.decorate(target);
}

export default function getClassLoggerDecorator(target, config = {}) {
    if (config.classProperties) {
        return class extends target {
            constructor(...args) {
                super(...args);
                decorateClass(this, config);
            }
        };
    }

    decorateClass(target.prototype, config);
}


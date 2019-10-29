
import { getMethodNames, isFunction } from '../utils';
import defaults from '../defaults';
import functionDecorator from './function';

function getMethodDescriptor(propertyName, target) {
    if (target.hasOwnProperty(propertyName)) {
        return Object.getOwnPropertyDescriptor(target, propertyName);
    }

    return {
        configurable : true,
        enumerable   : true,
        writable     : true,
        value        : target[propertyName]
    };
}

export function classMethodDecorator({ target, methodName, descriptor }, config = {}) {
    const methods = [ 'value', 'initializer' ];

    if (config.getters) methods.push('get');
    if (config.setters) methods.push('set');
    const functionDecoratorConfig = {
        ...config,
        methodName,
        serviceName : config.serviceName || target.constructor.name
    };

    methods
        .filter(key => descriptor[key] && isFunction(descriptor[key]))
        .forEach(key => {
            const old = descriptor[key];

            descriptor[key] = key === 'initializer'// eslint-disable-line no-param-reassign
                ? function () {
                    return functionDecorator(
                        old.call(target),
                        functionDecoratorConfig
                    );
                }
                : functionDecorator(
                    descriptor[key],
                    functionDecoratorConfig
                );
        });

    return descriptor;
}

function decorateClass(target, config) {
    getMethodNames(target)
        .filter(methodName => {
            if (config.include?.includes(methodName)) {
                return true;
            }

            if (config.exclude?.includes(methodName)) {
                return false;
            }

            return isFunction(config.methodNameFilter)
                ? config.methodNameFilter(methodName)
                : defaults.methodNameFilter(methodName);
        })
        .forEach(methodName => {
            const descriptor = getMethodDescriptor(methodName, target);

            if (!descriptor) return;

            Object.defineProperty(
                target,
                methodName,
                classMethodDecorator(
                    { target, methodName, descriptor },
                    { serviceName: target.name,  ...config }
                )
            );
        });
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


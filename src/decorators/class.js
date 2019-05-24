
import { getMethodNames } from '../utils';
import functionDecorator from './function';

function getMethodDescriptor(propertyName, target) {
    if (target.prototype.hasOwnProperty(propertyName)) {
        return Object.getOwnPropertyDescriptor(target.prototype, propertyName);
    }

    return {
        configurable : true,
        enumerable   : true,
        writable     : true,
        value        : target.prototype[propertyName]
    };
}

export function classMethodDecorator({ target, methodName, descriptor }, config = {}) {
    descriptor.value = functionDecorator.call( // eslint-disable-line no-param-reassign
        this,
        descriptor.value,
        {
            ...config,
            methodName,
            serviceName : config.serviceName || target.constructor.name
        }
    );

    return descriptor;
}

export default function getClassLoggerDecorator(target, config = {}) {
    getMethodNames(target.prototype).forEach(methodName => {
        const descriptor = getMethodDescriptor(methodName, target);

        Object.defineProperty(
            target.prototype,
            methodName,
            classMethodDecorator.call(
                this,
                { target, methodName, descriptor },
                { serviceName: target.name,  ...config }
            )
        );
    });
}


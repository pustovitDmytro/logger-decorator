
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

export default function getClassLoggerDecorator(serviceName, config = {}) {
    return target => {
        const logServiceName = serviceName || target.name;

        getMethodNames(target.prototype).forEach(methodName => {
            const descriptor = getMethodDescriptor(methodName, target);
            const originalMethod = descriptor.value;

            descriptor.value = functionDecorator.bind(this)(originalMethod, {
                serviceName : logServiceName,
                methodName,
                ...config
            });

            Object.defineProperty(target.prototype, methodName, descriptor);
        });
    };
}

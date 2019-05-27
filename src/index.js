import { isClass, isFunction } from './utils';
import {
    functionDecorator,
    classMethodDecorator,
    classDecorator
} from  './decorators';

module.exports = class Decorator {
    constructor(opts = {}) {
        return (...args) => {
            return (target, methodName, descriptor) => {
                if (methodName && descriptor) {
                    return classMethodDecorator.call(
                        opts,
                        { target, methodName, descriptor },
                        ...args
                    );
                }
                if (isClass(target)) {
                    return classDecorator.call(opts, target, ...args);
                }
                if (isFunction(target)) {
                    return functionDecorator.call(opts, target, ...args);
                }
                throw new Error(`Can't decorate ${typeof target}, only functions, classes and class methods are allowed`);
            };
        };
    }
};

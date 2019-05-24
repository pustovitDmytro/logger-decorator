import { isClass, isFunction } from './utils';
import {
    functionDecorator,
    classDecorator
} from  './decorators';

module.exports = class Decorator {
    constructor(opts) {
        return (...args) => {
            return target => {
                if (isClass(target)) return classDecorator.bind(opts)(...args)(target);
                if (isFunction(target)) return functionDecorator.bind(opts)(target, ...args);
            };
        };
    }
};

import { isClass, isFunction } from './utils';
import {
    functionDecorator,
    classDecorator
} from  './decorators';

module.exports = class Decorator {
    constructor(opts) {
        this.logger = opts.logger;
        this.name = opts.name;
        this.timestamp = opts.timestamp;

        return (...args) => {
            return target => {
                console.log('this: ', this);
                if (isClass(target)) return classDecorator.bind(this)(...args)(target);
                if (isFunction(target)) return functionDecorator.bind(this)(target, ...args);
            };
        };
    }
};

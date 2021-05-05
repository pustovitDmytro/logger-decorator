import { isClass, isFunction, mergeConfigs } from './utils';
import {
    functionDecorator,
    classMethodDecorator,
    classDecorator
} from  './decorators';
import defaultConfig from './defaults';
import { sanitizeRegexp } from './utils/sanitizers';

const dfc = [ defaultConfig ];

export class Decorator {
    constructor(...opts) {
        // eslint-disable-next-line no-constructor-return
        return (...args) => {
            return (target, methodName, descriptor) => {
                if (methodName && descriptor) {
                    return classMethodDecorator(
                        { target, methodName, descriptor },
                        ...mergeConfigs(args, opts, dfc)
                    );
                }

                if (isClass(target)) {
                    return classDecorator(target, ...mergeConfigs(args, opts, dfc));
                }

                if (isFunction(target)) {
                    return functionDecorator(target, ...mergeConfigs(args, opts, dfc));
                }

                throw new Error(`Can't decorate ${typeof target}, only functions, classes and class methods are allowed`);
            };
        };
    }
}

export default new Decorator();

export {
    sanitizeRegexp
};


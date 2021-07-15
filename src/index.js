import { isClass, isFunction } from 'myrmidon';
import { mergeConfigs } from './utils';
import {
    FunctionDecorator,
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
            const config = mergeConfigs(args, opts, dfc);

            return (target, methodName, descriptor) => {
                if (methodName && descriptor) {
                    return classMethodDecorator(
                        { target, methodName, descriptor },
                        config
                    );
                }

                if (isClass(target)) {
                    return classDecorator(target, config);
                }

                if (isFunction(target)) {
                    const functionDecorator = new FunctionDecorator({ config });

                    return functionDecorator.run(target);
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


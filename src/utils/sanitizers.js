import { inspect } from 'util';
import { isFunction, isArray, isObject } from './index';

function sanitizeRegexp(regexp) {
    return function sanitize(data) {
        if (isFunction(data)) return '[Function]';
        if (isArray(data)) return data.map(sanitize);
        if (isObject(data)) {
            const sanitized = {};

            Object.entries(data)
                .forEach(([ key, value ]) => {
                    sanitized[key] = regexp.test(key)
                        ? '***'
                        : sanitize(value);
                });

            return sanitized;
        }

        return data;
    };
}

export const sanitizePasswords = sanitizeRegexp(/password/i);

export function simpleSanitizer(data) {
    return inspect(data);
}

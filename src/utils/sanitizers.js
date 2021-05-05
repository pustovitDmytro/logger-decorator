import { inspect } from 'util';
import { isFunction, isArray, isObject, isStream } from './index';

function sanitize(data, { regexp, cache }) {
    if (isStream(data)) return '[Stream]';
    if (isFunction(data)) return '[Function]';
    if (isArray(data)) return data.map(i => sanitize(i, { regexp, cache }));
    if (isObject(data)) {
        if (~cache.indexOf(data)) {
            return '[Circular]';
        }

        cache.push(data);
        const sanitized = {};

        Object.entries(data)
            .forEach(([ key, value ]) => {
                sanitized[key] = regexp.test(key)
                    ? '***'
                    : sanitize(value, { regexp, cache });
            });

        return sanitized;
    }

    return data;
}

export function sanitizeRegexp(regexp) {
    return function (data) {
        const cache = [];

        return sanitize(data, { regexp, cache });
    };
}

export const sanitizePasswords = sanitizeRegexp(/password/i);

export function simpleSanitizer(data) {
    return inspect(data);
}

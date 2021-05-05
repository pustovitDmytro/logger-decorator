const isGetter = (x, name) => (Object.getOwnPropertyDescriptor(x, name) || {}).get;

const deepFunctions = x =>
    x && x !== Object.prototype && Object.getOwnPropertyNames(x)
        .filter(name => isGetter(x, name) || isFunction(x[name]))
        .concat(deepFunctions(Object.getPrototypeOf(x)) || []);


export const getMethodNames = x => Array.from(new Set(deepFunctions(x)));

export function isString(x) {
    return x && Object.prototype.toString.call(x) === '[object String]';
}

export function isClass(v) {
    return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}

export function isFunction(x) {
    return x && [ '[object Function]', '[object AsyncFunction]' ].includes(Object.prototype.toString.call(x));
}

export function isEmpty(x) {
    return x && x.constructor === Object && Object.keys(x).length === 0;
}

export function isObject(x) {
    return x && Object.prototype.toString.call(x) === '[object Object]';
}

export function isArray(x) {
    return x && Object.prototype.toString.call(x) === '[object Array]';
}

export function isPromise(x) {
    return x && Object.prototype.toString.call(x) === '[object Promise]';
}

export function toArray(value) {
    if (!value) return [];

    return isArray(value) ? value : [ value ];
}

export function isStream(x) {
    return x && isFunction(x.pipe);
}

export function cleanUndefined(obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') cleanUndefined(obj[key]);
        else if (obj[key] === undefined) delete obj[key]; // eslint-disable-line no-param-reassign
    });

    return obj;
}

export function mergeConfigs(...configs) {
    const config = {};

    for (const [ conf = {} ] of configs.reverse()) {
        Object.keys(conf).forEach(key => {
            config[key] = conf[key];
        });
    }

    return [ config ];
}

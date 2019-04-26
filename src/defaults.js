import { inspect } from 'util';

export function defaultSanitizer(data) {
    return inspect(data);
}

export function defaultLogger(data) {
    console.log(data);
}

export const defaultLevel = 'info';


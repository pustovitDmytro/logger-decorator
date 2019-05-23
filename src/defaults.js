import { sanitizePasswords, simpleSanitizer } from './utils/sanitizers';

export function defaultSanitizer(data) {
    return simpleSanitizer(sanitizePasswords(data));
}

export function defaultLogger(data) {
    console.log(data);
}

export const defaultLevel = 'info';


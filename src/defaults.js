import { sanitizePasswords, simpleSanitizer } from './utils/sanitizers';

function defaultDataSanitizer(data) {
    return simpleSanitizer(sanitizePasswords(data));
}

export function defaultLogger(data) {
    console.log(data);
}

const defaultLevel = 'info';

export default {
    level           : defaultLevel,
    paramsSanitizer : defaultDataSanitizer,
    resultSanitizer : defaultDataSanitizer,
    errorSanitizer  : simpleSanitizer
};


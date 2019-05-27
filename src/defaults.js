import { sanitizePasswords, simpleSanitizer } from './utils/sanitizers';

function defaultDataSanitizer(data) {
    return simpleSanitizer(sanitizePasswords(data));
}

const defaultLevel = 'info';

export default {
    level           : defaultLevel,
    paramsSanitizer : defaultDataSanitizer,
    resultSanitizer : defaultDataSanitizer,
    errorSanitizer  : simpleSanitizer,
    logger          : console
};


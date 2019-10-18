import { sanitizePasswords, simpleSanitizer } from './utils/sanitizers';

function defaultDataSanitizer(data) {
    return simpleSanitizer(sanitizePasswords(data));
}

const defaultLevel = 'info';
const defaultErrorLevel = 'error';

export default {
    level           : defaultLevel,
    errorLevel      : defaultErrorLevel,
    paramsSanitizer : defaultDataSanitizer,
    resultSanitizer : defaultDataSanitizer,
    errorSanitizer  : simpleSanitizer,
    logger          : console
};


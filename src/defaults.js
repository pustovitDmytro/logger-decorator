import { sanitizePasswords, simpleSanitizer } from './utils/sanitizers';

function defaultDataSanitizer(data) {
    return simpleSanitizer(sanitizePasswords(data));
}

const defaultLevel = 'info';
const defaultErrorLevel = 'error';

const defaultMethodNameFilter = name => name !== 'constructor' && name.indexOf('_') !== 0;

export default {
    level            : defaultLevel,
    errorLevel       : defaultErrorLevel,
    paramsSanitizer  : defaultDataSanitizer,
    resultSanitizer  : defaultDataSanitizer,
    errorSanitizer   : simpleSanitizer,
    methodNameFilter : defaultMethodNameFilter,
    logger           : console
};


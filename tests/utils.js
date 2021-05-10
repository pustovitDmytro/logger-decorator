import path from 'path';
import { entry } from './constants';

export function load(relPath) {
    const absPath = path.resolve(entry, relPath);

    delete require.cache[require.resolve(absPath)];
    // eslint-disable-next-line security/detect-non-literal-require
    const result =  require(absPath);

    delete require.cache[require.resolve(absPath)];

    return result;
}

export function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

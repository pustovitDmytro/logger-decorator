import path from 'path';
import fse from 'fs-extra';
import { tmpFolder, entry } from './constants';

export default class Test {
    async setTmpFolder() {
        await fse.ensureDir(tmpFolder);
    }

    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }
}

function load(relPath) {
    // eslint-disable-next-line security/detect-non-literal-require
    return require(path.join(entry, relPath));
}

function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

export {
    tmpFolder,
    entry,
    load,
    resolve
};

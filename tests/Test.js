import fse from 'fs-extra';
import { tmpFolder } from './constants';

export default class Test {
    async setTmpFolder() {
        await fse.ensureDir(tmpFolder);
    }

    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }
}

export {
    tmpFolder
};

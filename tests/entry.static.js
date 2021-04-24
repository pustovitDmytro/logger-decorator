import path from 'path';

export default require('{entry}');

export function _load(relPath) {
    return require(path.join('{entry}', relPath));
}

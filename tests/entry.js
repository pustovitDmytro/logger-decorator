/* eslint-disable security/detect-non-literal-require */
import path from 'path';

const isBuild = process.env.BUILD && [ '1', 'true' ].includes(process.env.BUILD);
const entry = process.env.ENTRY && path.resolve(process.env.ENTRY)
|| isBuild && path.resolve(__dirname, '../lib')
|| path.resolve(__dirname, '../src');

export default require(entry);
module.exports = require(entry);
function _load(relPath) {
    return require(path.join(entry, relPath));
}

_load.resolve = function (relPath) {
    return require.resolve(path.join(entry, relPath));
};

export { _load };

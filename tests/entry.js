/* eslint-disable security/detect-non-literal-require */
import path from 'path';

const isBuild = process.env.BUILD && [ '1', 'true' ].includes(process.env.BUILD);
const entry = process.env.ENTRY && path.resolve(process.env.ENTRY)
|| isBuild && path.resolve(__dirname, '../lib')
|| path.resolve(__dirname, '../src');

module.exports = require(entry);

export function _load(relPath) {
    return require(path.join(entry, relPath));
}

/* eslint-disable import/no-commonjs */
const { Module } = require('module');
const path = require('path');

function clearRequireCache() {
    for (const key of Object.keys(require.cache)) {
        delete require.cache[key];
    }
}

function isPathInside(childPath, parentPath) {
    const relation = path.relative(parentPath, childPath);

    return Boolean(
        relation &&
		relation !== '..' &&
		!relation.startsWith(`..${path.sep}`) &&
		relation !== path.resolve(childPath)
    );
}

const ROOT_FOLDER = process.cwd();

function preventParentScopeModules() {
    const nodeModulePaths = Module._nodeModulePaths;

    Module._nodeModulePaths = function (from) {
        const originalPath = nodeModulePaths.call(this, from);


        return originalPath.filter(function (p) {
            return isPathInside(p, ROOT_FOLDER);
        });
    };
}

clearRequireCache();
preventParentScopeModules();

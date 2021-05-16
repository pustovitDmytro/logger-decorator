/* eslint-disable import/no-commonjs */
const { Module } = require('module');
const path = require('path');

function clearRequireCache() {
    Object.keys(require.cache).forEach((key) => {
        delete require.cache[key];
    });
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
        const insideRootPaths = originalPath.filter(function (p) {
            return isPathInside(p, ROOT_FOLDER);
        });

        return insideRootPaths;
    };
}

clearRequireCache();
preventParentScopeModules();

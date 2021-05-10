// eslint-disable-next-line import/no-commonjs
const { Module } = require('module');

function clearRequireCache() {
    Object.keys(require.cache).forEach((key) => {
        delete require.cache[key];
    });
}

const ROOT_FOLDER = process.cwd();

function preventParentScopeModules() {
    const nodeModulePaths = Module._nodeModulePaths;

    Module._nodeModulePaths = function (from) {
        const originalPath = nodeModulePaths.call(this, from);
        const insideRootPaths = originalPath.filter(function (path) {
            return path.match(ROOT_FOLDER);
        });

        return insideRootPaths;
    };
}

clearRequireCache();
preventParentScopeModules();

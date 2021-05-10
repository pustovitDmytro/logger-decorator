// eslint-disable-next-line import/no-commonjs
const { Module } = require('module');

function clearRequireCache() {
    Object.keys(require.cache).forEach((key) => {
        delete require.cache[key];
    });
}

function preventParentScopeModules() {
    const nodeModulePaths = Module._nodeModulePaths; // backup the original method

    Module._nodeModulePaths = function (from) {
        let paths = nodeModulePaths.call(this, from); // call the original method

        // add your logic here to exclude parent dirs, I did a simple match with current dir
        paths = paths.filter(function (path) {
            return path.match(__dirname);
        });

        return paths;
    };
}

clearRequireCache();
preventParentScopeModules();

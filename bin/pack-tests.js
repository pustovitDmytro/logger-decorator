#!./node_modules/.bin/babel-node

import path from 'path';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import multi from '@rollup/plugin-multi-entry';
import babel from '@rollup/plugin-babel';
import fs from 'fs-extra';
import packajeInfo from '../package.json';

const isMain = !module.parent;
const DIR = path.resolve('./tmp/package-tests');

const COPY = [
    [ 'tests/init.js',  'tests-init.js' ],

    [ '.mocharc.bundle.json', '.mocharc.json' ]
];

const TEST_MODULES = [
    'mocha'
];

const resolveIgnoreRegexp = `^(?!${TEST_MODULES.join('|')}).*$`;

async function run(tarFilePath) {
    const testConfig = {
        'name'    : `${packajeInfo.name}-tests`,
        'version' : '1.0.0',
        'scripts' : {
            'test' : `ENTRY="./node_modules/${packajeInfo.name}/lib" mocha --config .mocharc.json tests.js`
        },
        'dependencies' : {
            [packajeInfo.name] : path.resolve(tarFilePath)
        },
        'devDependencies' : TEST_MODULES.reduce((prev, cur) => ({
            [cur] : packajeInfo.devDependencies[cur],
            ...prev
        }), {})
    };

    try {
        try {
            await fs.remove(DIR);

            const bundle = await rollup({
                input   : 'tests/**/*test.js',
                plugins : [
                    babel({
                        exclude      : 'node_modules/**',
                        babelHelpers : 'inline'
                    }),
                    resolve({
                        preferBuiltins : true,
                        // eslint-disable-next-line security/detect-non-literal-regexp
                        resolveOnly    : [ new RegExp(resolveIgnoreRegexp) ]
                    }),
                    commonjs({
                        include   : [ /node_modules/ ],
                        sourceMap : false
                    }),
                    json({
                        include : 'node_modules/**',
                        compact : true
                    }),
                    multi()
                ]
            });

            await fs.mkdir(DIR);
            await bundle.write({
                file   : path.resolve(DIR, 'tests.js'),
                format : 'cjs'
            });

            await Promise.all(COPY.map(([ from, to ]) => fs.copy(
                from,
                path.resolve(DIR, to)
            )));
            await fs.writeJSON(path.resolve(DIR, 'package.json'), testConfig);
        } catch (error) {
            console.error('ROLLUP ERROR');
            throw error;
        } finally {
            // await fs.move(backup, path.resolve('tests/entry.js'), { overwrite: true });
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


if (isMain) run(process.argv[2]);

#!./node_modules/.bin/babel-node

import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import multi from '@rollup/plugin-multi-entry';
import babel from '@rollup/plugin-babel';

const isMain = !module.parent;

async function run() {
    try {
        try {
            const bundle = await rollup({
                input   : 'tests/**/*test.js',
                plugins : [
                    babel({ exclude: 'node_modules/**' }),
                    resolve({ preferBuiltins: true }),
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

            console.log(bundle.watchFiles);
            await bundle.write({
                file   : 'tmp/tests.js',
                format : 'cjs'
            });
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


if (isMain) run();

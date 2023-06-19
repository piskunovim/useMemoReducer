import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs'
        }
    ],
    plugins: [
        resolve({ extensions: ['.ts', '.tsx'] }),
        babel({
            extensions: ['.ts', '.tsx'],
            exclude: 'node_modules/**',
            babelHelpers: 'bundled'
        })
    ],
    external: ['react', 'redux-devtools-extension']
};


import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve({ extensions: ['.ts', '.tsx'] }),
    babel({
      extensions: ['.ts', '.tsx'],
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    terser(),
  ],
  external: ['react', 'redux-devtools-extension'],
};

const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

const path = require('path');

module.exports = {
  input: 'src/models.js',
  output: [
    {
      file: 'dist/models.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/models.cjs.js',
      format: 'cjs',
    }
  ],
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve(),
    commonjs(),
  ]
}
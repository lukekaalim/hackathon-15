const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const alias = require('rollup-plugin-alias');

const path = require('path');

module.exports = {
  input: 'src/index',
  output: [
    {
      file: 'public/bundle.js',
      format: 'esm',
    }
  ],
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    commonjs(),
    resolve(),
    alias({ entries: [{ find: 'react', replacement: path.resolve(__dirname, 'node_modules/preact/dist/preact.js') }] }),
  ]
}
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const flow = require('rollup-plugin-flow-entry');

module.exports = {
  input: 'src/index',
  output: [
    {
      file: 'dist/components.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/components.cjs.js',
      format: 'commonjs',
    }
  ],
  plugins: [babel({ exclude: 'node_modules/**' }), commonjs(), resolve(), flow()],
  external: ['react']
}
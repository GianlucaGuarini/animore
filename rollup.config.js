import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'lib/index.js',
  format: 'umd',
  moduleName: 'animore',
  plugins: [ resolve(), commonjs(), babel({
    presets: [
      ['env', {
        modules: false,
        loose: true,
        targets: {
          browsers: ['last 2 versions', 'safari >= 7']
        }
      }]
    ]
  })]
}
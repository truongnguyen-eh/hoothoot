import swc from '@rollup/plugin-swc';

export default {
  input: 'src/index.js',
  output: [{
    file: 'es/index.js',
    format: 'es',
  }, {
    file: 'lib/index.js',
    format: 'cjs',
  }],
  plugins: [swc()],
};

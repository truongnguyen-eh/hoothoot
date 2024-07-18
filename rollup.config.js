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
  plugins: [swc({
    env: {
      targets: [
        '>0.2%',
        'not dead',
        'not ie <= 8',
        'not op_mini all',
      ],
    },
  })],
  external: [
    'lodash/get',
    'lodash/reduce',
    'lodash/split',
    'lodash/includes',
    'lodash/endsWith',
    'lodash/isEqual',
    'lodash/toString',
    'lodash/trim',
    'lodash/findIndex',
    'lodash/concat',
    'lodash/join',
    'lodash/curry',
    'lodash/cloneDeep',
    'lodash/set',
  ],
};

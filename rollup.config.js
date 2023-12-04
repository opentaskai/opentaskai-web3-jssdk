import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd',
    },
    // runtimeHelpers: false,
    // externals: [],
    plugins: [
      builtins(),
      json(),
      typescript({ useTsconfigDeclarationDir: true, tsconfig: 'tsconfig.build.json' }),

      nodeResolve({
        extensions: ['.js', '.ts', '.tsx'],
        preferBuiltins: true,
        mainFields: ['browser']
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({
        babelHelpers: 'runtime',
        exclude: '**/node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
    ],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    external: ['ethers'],
    globals: {
      'ethers': 'ethers'
    },
    output: [
      { format: 'cjs', exports: 'named', dir: 'dist/cjs', preserveModules: true },
      // { file: pkg.main, format: 'cjs' },
      // { file: pkg.module, format: 'esm' },
      // { file: pkg.amd, format: 'amd' },
    ],
    plugins: [
      // Allow json resolution
      json(),
      // Compile TypeScript files
      typescript({ useTsconfigDeclarationDir: true, tsconfig: 'tsconfig.build.json' }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      nodeResolve(),
      terser(),

      // Resolve source maps to the original source
      sourceMaps(),
    ],
    onwarn: function (warning) {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }
      // console.error(warning.message);
    },
  },
];

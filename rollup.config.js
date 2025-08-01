import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const production = !process.env.ROLLUP_WATCH;

export default [
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        browser: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declarationDir: './dist/types'
      }),
      production && terser()
    ].filter(Boolean),
    external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0') && id !== 'src/index.ts'
  },
  
  // ES Modules build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        browser: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      production && terser()
    ].filter(Boolean),
    external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0') && id !== 'src/index.ts'
  },
  
  // UMD build for browsers
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'ClinicalTrialsGov',
      sourcemap: true,
      globals: {
        'fetch': 'fetch'
      }
    },
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      production && terser()
    ].filter(Boolean),
    external: []
  },
  
  // Type definitions bundle
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'es'
    },
    plugins: [dts()],
    external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0') && id !== 'src/index.ts'
  }
];
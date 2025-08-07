import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';

const production = !process.env.ROLLUP_WATCH;

const createConfig = (input, output, external = []) => ({
  input,
  output,
  external,
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
    }),
    production && terser({
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }),
    filesize(),
  ].filter(Boolean),
});

const createDtsConfig = (input, output) => ({
  input,
  output,
  plugins: [dts()],
});

export default [
  // Main entry point
  createConfig(
    'src/index.ts',
    [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
      },
    ]
  ),

  // React components
  createConfig(
    'dist/react/index.ts',
    [
      {
        file: 'dist/react/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/react/index.esm.js',
        format: 'es',
      },
    ],
    ['react', 'react-dom']
  ),

  // Vue components
  createConfig(
    'dist/vue/index.ts',
    [
      {
        file: 'dist/vue/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/vue/index.esm.js',
        format: 'es',
      },
    ],
    ['vue']
  ),

  // Angular components
  createConfig(
    'dist/angular/index.ts',
    [
      {
        file: 'dist/angular/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/angular/index.esm.js',
        format: 'es',
      },
    ],
    ['@angular/core']
  ),

  // Vanilla JS
  createConfig(
    'dist/vanilla/index.ts',
    [
      {
        file: 'dist/vanilla/index.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/vanilla/index.esm.js',
        format: 'es',
      },
    ]
  ),

  // Type definitions
  createDtsConfig('src/index.ts', { file: 'dist/index.d.ts', format: 'es' }),
  createDtsConfig('dist/react/index.ts', { file: 'dist/react/index.d.ts', format: 'es' }),
  createDtsConfig('dist/vue/index.ts', { file: 'dist/vue/index.d.ts', format: 'es' }),
  createDtsConfig('dist/angular/index.ts', { file: 'dist/angular/index.d.ts', format: 'es' }),
  createDtsConfig('dist/vanilla/index.ts', { file: 'dist/vanilla/index.d.ts', format: 'es' }),
];
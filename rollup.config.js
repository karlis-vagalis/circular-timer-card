import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/circular-timer-card.js',
  output: {
    file: 'circular-timer-card.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
};


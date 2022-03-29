import resolve from 'rollup-plugin-node-resolve';
import dts from 'rollup-plugin-dts';

import { browser, module } from './package.json';

const config = [
  {
    input: module,
    output: {
      file: browser,
      format: 'umd',
      name: 'HexToCSSFilter',
    },
    plugins: [resolve()],
  },
  {
    input: './dist/esm/index.d.ts',
    output: [{ file: 'dist/umd/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default config;

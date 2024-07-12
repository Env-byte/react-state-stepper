import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import {dts} from 'rollup-plugin-dts';

const config = [
    {
        input: ['./src/index.ts'],
        output: {
            file: 'lib/index.js',
            format: 'es',
            sourcemap: true,
            compact: true,
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'lib',
            }),
            terser(),
        ],
        external: [
            'react',
            'react-dom',
            'react-i18next',
            'resize-observer',
            'react-ga',
            'lodash',
            'react-string-replace',
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
        ],
    },
    {
        input: './lib/index.d.ts',
        output: [{file: 'lib/index.d.ts', format: 'esm'}],
        plugins: [dts(), del({targets: 'lib/**/!(*.js|*.map)', verbose: true, hook: 'buildEnd'})],
        external: [/\.scss$/], // ignore .scss file
    },
];
export default config;


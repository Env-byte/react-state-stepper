import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

const config = [
    {
        input: ['./src/index.ts'],
        output: {
            file: 'build/index.js',
            format: 'es',
            sourcemap: false,
            compact: true,
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'build',
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
        input: './build/index.d.ts',
        output: [{ file: 'build/index.d.ts', format: 'esm' }],
        plugins: [
            dts(),
            del({
                targets: 'build/**/!(*.js|*.map)',
                verbose: true,
                hook: 'buildEnd',
            }),
        ],
        external: [/\.scss$/], // ignore .scss file
    },
];
export default config;

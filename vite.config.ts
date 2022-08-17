/// <reference types="vitest" />
import { defineConfig } from 'vite';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import react from '@vitejs/plugin-react';

const production = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/web3-ethglobal/',
    plugins: [
        react(),
        !production &&
            nodePolyfills({
                include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
            }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
    },
    build: {
        rollupOptions: {
            plugins: [nodePolyfills()],
        },
        // ↓ Needed for build if using WalletConnect and other providers
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    server: {
        host: true,
    },
});

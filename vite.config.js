import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import viteImagemin from 'vite-plugin-imagemin';
import path from 'path';

export default defineConfig({
    root: '.',
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),
        viteImagemin({
            gifsicle: { optimizationLevel: 7 },
            optipng: { optimizationLevel: 7 },
            mozjpeg: { quality: 80 },
            svgo: { plugins: [{ removeViewBox: false }] },
        }),
    ],
    css: {
        preprocessorOptions: {

        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './app'),
            '@style': path.resolve(__dirname, './styles'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: './index.html',
        },
    },
});

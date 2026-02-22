import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
    viteConfig({ mode: 'test', command: 'serve' }),
    defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./src/tests/setup.ts'],
            css: true,
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
    })
);

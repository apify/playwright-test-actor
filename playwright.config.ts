import { defineConfig } from '@playwright/test';
export default defineConfig({
    timeout: 60000,
    use: {
        headless: true,
        viewport: { width: 1920, height: 720 },
        ignoreHTTPSErrors: true,
        colorSchema: 'dark',
        locale: 'cs-CZ',
    },
    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results.json' }]
    ],
});
import { defineConfig } from '@playwright/test';
export default defineConfig({
    use: {
        headless: true,
        viewport: { width: 1920, height: 720 },
        ignoreHTTPSErrors: true,
    },
    reporter: [
        ['line'],
        ['html'],
        ['json', {  outputFile: 'test-results.json' }]
    ],
});
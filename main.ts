import { Actor } from 'apify';
import log from '@apify/log';
import { Dictionary } from 'apify-client';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const getConfig = (options: {screen: {width: number, height: number}, headless: boolean}) => {
    const {screen, headless} = options;

    return `import { defineConfig } from '@playwright/test';
export default defineConfig({
    use: {
        headless: ${headless},
        viewport: { width: ${screen.width}, height: ${screen.height} },
        ignoreHTTPSErrors: true,
    },
    reporter: [
        ['line'],
        ['html'],
        ['json', {  outputFile: 'test-results.json' }]
    ],
});`
}

function runTests() {
    execSync('npx playwright test', {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: 'inherit',
    });
}

function storeTestCode(args: { contents: string, path: string }) {
    return writeFileSync(args.path, args.contents as string, { encoding: 'utf-8' });
}

function updateConfig(args: {
    screenWidth?: number,
    screenHeight?: number,
    headless?: boolean,
}) {
    const { 
        screenWidth = 1280, 
        screenHeight =  720,
        headless = false,
    } = args;

    const config = getConfig({screen: { width: screenWidth, height: screenHeight }, headless});
    writeFileSync(path.join(__dirname, 'playwright.config.ts'), config, { encoding: 'utf-8' });
}

(async () => {
    await Actor.init();
    const input = await Actor.getInput() as Dictionary;

    storeTestCode({
        contents: input['testCode'] as string,
        path: path.join(__dirname, 'tests', 'test.spec.ts')
    });

    updateConfig(input);
    runTests();

    const kvs = await Actor.openKeyValueStore();
    await kvs.setValue('report', readFileSync(path.join(__dirname, 'playwright-report', 'index.html'), { encoding: 'utf-8' }), { contentType: 'text/html' });

    const reportURL = await kvs.getPublicUrl('report');

    log.info('The test run has finished! The report is available at the link below:');
    console.log(reportURL);
    
    await Actor.exit();
})();
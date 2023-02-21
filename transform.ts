export function transformToTabular(testResults: Record<string, any>) {
    const acc: any[] = [];

    for (let suite of testResults.suites) {
        for (let test of suite.specs) {
            for (let runner of test.tests) {
                const { results } = runner;
                acc.push({
                    suiteName: suite.title,
                    testName: test.title,
                    runnerName: runner.projectName,
                    result: runner.status === 'expected',
                    errors: results.reduce((p: string[], e: {errors: {message: string}[]}) => [...p, ...e.errors.map(e => e.message)], []),
                    duration: results.reduce((acc: number, curr: {duration: number}) => acc + curr.duration, 0),
                })
            }
        }
    }

    return acc;
}
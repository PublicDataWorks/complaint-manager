const fs = require('fs');

const THRESHOLDS = { // set a specific threshold (in ms) for an operation, otherwise DEFAULT will be used
    ['Retrieve Final Referral Letter URL']: 60,
    DEFAULT: 500
};

fs.readFile('output/letter-generation-test-stats.csv', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return 1;
    }

    let failure = false;
    let result = data.split('\n').map(row => {
        let [operation, status, latency] = row.split(',');
        return { operation, status, latency };
    }).filter(res => res.operation && res.operation !== 'operation')
        .forEach(res => {
            let threshold = THRESHOLDS.DEFAULT;
            if (THRESHOLDS[res.operation]) {
                threshold = THRESHOLDS[res.operation];
            }

            if (res.latency > threshold) {
                failure = true;
                console.error(`ERROR - operation: ${res.operation} took ${res.latency}ms, which is above its threshold of ${threshold}ms`);
            } else {
                console.log(`operation: ${res.operation} passed its threshold (${res.latency}ms < ${threshold}ms)`)
            }
        });

    if (failure) {
        throw new Error('latency validation failed (see above)');
    }
});

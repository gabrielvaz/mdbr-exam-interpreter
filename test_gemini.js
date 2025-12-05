const https = require('https');
const fs = require('fs');

const API_KEY = process.env.OPENROUTER_API_KEY || "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";

const modelsToTest = [
    "google/gemini-2.5-flash",
    "google/gemini-2.5-pro",
    "google/gemini-3.0-pro",
    "google/gemini-2.0-pro-exp-02-05:free",
    "google/gemini-2.0-flash-001"
];

async function testModel(model) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            model: model,
            messages: [{ role: "user", content: "Hello" }]
        });

        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ model, status: 'SUCCESS', code: res.statusCode });
                } else {
                    resolve({ model, status: 'FAILED', code: res.statusCode, error: body });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ model, status: 'ERROR', error: e.message });
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log("Testing models...");
    for (const model of modelsToTest) {
        const result = await testModel(model);
        console.log(`${result.model}: ${result.status} (${result.code || ''})`);
        if (result.status === 'FAILED') {
            // console.log(`  Error: ${result.error}`);
        }
    }
}

runTests();

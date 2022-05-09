const request = require("supertest");
async function waitForUrl(url) {
    return new Promise(async (resolve, reject) => {
        let nCalls = 0;
        let statusCode = 0;
        while (statusCode != 200) {
            console.log('Trying');
            const response = await request('').get(url);
            statusCode = response.statusCode;
            if (statusCode == 200) {
                resolve(true);
            }
            if (nCalls == 20) {
                reject('URL is not available');
            }
            // wait one second
            await new Promise(resolve => setTimeout(resolve, 1000));
            nCalls++;
        }
        
    });
}
exports.waitForUrl = waitForUrl;
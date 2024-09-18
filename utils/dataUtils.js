// noinspection SpellCheckingInspection

const https = require("https");
const http = require("http");


/**
 * @param {string} url URL to json
 * @param {*} headers request headers
 * @param {number} timeout Timeout (ms)
 * @returns {Promise<*>} Resolves to JSON of requested content
 */
const getJSON = (url, headers, timeout) => {
    if(timeout === undefined) timeout = 6000;
    let timeoutId;
    const options = {
        method: 'GET',
        headers: headers
    };
    if(url.includes("https://")){
        return new Promise((resolve) => {
            const req = https.get(url, options, function(res) {
                if(res.statusCode !== 200) {
                    resolve(undefined);
                    return;
                }
                let content = '';
                res.on('data', function(chunk) {
                    content += chunk;
                    clearTimeout(timeoutId);
                });
                res.on('end', function() {
                    resolve(JSON.parse(content));
                });
            }).on('error', function(e) {
                console.log(`Got error: ${e.message}`);
            });
            timeoutId = req.setTimeout(timeout, () => {
                resolve(undefined);
                req.destroy(new Error(`Timed out ${url}`));
            });
        });
    }else{
        return new Promise((resolve) => {
            const req = http.get(url, options, function(res) {
                if(res.statusCode !== 200) {
                    resolve(undefined);
                    return;
                }
                let content = '';
                res.on('data', function(chunk) {
                    content += chunk;
                    clearTimeout(timeoutId);
                });
                res.on('end', function() {
                    resolve(JSON.parse(content));
                });
            }).on('error', function(e) {
                console.log(`Got error: ${e.message}`);
                resolve(undefined);
            });
            timeoutId = req.setTimeout(timeout, () => {
                resolve(undefined);
                req.destroy(new Error(`Timed out ${url}`));
            });
        });
    }

};

module.exports = { getJSON };

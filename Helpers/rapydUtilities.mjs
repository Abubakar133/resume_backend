import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = 'rsk_406c8bb1ca6ff68b4f55b99d216008b1e2e95954f4b53ddcf4e5bc471c5a1d18f3e2b93f436cedb2';
const accessKey = 'rak_2026638B29438602E2BE';
const log = false;

export async function makeRequest(method, urlPath, body = null) {
    try {
        // Declare the variables properly before using them
        const httpMethod = method;  // Use `const` or `let`
        const httpBaseURL = "sandboxapi.rapyd.net";  // Declare the base URL
        const httpURLPath = urlPath;  // URL path
        const salt = generateRandomString(8);  // Generate salt
        const idempotency = new Date().getTime().toString();  // Generate idempotency key
        const timestamp = Math.round(new Date().getTime() / 1000);  // Generate timestamp
        const signature = sign(httpMethod, httpURLPath, salt, timestamp, body);  // Generate signature
        
        // Prepare the options for the request
        const options = {
            hostname: httpBaseURL,
            port: 443,
            path: httpURLPath,
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: accessKey,
                idempotency: idempotency
            }
        };

        // Make the HTTP request with the generated options
        return await httpRequest(options, body, log);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
}

 
function sign(method, urlPath, salt, timestamp, body) {
 
    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }
 
        let toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
        log && console.log(`toSign: ${toSign}`);
 
        let hash = crypto.createHmac('sha256', secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64")
        log && console.log(`signature: ${signature}`);
 
        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}
 
function generateRandomString(size) {
    try {
        return crypto.randomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}
 
async function httpRequest(options, body) {
   console.log("http");
    return new Promise((resolve, reject) => {
        try {
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString === "{}" ? "" : bodyString;
            }

        
            
            // log && console.log(`httpRequest options: ${JSON.stringify(options)}`);

            const req = https.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: ''
                };

                res.on('data', (data) => {
                    response.body += data;
                });

                res.on('end', () => {
                   // log && console.log(`Raw response body: ${response.body}`);

                    // Check if response is JSON before parsing it
                    try {
                        response.body = response.body ? JSON.parse(response.body) : {};
                    } catch (error) {
                        console.error('Error parsing response as JSON:', error);
                        console.log('Response body is not JSON:', response.body);
                    }

                    //log && console.log(`httpRequest response: ${JSON.stringify(response)}`);

                    if (response.statusCode !== 200) {
                        return reject(response);  // Reject if status code is not 200
                    }

                    return resolve(response);  // Resolve if status code is 200
                });
            });

            req.on('error', (error) => {
                return reject(error);
            });

            req.write(bodyString);
            req.end();
        } catch (err) {
            return reject(err);
        }
    });
}

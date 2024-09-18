const responseUtils = require('./utils/responseUtils');
const {renderPublic} = require('./utils/render');
const requestUtils = require('./utils/requestUtils');
const menuController = require('./controllers/menu');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
    '/api/menu': ['GET']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {*} response Http response
 * @returns {*} Options
 */
const sendOptions = (filePath, response) => {
    if (filePath in allowedMethods) {
        response.writeHead(204, {
            'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
            'Access-Control-Allow-Headers': 'Content-Type,Accept',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Expose-Headers': 'Content-Type,Accept'
        });
        return response.end();
    }

    return responseUtils.notFound(response);
};

/**
 * Allowed origins for CORS
 * @type {*[]}
 */
const allowedOrigins = [
    'http://localhost:5173',
];

/**
 * Content Security Policy (CSP) headers
 * @type {{"connect-src": string[], "style-src": string[], "base-uri": string[], "script-src": string[], "form-action": string[], "manifest-src": string[], "frame-src": string[], "frame-ancestors": string[], "img-src": string[], "default-src": string[], "font-src": string[]}}
 */
const CSP = {
    'default-src': ["'none'"],
    'connect-src': [
        "'self'",
    ],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    'script-src': [
        "'self'"
    ],
    'img-src': [
        "'self'",
        "data:",
    ],
    'font-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'frame-ancestors': ["'none'"],
    'frame-src': [
        "'self'"
    ]
};



const handleRequest = async (request, response) => {
    const {url, method, headers} = request;
    const { pathname: filePath, searchParams: query } = new URL(url, `http://${ headers.host }`);

    // Set security headers
    response.setHeader('Content-Security-Policy', Object.keys(CSP).map(key => `${ key } ${ CSP[key].join(' ') }`).join('; '));
    response.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Expose-Headers', 'Content-Type,Accept,Etag');
    if(allowedOrigins.includes(headers.origin))
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);

    // serve static files from public/ and return immediately
    if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
        try{
            switch(request.headers['sec-fetch-dest']) {
                case 'document':
                    response.setHeader("Cache-Control", `public, max-age=${ 0 }`); // 0 seconds for html
                    break;
                case 'image':
                    response.setHeader("Cache-Control", `public, max-age=${ 28 * 24 * 60 * 60 }`); // 4 weeks for images
                    break;
                default:
                    response.setHeader("Cache-Control", `public, max-age=${ 7 * 24 * 60 * 60 }`); // 1 week for everything else
                    break;
            }
            // Copy If-None-Match header from request to response so that it can be used in render.js -> renderFile()
            // This is a stupid way to do it... but it works for now
            if(Object.keys(request.headers).includes('if-none-match'))
                response.setHeader("If-None-Match", request.headers['if-none-match']);
        }catch (e) {
            console.log(e);
        }
        // If the file path is empty, assume index.html
        let fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
        // If the file does not have an extension, assume it is a directory and serve index.html
        if(!fileName.includes('.')) fileName = 'index.html';

        // Render the file and set Open Graph image url if steamId is present
        return renderPublic(fileName, response, method.toUpperCase() === 'HEAD');
    }

    if (method.toUpperCase() === 'POST' && !(filePath in allowedMethods)) {
        response.writeHead(200, {'Content-Type': 'text/html'});
    }

    // Default to 404 Not Found if unknown url
    if (!(filePath in allowedMethods)) {
        return responseUtils.notFound(response);
    }

    // See: http://restcookbook.com/HTTP%20Methods/options/
    if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

    // Check for allowable methods
    if (!allowedMethods[filePath].includes(method.toUpperCase())) return responseUtils.methodNotAllowed(response);

    // Require a correct accept header (require 'application/json' or '*/*')
    if (!requestUtils.acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
    }

    const meth = method.toUpperCase();
    switch (filePath) {
        case '/api/menu':
            switch (meth) {
                case 'GET':
                    return menuController.getMenu(request, response);
                default:
                    return responseUtils.methodNotAllowed(response);
            }
        default:
            return responseUtils.notFound(response);
    }
};

module.exports = {handleRequest};

const responseUtils = require('./utils/responseUtils');
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
    'https://ouf.fi',
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

/**
 * Security headers
 * @type {{"Referrer-Policy": string, "Strict-Transport-Security": string, "Access-Control-Expose-Headers": string, "X-Content-Type-Options": string, "Content-Security-Policy": string, Vary: string, "X-XSS-Protection": string}}
 */
const securityHeaders = {
    'Content-Security-Policy': Object.keys(CSP).map(key => `${key} ${CSP[key].join(' ')}`).join('; '),
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin',
    'Access-Control-Expose-Headers': 'Content-Type,Accept,Etag'
};



const handleRequest = async (request, response) => {
    const {url, method, headers} = request;
    const { pathname: filePath, searchParams: query } = new URL(url, `http://${ headers.host }`);

    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => response.setHeader(key, value));

    if(allowedOrigins.includes(headers.origin) || headers.origin?.startsWith('http://localhost'))
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin);

    if (method.toUpperCase() === 'POST' && !(filePath in allowedMethods)) {
        response.writeHead(200, {'Content-Type': 'text/html'});
    }

    // Default to 404 Not Found if unknown url
    if (!(filePath in allowedMethods)) {
        return responseUtils.notFound(response);
    }

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

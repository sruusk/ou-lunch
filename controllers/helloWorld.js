const { sendJson } = require("../utils/responseUtils");
const { getHelloWorld } = require("../models/helloWorld");

/**
 * Get Hello World!
 * @returns {Object} Hello World!
 */
const getHello = (request, response) => {
    return sendJson(response, { message: getHelloWorld() });
}

module.exports = { getHello };

const { sendJson } = require("../utils/responseUtils");
const { getMenus } = require("../models/restaurants");

/**
 * Get Hello World!
 * @returns {Object} Hello World!
 */
const getMenu = async (request, response) => {
    const menu = getMenus();
    return sendJson(response, menu);
}

module.exports = { getMenu };

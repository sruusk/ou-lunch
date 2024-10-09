const { sendJson } = require("../utils/responseUtils");
const { getMenus } = require("../models/restaurants");

/**
 * Get menu for campus
 * @param {Object} request - Request object
 * @param {Object} response - Response object
 * @param {Object} query - Query object
 * @returns {Promise<*>}
 */
const getMenu = async (request, response, query) => {
    const campus = query.get('campus');
    const menu = await getMenus(campus ? { campus } : {});
    return sendJson(response, menu);
}

module.exports = { getMenu };

const { sendJson, badRequest } = require("../utils/responseUtils");
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
    const city = query.get('city');
    if(campus && !city) return badRequest(response, 'City is required');
    if(city && !campus) return badRequest(response, 'Campus is required');
    const menu = await getMenus(campus && city ? { campus, city } : {});
    return sendJson(response, menu);
}

module.exports = { getMenu };

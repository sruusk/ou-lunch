const { getDb } = require('../utils/mongodb');

/**
 * Get all restaurants
 * @returns {Promise<void>}
 */
const getRestaurants = async (restaurant) => {
    try {
        return (await getDb()).collection('restaurants').find({}).toArray();
    } catch(err) {
        console.error(err);
    }
}

/**
 * Get menu for all restaurants for today forward.
 * @returns {Promise<Object[]>} Array of restaurant objects with menu.
 */
const getMenus = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const restaurants = await (await getDb()).collection('restaurants').find({}).toArray();
        return restaurants.map(({ name, menu }) => {
            const menuItems = Object.entries(menu).map(([date, items]) => ({ date, items }));
            return { name, menu: menuItems };
        });
    } catch(err) {
        console.error(err);
    }
}


/**
 * Get restaurant by name
 * @param {string} name - Name of the restaurant to get.
 * @returns {Promise<Object>} Restaurant object.
 */
const getRestaurant = async (name) => {
    try {
        return (await getDb()).collection('restaurants').findOne({ name });
    } catch(err) {
        console.error(err);
    }
}

/**
 * Adds a new restaurant to the database.
 * @param {string} name - Name of the restaurant to add.
 * @returns {Promise<void>}
 */
const addRestaurant = async (name) => {
    await (await getDb()).collection('restaurants').insertOne({ name, menu: [] });
}

/**
 * Update menu of a restaurant for a specific date.
 * @param {string} name - Name of the restaurant to update.
 * @param {Date} date - Date of the menu.
 * @param {{en: {name: string, allergens: string[]}, fi: {name: string, allergens: string[]}}} menu - Menu items.
 * @returns {Promise<void>}
 */
const updateMenu = async (name, date, menu) => {
    try {
        date.setHours(0, 0, 0, 0);
        await (await getDb()).collection('restaurants')
            .updateOne({ name }, { $set: { [`menu.${date.toISOString()}`]: menu } });
    } catch(err) {
        console.error(err);
    }
}


module.exports = { getRestaurants, getMenus, getRestaurant, addRestaurant, updateMenu };

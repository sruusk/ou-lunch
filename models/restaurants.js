const moment = require('moment-timezone');
const { getDb } = require('../utils/mongodb');

/**
 * Get all restaurants
 * @returns {Promise<void>}
 */
const getRestaurants = async () => {
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
        const today = moment.tz('Europe/Helsinki').startOf('day').toDate();
        const restaurants = await (await getDb()).collection('restaurants').find({}).toArray();
        return restaurants.map(restaurant => {
            const menu = restaurant.menu.filter(menu => menu.date >= today);
            return { ...restaurant, menu };
        }).filter(restaurant => restaurant.menu.length > 0);
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
 * @param {string} name - Name of the restaurant to add
 * @param {string} url - URL of the restaurant
 * @param {string} campus - Campus of the restaurant
 * @returns {Promise<void>}
 */
const addRestaurant = async (name, url, campus) => {
    if(!name) throw new Error('Name is required');
    if(!url) throw new Error('URL is required');
    if(!campus) throw new Error('Campus is required');
    try {
        await (await getDb()).collection('restaurants').insertOne({ name, url, campus, menu: [] });
    } catch(err) {
        console.error(JSON.stringify(err, null, 2));
    }
}

/**
 * Restaurant exists
 * @param {string} name - Name of the restaurant to check.
 * @returns {Promise<boolean>} True if restaurant exists.
 */
const restaurantExists = async (name) => {
    return await (await getDb()).collection('restaurants').findOne({ name }) !== null;
}

/**
 * Update menu of a restaurant for a specific date.
 * @param {string} name - Name of the restaurant to update.
 * @param {Date} date - Date of the menu.
 * @param {{en: Object, fi: Object}} menu - Menu items.
 * @returns {Promise<void>}
 */
const updateMenu = async (name, date, menu) => {
    try {
        date.setUTCHours(0, 0, 0, 0);
        // Check if menu for the date already exists and update it, otherwise add a new menu.
        const restaurant = await (await getDb()).collection('restaurants').findOne({ name, 'menu.date': date });
        if(restaurant) await (await getDb()).collection('restaurants').updateOne({ name, 'menu.date': date }, { $set: { 'menu.$': { date, ...menu } } });
        else await (await getDb()).collection('restaurants').updateOne({ name }, { $push: { menu: { date, ...menu } } });
    } catch(err) {
        if(err.code === 121) console.log(JSON.stringify(menu, null, 2), JSON.stringify(err, null, 2), name); // Validation error
        else console.error(err);
    }
}


module.exports = { getRestaurants, getMenus, getRestaurant, addRestaurant, restaurantExists, updateMenu };

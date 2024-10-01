require('dotenv').config();
const { getDb } = require('../utils/mongodb');
const jamix = require('../models/jamix');
const poweresta = require('../models/poweresta');

const resetdb = async () => {
    try {
        const db = await getDb();
        await db.collection('restaurants').deleteMany({});
        console.log('Restaurants collection emptied.');

        await jamix.updateRestaurants();
        await poweresta.updateRestaurants();
        console.log('Menus fetched and updated.');
    } catch (err) {
        console.error('Error resetting the database:', err);
    }
};

resetdb().then(() => console.log('Database reset complete.'));

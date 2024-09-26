const jamix = require('../models/jamix');
const poweresta = require('../models/poweresta');

// Update menus on startup and at 10:00 every day
const updateMenus = async () => {
    try {
        await jamix.updateRestaurants();
        await poweresta.updateRestaurants();
    } catch(err) {
        console.error(err);
    }
}

const start = async () => {
    await updateMenus();
    setInterval(updateMenus, 1000 * 60 * 60 * 24);
}

updateMenus().then(() => console.log('Menus updated'));
const now = new Date();
const timeToTen = 1000 * 60 * 60 * 24 - (now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10));
setTimeout(start, timeToTen);

import moment from "moment-timezone";

export default defineNitroPlugin((nitroApp) => {
    const updateMenus = async () => {
        try {
            await Promise.all([
                updateJamixRestaurants(),
                updatePowerestaRestaurants(),
                updateCompassRestaurants(),
                updateSodexoRestaurants()
            ]);
            console.log('Menus updated');
        } catch(err) {
            console.error(err);
        }
    }

    updateMenus().then(() => {
        console.log('Getting prices');
        updateRestaurantPrices();
    });

    const now = new Date();
    const timeToNine = moment.tz('Europe/Helsinki').startOf('day').add(1, 'day').add(9, 'hours').diff(now);

    setTimeout(() => {
        updateMenus();
        setInterval(() => { // Update menus every day at 9:00, 10:00 and 11:00
            updateMenus();
            setTimeout(updateMenus, 1000 * 60 * 60); // 1 hour
            setTimeout(updateMenus, 1000 * 60 * 60 * 2); // 2 hours
        }, 1000 * 60 * 60 * 24);
    }, timeToNine);
});

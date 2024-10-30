
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
    const timeToTen = 1000 * 60 * 60 * 24 - (now.valueOf() - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10).valueOf());

    const start = () => {
        updateMenus();
        setInterval(updateMenus, 1000 * 60 * 60 * 24);
    }

    setTimeout(start, timeToTen);
});

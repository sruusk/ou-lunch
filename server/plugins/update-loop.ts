export default defineNitroPlugin((nitroApp) => {
    const updateMenus = async () => {
        try {
            await Promise.all([
                updateJamixRestaurants(),
                updatePowerestaRestaurants(),
                updateCompassRestaurants(),
                updateSodexoRestaurants()
            ]);
        } catch(err) {
            console.error(err);
        }
    }

    getDb().then(async (db) => {
        await db.collection('restaurants').deleteMany({});
        console.log('Restaurants collection emptied.');
        await updateMenus();
        console.log('Menus loaded');
    });


    const now = new Date();
    const timeToTen = 1000 * 60 * 60 * 24 - (now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10));

    const start = () => {
        updateMenus();
        setInterval(updateMenus, 1000 * 60 * 60 * 24);
    }

    setTimeout(start, timeToTen);
});

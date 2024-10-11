//https://api.fi.poweresta.com/publicmenu/dates/uniresta/preludi/?menu=ravintolapreludi&dates=2024-09-19

const { restaurantExists, addRestaurant, updateMenu } = require("./restaurants");
const { CAMPUSES } = require("../utils/static");
const restaurants = [
    {
        name: "preludi",
        menu: "ravintolapreludi",
        meta: {
            name: "Preludi",
            url: "https://www.uniresta.fi/preludi",
            ...CAMPUSES.OULU.LINNANMAA,
        }
    }, {
        name: "julinia",
        menu: "ravintolajulinia",
        meta: {
            name: "Julinia",
            url: "https://www.uniresta.fi/julinia",
            ...CAMPUSES.OULU.LINNANMAA
        }
    }, {
        name: "lipasto",
        menu: "ravintolalipasto",
        meta: {
            name: "Lipasto",
            url: "https://www.uniresta.fi/lipasto",
            ...CAMPUSES.OULU.LINNANMAA
        }
    }, {
        name: "pekuri",
        menu: "ravintolapekuri",
        meta: {
            name: "Pekuri",
            url: "https://ravintolapekuri.fi/",
            ...CAMPUSES.OULU.LINNANMAA
        }
    }, {
        name: "campus",
        menu: "h2ocampus",
        meta: {
            name: "H2O Campus",
            url: "https://www.health2organic.fi/",
            ...CAMPUSES.OULU.LINNANMAA
        }
    }
];

const getRestaurant = async (restaurant) => {
    // Get the menu for the next 7 days
    const dates = [];
    for(let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }

    try {
        const res = await fetch(`https://api.fi.poweresta.com/publicmenu/dates/uniresta/${ restaurant.name }/?menu=${ restaurant.menu }&dates=${ dates.join(',') }`).then(res => res.json());
        return { ...restaurant.meta, menu: formatMenu(res) };
    } catch(err) {
        console.error("Error getting menu for", restaurant.meta.name, err);
        return { ...restaurant.meta, menu: [] };
    }
};

const formatMenu = (menu) => {
    return menu.map(day => {
        let out = {};
        ["en", "fi"].forEach(lang => {
            out[lang] = day.data.mealOptions.map(option => {
                return {
                    name: option.names.find(name => name.language === lang).name || '',
                    items: option.rows.map(row => {
                        const out = {
                            name: row.names.find(name => name.language === lang).name || '',
                            diets: row.diets.find(diet => diet.language === lang).dietShorts?.join(', ').replaceAll('KELA', '*') || undefined,
                            ingredients: row.ingredients.find(ingredient => ingredient.language === lang).ingredients || undefined
                        };
                        // Remove empty properties
                        Object.keys(out).forEach(key => {
                            if(out[key] === undefined) delete out[key];
                        });
                        return out;
                    })
                };
            });
        });
        return {
            date: new Date(day.date),
            ...out
        };
    });
};

const getAllMenus = async () => {
    const menus = await Promise.all(restaurants.map(getRestaurant));
    return menus.flat();
};

const updateRestaurants = async () => {
    const menus = await getAllMenus();
    for(const m of menus)
        if(!await restaurantExists(m.name))
            await addRestaurant(m.name, m.url, m.campus, m.city);
    // Update the menu for each restaurant
    menus.forEach(menu => {
        menu.menu.forEach(day => {
            updateMenu(menu.name, day.date, { en: day.en, fi: day.fi });
        });
    });
};

//updateRestaurants().then(() => console.log('Poweresta menus updated'));

//getRestaurant(restaurants[0]).then(console.log);

module.exports = { updateRestaurants };

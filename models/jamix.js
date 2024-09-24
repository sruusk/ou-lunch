const { updateMenu, restaurantExists, addRestaurant } = require('./restaurants');

const restaurants = [49, 69, 70];

const resolvers = [
    {
        r: /mara/gi, l: {
            url: "https://juvenes.fi/mara/",
            campus: "Linnanmaa"
        }
    },
    {
        r: /foobar/gi, l: {
            url: "https://juvenes.fi/foobar/",
            campus: "Linnanmaa"
        }
    },
    {
        r: /kerttu/gi, l: {
            url: "https://juvenes.fi/kerttu/",
            campus: "Linnanmaa"
        }
    },
    {
        r: /voltti/gi, l: {
            url: "https://juvenes.fi/voltti/",
            campus: "Linnanmaa"
        }
    },
];

/**
 * Get menu for restaurant.
 * @param {number} restaurant - ID of the restaurant in the jamix system.
 * @returns {Promise<{name: string, fin: Array, eng: Array}[]>} Menu for the restaurant.
 */
const getMenu = async (restaurant) => {
    const fin = await getRestaurant(restaurant, 'fi');
    const eng = await getRestaurant(restaurant, 'en');
    const menus = formatMenu(fin).map(menu => {
        return {
            name: menu.name,
            fin: menu.days
        };
    });
    formatMenu(eng).forEach((menu) => {
        menus.find(m => m.name === menu.name).eng = menu.days;
    });
    return menus.flat();
};

/**
 * Get menu for restaurant.
 * @param {number} restaurant - ID of the restaurant in the jamix system.
 * @param {string} lang - Language of the menu.
 * @returns {Promise<any>} Menu for the restaurant.
 */
const getRestaurant = (restaurant, lang) => {
    return fetch(`https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/${ restaurant }?lang=${ lang }`)
        .then(res => res.json());
};

/**
 * Format menu
 * @param menu - Raw menu from Jamix API.
 * @returns {{date: Date, options: {name: string, items: {name: string, diets: Array, ingredients: Array}}[]}[]} Formatted menu.
 */
const formatMenu = (menu) => {
    return menu[0].menuTypes.map(type => {
        return {
            name: type.menuTypeName.replace('lounas', '').trim(), // Remove "lounas" from the name
            days: type.menus[0].days.map(day => {
                // Date is in format "YYYYMMDD"
                let d = day.date.toString();
                const date = new Date();
                date.setUTCFullYear(parseInt(d.slice(0, 4)), d.slice(4, 6) - 1, parseInt(d.slice(6, 8)));
                date.setUTCHours(0, 0, 0, 0);

                return {
                    date,
                    options: day.mealoptions.map(option => {
                        return {
                            name: option.name,
                            items: option.menuItems.map(menuItem => {
                                return {
                                    name: menuItem.name,
                                    diets: menuItem.diets,
                                    ingredients: menuItem.ingredients
                                };
                            })
                        };
                    })
                };
            })
        };
    });
};

const getAllMenus = async () => {
    const menus = await Promise.all(restaurants.map(getMenu));
    return menus.flat();
};

const updateRestaurants = async () => {
    const menus = await getAllMenus();
    for(const m of menus) {
        if(!await restaurantExists(m.name)){
            const res = resolvers.find(r => r.r.test(m.name));
            await addRestaurant(m.name, res.l.url, res.l.campus);
        }
    }
    menus.forEach(menu => {
        menu.fin.forEach(day => {
            const out = {
                fi: day.options,
                en: menu.eng.find(m => m.date.getTime() === day.date.getTime()).options
            };
            updateMenu(menu.name, day.date, out);
        });
    });
};

//updateRestaurants().then(() => console.log('Jamix menus updated'));

//getAllMenus().then(menus => console.log(JSON.stringify(menus, null, 2)));

//getMenu(restaurants[2]).then(m => console.log(JSON.stringify(m, null, 2)));

module.exports = { updateRestaurants };


//https://api.fi.poweresta.com/publicmenu/dates/uniresta/preludi/?menu=ravintolapreludi&dates=2024-09-19

const { restaurantExists, addRestaurant, updateMenu } = require("./restaurants");
const restaurants = [
    {
        name: "preludi",
        display: "Preludi",
        menu: "ravintolapreludi"
    }, {
        name: "julinia",
        display: "Julinia",
        menu: "ravintolajulinia"
    }, {
        name: "lipasto",
        display: "Lipasto",
        menu: "ravintolalipasto"
    },{
        name: "pekuri",
        display: "Pekuri",
        menu: "ravintolapekuri"
    }, {
        name: "solisti",
        display: "H2O Solisti",
        menu: "h2osolisti"
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

    const res = await fetch(`https://api.fi.poweresta.com/publicmenu/dates/uniresta/${ restaurant.name }/?menu=${ restaurant.menu }&dates=${ dates.join(',') }`).then(res => res.json());
    return { name: restaurant.display, menu: formatMenu(res) };
}

const formatMenu = (menu) => {
    return menu.map(day => {
        out = {};
        ["en", "fi"].forEach(lang => {
            out[lang] = day.data.mealOptions.map(option => {
                return {
                    name: option.names.find(name => name.language === lang).name,
                    items: option.rows.map(row => {
                        return {
                            name: row.names.find(name => name.language === lang).name,
                            diets: row.diets.find(diet => diet.language === lang).dietShorts?.join(', '),
                            ingredients: row.ingredients.find(ingredient => ingredient.language === lang).ingredients
                        }
                    })
                }
            });
        });
        return {
            date: new Date(day.date),
            ...out
        }
    });
}

const getAllMenus = async () => {
    const menus = await Promise.all(restaurants.map(getRestaurant));
    return menus.flat();
}

const updateRestaurants = async () => {
    const menus = await getAllMenus();
    for (const m of menus) if (!await restaurantExists(m.name)) await addRestaurant(m.name);
    // Update the menu for each restaurant
    menus.forEach(menu => {
        menu.menu.forEach(day => {
            updateMenu(menu.name, day.date, { en: day.en, fi: day.fi });
        });
    });
}

//updateRestaurants().then(() => console.log('Poweresta menus updated'));

//getRestaurant(restaurants[0]).then(console.log);

module.exports = { updateRestaurants };

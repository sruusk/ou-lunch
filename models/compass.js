const { CAMPUSES } = require("../utils/static");
const { restaurantExists, addRestaurant, updateMenu } = require("./restaurants");

const restaurants = [
    {
        costCenter: "0812",
        meta: {
            name: "Reaktori",
            url: "https://www.compass-group.fi/ravintolat-ja-ruokalistat/foodco/kaupungit/tampere/reaktori/",
            campus: CAMPUSES.TAMPERE.HERVANTA
        }
    }
];

const getRestaurant = async (restaurant) => {
    const now = new Date();
    const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 2).toISOString().split('T')[0];
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1 + 7 - now.getDay()) % 7 + 1).toISOString().split('T')[0];

    try {
        const thisWeekFi = await getWeeklyMenu(restaurant, thisMonday, 'fi');
        const thisWeekEn = await getWeeklyMenu(restaurant, thisMonday, 'en');
        const nextWeekFi = await getWeeklyMenu(restaurant, nextMonday, 'fi');
        const nextWeekEn = await getWeeklyMenu(restaurant, nextMonday, 'en');

        return {
            ...restaurant.meta,
            menu: [
                ...thisWeekFi.map(day => {
                    return {
                        date: day.date,
                        fi: day.fi,
                        en: thisWeekEn.find(d => d.date.getTime() === day.date.getTime()).en
                    };
                }),
                ...nextWeekFi.map(day => {
                    return {
                        date: day.date,
                        fi: day.fi,
                        en: nextWeekEn.find(d => d.date.getTime() === day.date.getTime()).en
                    };
                })
            ]
        };
    } catch(err) {
        console.error("Error getting weekly menu for", restaurant.meta.name, err);
        return { ...restaurant.meta, menu: [] };
    }
};

const getWeeklyMenu = async (restaurant, date, lang) => {
    const res = await fetch(`https://www.compass-group.fi/menuapi/week-menus?costCenter=${ restaurant.costCenter }&date=${ date }&language=${ lang }`).then(res => res.json());
    const menu = formatMenu(res, lang);
    for(const day of menu) {
        for(const meal of day[lang]) {
            for(const item of meal.items) {
                if(item.ingredients) {
                    item.ingredients = await getIngredients(item.ingredients, lang);
                } else delete item.ingredients;
            }
        }
    }
    return menu;
};

const formatMenu = (menu, lang) => {
    return menu.menus.map(day => {
        const date = new Date(day.date);
        const o = { date: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) };
        o[lang] = day.menuPackages.map(menu => {
            return {
                name: menu.name,
                items: menu.meals.map(item => {
                    return {
                        name: item.name.trim(),
                        diets: item.diets.join(', '),
                        ingredients: item.recipeId || 0
                    };
                })
            };
        }).filter(menu => menu.items.length > 0);
        return o;
    });
};

const getIngredients = (recipeId, lang) => {
    return fetch(`https://www.compass-group.fi/menuapi/recipes/${ recipeId }?language=${ lang }`)
        .then(res => res.json())
        .then(res => res.ingredientsCleaned);
};

const getAllRestaurants = async () => {
    const menus = await Promise.all(restaurants.map(getRestaurant));
    return menus.flat();
};

const updateRestaurants = async () => {
    const restaurants = await getAllRestaurants();
    for(const r of restaurants) {
        if(!await restaurantExists(r.name)) {
            await addRestaurant(r.name, r.url, r.campus);
        }
    }
    restaurants.forEach(r => {
        r.menu.forEach(day => {
            updateMenu(r.name, day.date, { en: day.en, fi: day.fi });
        });
    });
};

module.exports = { updateRestaurants };

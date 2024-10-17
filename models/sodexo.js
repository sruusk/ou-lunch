const { CAMPUSES } = require("../utils/static");
const { restaurantExists, addRestaurant, updateMenu } = require("./restaurants");

/**
 * List of restaurants to fetch data for.
 * @type {[{meta: {campus: string, name: string, url: string}, id: string}]}
 */
const restaurants = [
    {
        id: "111",
        meta: {
            name: "Hertsi",
            url: "https://www.sodexo.fi/ravintolat/ravintola-hertsi",
            ...CAMPUSES.TAMPERE.HERVANTA
        }
    }
]

const getRestaurant = async (restaurant) => {
    try {
        return { ...restaurant.meta, menu: formatMenu(await getRestaurantMenu(restaurant.id)) };
    } catch(err) {
        console.error("Error getting menu for", restaurant.meta.name, err);
    }
}

const getRestaurantMenu = (restaurant) => {
    return fetch(`https://www.sodexo.fi/ruokalistat/output/weekly_json/${ restaurant }`).then(res => res.json());
}

const formatMenu = (menu) => {
    let monday = menu.timeperiod.split(' - ')[0].split('.');
    monday.pop();
    monday.push(new Date().getFullYear());
    monday.reverse();
    monday = new Date(Date.UTC(monday[0], monday[1] - 1, monday[2]));
    return menu.mealdates.map(day => {
        const [en, fi] = ["en", "fi"].map(lang => {
            return Object.values(day.courses).map(course => {
                return {
                    name: course.category,
                    items: [
                        {
                            name: course[`title_${ lang }`],
                            diets: course.dietcodes,
                            ingredients: Object.values(course.recipes)
                                .map(recipe => {
                                    if(recipe.ingredients)
                                        return `${ recipe.name } (${ recipe.ingredients })\n`;
                                })
                                .filter(i => i)
                                .join('')
                                .trim()
                        }
                    ]
                }
            });
        });

        const dayOffset = {
            Maanantai: 0,
            Tiistai: 1,
            Keskiviikko: 2,
            Torstai: 3,
            Perjantai: 4,
            Lauantai: 5,
            Sunnuntai: 6
        }

        const date = new Date(monday);
        date.setDate(date.getDate() + dayOffset[day.date]);

        return {
            date,
            en,
            fi
        }
    })
}

const getAllRestaurants = async () => {
    return await Promise.all(restaurants.map(getRestaurant));
}

const updateRestaurants = async () => {
    const rest = await getAllRestaurants();
    for(const r of rest) {
        if(!await restaurantExists(r.name)) {
            await addRestaurant(r.name, r.url, r.campus, r.city);
        }
    }
    rest.forEach(r => {
        r.menu.forEach(day => {
            updateMenu(r.name, day.date, { en: day.en, fi: day.fi });
        });
    });
}

module.exports = { updateRestaurants };

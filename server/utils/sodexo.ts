import { CAMPUSES } from '~/utils/constants';

interface SodexoRestaurant {
  meta: RestaurantMeta;
  id: string;
}

const restaurants: SodexoRestaurant[] = [
  {
    id: '111',
    meta: {
      name: 'Hertsi',
      url: 'https://www.sodexo.fi/ravintolat/ravintola-hertsi',
      provider: Provider.sodexo,
      ...CAMPUSES.TAMPERE.HERVANTA
    }
  }
];

const getRestaurant = async (restaurant: SodexoRestaurant): Promise<RestaurantMeta & { menu: Menu[] }> => {
  try {
    return { ...restaurant.meta, menu: formatMenu(await getRestaurantMenu(restaurant.id)) };
  } catch (err) {
    console.error('Error getting menu for', restaurant.meta.name, err);
    throw new Error('Failed to get restaurant menu');
  }
};

const getRestaurantMenu = async (restaurantId: string): Promise<any> => {
  const response = await fetch(`https://www.sodexo.fi/ruokalistat/output/weekly_json/${ restaurantId }`);
  return response.json();
};

const formatMenu = (menu: any): Menu[] => {
  let monday = menu.timeperiod.split(' - ')[0].split('.');
  monday.pop();
  monday.push(new Date().getFullYear().toString());
  monday.reverse();
  monday = new Date(Date.UTC(parseInt(monday[0]), parseInt(monday[1]) - 1, parseInt(monday[2])));

  return menu.mealdates.map((day: any) => {
    const [en, fi] = ['en', 'fi'].map(lang => {
      return Object.values(day.courses).map((course: any) => {
        return {
          name: course.category,
          items: [
            {
              name: course[`title_${ lang }`],
              diets: course.dietcodes,
              ingredients: Object.values(course.recipes)
                .map((recipe: any) => {
                  if (recipe.ingredients) return `${ recipe.name } (${ recipe.ingredients })\n`;
                })
                .filter((i: any) => i)
                .join('')
                .trim()
            }
          ]
        };
      });
    });

    const dayOffset: { [key: string]: number } = {
      Maanantai: 0,
      Tiistai: 1,
      Keskiviikko: 2,
      Torstai: 3,
      Perjantai: 4,
      Lauantai: 5,
      Sunnuntai: 6
    };

    const date = new Date(monday);
    date.setDate(date.getDate() + dayOffset[day.date]);

    return {
      date,
      en,
      fi
    };
  });
};

const getAllRestaurants = async (): Promise<(RestaurantMeta & { menu: Menu[] })[]> => {
  return await Promise.all(restaurants.map(getRestaurant));
};

const updateSodexoRestaurants = async (): Promise<void> => {
  const rest = await getAllRestaurants();
  if (rest.length !== restaurants.length) {
    console.log('Sodexo restaurant count mismatch');
  }
  for (const r of rest) {
    if (!await restaurantExists(r.name)) {
      await upsertRestaurant(r);
    }
  }
  rest.forEach(r => {
    r.menu.forEach(day => {
      updateMenu(r.name, day.date, { en: day.en, fi: day.fi });
    });
  });
};

export { updateSodexoRestaurants };

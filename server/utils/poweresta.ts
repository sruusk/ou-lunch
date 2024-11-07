import { CAMPUSES } from '~/utils/constants';

interface PowerestaRestaurant {
  name: string;
  menu: string;
  meta: RestaurantMeta;
}


const restaurants: PowerestaRestaurant[] = [
  {
    name: 'julinia',
    menu: 'ravintolajulinia',
    meta: {
      name: 'Julinia',
      url: 'https://www.uniresta.fi/julinia',
      provider: Provider.uniresta,
      ...CAMPUSES.OULU.LINNANMAA,
      openingHours: [
        ...[1,2,3,4].map(day => ({
          day,
          open: {hours: 10, minutes: 30},
          close: {hours: 14, minutes: 30}
        })),
        {
          day: 5,
          open: { hours: 10, minutes: 30 },
          close: { hours: 14, minutes: 0 }
        }
      ]
    }
  },
  {
    name: 'lipasto',
    menu: 'ravintolalipasto',
    meta: {
      name: 'Lipasto',
      url: 'https://www.uniresta.fi/lipasto',
      provider: Provider.uniresta,
      ...CAMPUSES.OULU.LINNANMAA,
      openingHours: [
        ...[1,2,3,4,5].map(day => ({
          day,
          open: {hours: 10, minutes: 30},
          close: {hours: 14, minutes: 0}
        })),
        {
          day: 6,
          open: { hours: 11, minutes: 30 },
          close: { hours: 14, minutes: 30 }
        }
      ]
    }
  },
  {
    name: 'campus',
    menu: 'h2ocampus',
    meta: {
      name: 'H2O Campus',
      url: 'https://www.health2organic.fi/',
      provider: Provider.uniresta,
      ...CAMPUSES.OULU.LINNANMAA,
      openingHours: [1,2,3,4,5].map(day => ({
        day: day,
        open: { hours: 10, minutes: 30 },
        close: { hours: 14, minutes: 0 }
      }))
    }
  }
];

const getRestaurant = async (restaurant: PowerestaRestaurant): Promise<RestaurantMeta & { menu: Menu[] }> => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  try {
    const res = await fetch(`https://api.fi.poweresta.com/publicmenu/dates/uniresta/${restaurant.name}/?menu=${restaurant.menu}&dates=${dates.join(',')}`).then(res => res.json());
    return { ...restaurant.meta, menu: formatMenu(res) };
  } catch (err) {
    console.error('Error getting menu for', restaurant.meta.name, err);
    return { ...restaurant.meta, menu: [] };
  }
};

const formatMenu = (menu: any[]): Menu[] => {
  return menu.map(day => {
    const out: any = { en: [], fi: [] };
    ['en', 'fi'].forEach(lang => {
      out[lang] = day.data.mealOptions.map((option: any) => {
        return {
          name: option.names.find((name: any) => name.language === lang).name || '',
          items: option.rows.map((row: any) => {
            const item: MenuItem = {
              name: row.names.find((name: any) => name.language === lang).name || '',
              diets: row.diets.find((diet: any) => diet.language === lang).dietShorts?.join(', ').replaceAll('KELA', '*') || undefined,
              ingredients: row.ingredients.find((ingredient: any) => ingredient.language === lang).ingredients || undefined
            };
            // Remove empty properties
            Object.keys(item).forEach(key => {
              if (item[key as keyof MenuItem] === undefined) delete item[key as keyof MenuItem];
            });
            return item;
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

const getAllMenus = async (): Promise<(RestaurantMeta & { menu: Menu[] })[]> => {
  const menus = await Promise.all(restaurants.map(getRestaurant));
  const emptyMenus = menus.filter(m => m.menu.length === 0);
  if(emptyMenus.length > 0) {
    console.error('Failed to get all poweresta menus.');
    console.error(emptyMenus.map(m => m.name));
  }
  return menus.flat();
};

const updatePowerestaRestaurants = async (): Promise<void> => {
  const menus = await getAllMenus();
  for (const m of menus) {
    await upsertRestaurant(m);
  }
  // Update the menu for each restaurant
  menus.forEach(menu => {
    menu.menu.forEach(day => {
      updateMenu(menu.name, day.date, { en: day.en, fi: day.fi });
    });
  });
};

export { updatePowerestaRestaurants };

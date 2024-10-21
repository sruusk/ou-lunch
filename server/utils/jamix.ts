import { CAMPUSES } from '~/utils/constants';

const restaurants = [6, 49, 69, 70];

const resolvers: { restaurant: number; id: string; meta: RestaurantMeta }[] = [
  {
    restaurant: 49,
    id: '111',
    meta: {
      name: 'Mara',
      url: 'https://juvenes.fi/mara/',
      ...CAMPUSES.OULU.LINNANMAA
    }
  },
  {
    restaurant: 69,
    id: '84',
    meta: {
      name: 'Foobar',
      url: 'https://juvenes.fi/foobar/',
      ...CAMPUSES.OULU.LINNANMAA
    }
  },
  {
    restaurant: 70,
    id: '118',
    meta: {
      name: 'Kerttu',
      url: 'https://juvenes.fi/kerttu/',
      ...CAMPUSES.OULU.LINNANMAA
    }
  },
  {
    restaurant: 70,
    id: '119',
    meta: {
      name: 'Voltti',
      url: 'https://juvenes.fi/voltti/',
      ...CAMPUSES.OULU.LINNANMAA
    }
  },
  {
    restaurant: 6,
    id: '112',
    meta: {
      name: 'Konehuone',
      url: 'https://juvenes.fi/konehuone/',
      ...CAMPUSES.TAMPERE.HERVANTA
    }
  },
  {
    restaurant: 6,
    id: '56',
    meta: {
      name: 'Newton',
      url: 'https://juvenes.fi/newton/',
      ...CAMPUSES.TAMPERE.HERVANTA
    }
  }
];

interface MenuDay {
  date: Date;
  options: MenuCategory[];
}

const getMenu = async (restaurant: number): Promise<(RestaurantMeta & { menuTypeId: string; fin: MenuDay[]; eng?: MenuDay[] })[]> => {
  try {
    const fin = await getRestaurant(restaurant, 'fi');
    const eng = await getRestaurant(restaurant, 'en');
    const menus = formatMenu(fin).map(menu => {
      const meta = resolvers.find(r => r.restaurant === restaurant && r.id === menu.menuTypeId.toString())?.meta;
      if (!meta) return;
      return {
        ...meta,
        menuTypeId: menu.menuTypeId,
        fin: menu.days,
      };
    }).filter(menu => menu) as (RestaurantMeta & { menuTypeId: string; fin: MenuDay[]; eng?: MenuDay[] })[];
    formatMenu(eng).forEach((menu) => {
      const a = menus.find(m => m.menuTypeId === menu.menuTypeId);
      if (a) a.eng = menu.days;
    });
    return menus.flat();
  } catch (err) {
    console.error('Error getting menu for', restaurant, err);
    return [];
  }
};

const getRestaurant = (restaurant: number, lang: string): Promise<any> => {
  return fetch(`https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/93077/${restaurant}?lang=${lang}`)
    .then(res => res.json());
};

const formatMenu = (menu: any): { menuTypeId: string; days: MenuDay[] }[] => {
  return menu[0].menuTypes.map((type: { menuTypeId: any; menus: any[]; }) => {
    return {
      menuTypeId: type.menuTypeId,
      days: type.menus.map((m: any) => m.days.map((day: any) => {
        let d = day.date.toString();
        const date = new Date();
        date.setUTCFullYear(parseInt(d.slice(0, 4)), parseInt(d.slice(4, 6)) - 1, parseInt(d.slice(6, 8)));
        date.setUTCHours(0, 0, 0, 0);

        return {
          date,
          options: day.mealoptions.map((option: any): MenuCategory => {
            return {
              name: option.name,
              items: option.menuItems.map((menuItem: any): MenuItem => {
                return {
                  name: menuItem.name,
                  diets: menuItem.diets,
                  ingredients: menuItem.ingredients
                };
              })
            };
          })
        };
      })).flat()
    };
  });
};

const getAllMenus = async (): Promise<(RestaurantMeta & { menuTypeId: string; fin: MenuDay[]; eng?: MenuDay[] })[]> => {
  const menus = (await Promise.all(restaurants.map(getMenu))).flat();
  if(menus.length !== resolvers.length) {
    console.error('Failed to get all jamix menus. Expected', resolvers.length, 'got', menus.length);
  }
  return menus;
};

const updateJamixRestaurants = async (): Promise<void> => {
  const menus = await getAllMenus();
  for (const m of menus) {
    if (!await restaurantExists(m.name)) {
      await addRestaurant(m.name, m.url, m.campus, m.city);
    }
  }
  menus.forEach(menu => {
    menu.fin.forEach(day => {
      const out: {en: MenuCategory[], fi: MenuCategory[]} = {
        fi: day.options,
        en: menu.eng?.find(m => m.date.getTime() === day.date.getTime())?.options || []
      };
      updateMenu(menu.name, day.date, out);
    });
  });
};

export { updateJamixRestaurants };

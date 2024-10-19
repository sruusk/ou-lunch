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

const getMenu = async (restaurant: number): Promise<(RestaurantMeta & { menuTypeId: string; fin: Menu[]; eng?: Menu[] })[]> => {
  try {
    const fin = await getRestaurant(restaurant, 'fi');
    const eng = await getRestaurant(restaurant, 'en');
    const menus = formatMenu(fin).map(menu => {
      const meta = resolvers.find(r => r.restaurant === restaurant && r.id === menu.menuTypeId.toString())?.meta;
      if (!meta) return;
      return {
        ...meta,
        menuTypeId: menu.menuTypeId,
        fin: menu.days
      };
    }).filter(menu => menu) as (RestaurantMeta & { menuTypeId: string; fin: Menu[] })[];
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

const formatMenu = (menu: any): { menuTypeId: string; days: Menu[] }[] => {
  return menu[0].menuTypes.map(type => {
    return {
      menuTypeId: type.menuTypeId,
      days: type.menus.map((m: any) => m.days.map((day: any) => {
        let d = day.date.toString();
        const date = new Date();
        date.setUTCFullYear(parseInt(d.slice(0, 4)), parseInt(d.slice(4, 6)) - 1, parseInt(d.slice(6, 8)));
        date.setUTCHours(0, 0, 0, 0);

        return {
          date,
          options: day.mealoptions.map((option: any) => {
            return {
              name: option.name,
              items: option.menuItems.map((menuItem: any) => {
                return {
                  name: menuItem.name,
                  diets: menuItem.diets,
                  ingredients: menuItem.ingredients
                } as MenuItem;
              })
            } as MenuCategory;
          })
        } as Menu;
      })).flat()
    };
  });
};

const getAllMenus = async (): Promise<(RestaurantMeta & { menuTypeId: string; fin: Menu[]; eng?: Menu[] })[]> => {
  const menus = await Promise.all(restaurants.map(getMenu));
  return menus.flat();
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
      const out = {
        fi: day.options,
        en: menu.eng?.find(m => m.date.getTime() === day.date.getTime())?.options
      };
      updateMenu(menu.name, day.date, out);
    });
  });
};

export { updateJamixRestaurants };

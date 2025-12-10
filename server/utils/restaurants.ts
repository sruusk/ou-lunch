import moment from 'moment-timezone';
import type { PushOperator } from 'mongodb';
import type { Document } from 'yaml';

export const getMenus = async (filter: RestaurantFilter): Promise<Restaurant[]> => {
  try {
    const today = moment.tz('Europe/Helsinki').startOf('day').toDate();
    const restaurants = await (await getDb()).collection('restaurants').find(filter).toArray() as unknown as Restaurant[];
    return restaurants
      .map((restaurant: Restaurant) => {
        const menu = restaurant.menu.filter(menu => menu.date >= today);
        return { ...restaurant, menu };
      })
      .filter(restaurant => restaurant.menu.length > 0);
  }
  catch (err) {
    console.error(err);
    throw new Error('Failed to get menus');
  }
};

export const upsertRestaurant = async (details: RestaurantMeta): Promise<void> => {
  const { name, url, campus, city, provider, openingHours } = details;
  try {
    await (await getDb()).collection('restaurants').updateOne(
      { name },
      { $set: { name, url, city, campus, provider, menu: [], ...(openingHours && { openingHours }) } },
      { upsert: true },
    );
  }
  catch (err) {
    console.error(JSON.stringify(err, null, 2));
    throw new Error('Failed to add or update restaurant');
  }
};

export const restaurantExists = async (name: string): Promise<boolean> => {
  return (await (await getDb()).collection('restaurants').findOne({ name })) !== null;
};

export const updateMenu = async (name: string, date: Date, menu: {
  en: MenuCategory[];
  fi: MenuCategory[];
}): Promise<void> => {
  try {
    date.setUTCHours(0, 0, 0, 0);
    const restaurant = await (await getDb()).collection('restaurants').findOne({ name, 'menu.date': date });
    if (restaurant) {
      await (await getDb()).collection('restaurants').updateOne({
        name,
        'menu.date': date,
      }, { $set: { 'menu.$': { date, ...menu } } });
    }
    else {
      await (await getDb()).collection('restaurants').updateOne({ name }, { $push: { menu: { date, ...menu } } } as unknown as PushOperator<Document>);
    }
  }
  catch (err: unknown) {
    const error = err as { code?: number };
    if (error.code === 121) {
      console.log(JSON.stringify(menu, null, 2), JSON.stringify(error, null, 2), name); // Validation error
    }
    else {
      console.error(err);
    }
    throw new Error('Failed to update menu');
  }
};

export const updatePrices = async (name: string, prices: Price[]): Promise<void> => {
  try {
    await (await getDb()).collection('restaurants').updateOne({ name }, { $set: { prices } });
  }
  catch (err) {
    console.error(err);
    throw new Error('Failed to update prices');
  }
};

export const updateNonNormalOpeningHours = async (name: string, nonNormalOpeningHours: NonNormalOpeningHours[]): Promise<void> => {
  try {
    await (await getDb()).collection('restaurants').updateOne({ name }, { $set: { nonNormalOpeningHours } });
  }
  catch (err) {
    console.error(err);
    throw new Error('Failed to update non-normal opening hours');
  }
};

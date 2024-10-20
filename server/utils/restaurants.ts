import moment from 'moment-timezone';
import type {PushOperator} from "mongodb";
import {Document} from "yaml";

export const getMenus = async (filter: object): Promise<Restaurant[]> => {
  try {
    const today = moment.tz('Europe/Helsinki').startOf('day').toDate();
    const restaurants = await (await getDb()).collection("restaurants").find(filter).toArray() as unknown as Restaurant[];
    return restaurants
      .map((restaurant: Restaurant) => {
        const menu = restaurant.menu.filter((menu) => menu.date >= today);
        return { ...restaurant, menu };
      })
      .filter((restaurant) => restaurant.menu.length > 0);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get menus');
  }
};

export const addRestaurant = async (name: string, url: string, campus: string, city: string): Promise<void> => {
  if (!name) throw new Error('Name is required');
  if (!url) throw new Error('URL is required');
  if (!campus) throw new Error('Campus is required');
  if (!city) throw new Error('City is required');
  try {
    await (await getDb()).collection('restaurants').insertOne({ name, url, city, campus, menu: [] });
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    throw new Error('Failed to add restaurant');
  }
};

export const restaurantExists = async (name: string): Promise<boolean> => {
  return (await (await getDb()).collection('restaurants').findOne({ name })) !== null;
};

export const updateMenu = async (name: string, date: Date, menu: { en: MenuCategory[]; fi: MenuCategory[] }): Promise<void> => {
  try {
    date.setUTCHours(0, 0, 0, 0);
    const restaurant = await (await getDb()).collection('restaurants').findOne({ name, 'menu.date': date });
    if (restaurant) {
      await (await getDb()).collection('restaurants').updateOne({ name, 'menu.date': date }, { $set: { 'menu.$': { date, ...menu } } });
    } else {
      await (await getDb()).collection('restaurants').updateOne({ name }, {$push: {menu: {date, ...menu}}} as unknown as PushOperator<Document>);
    }
  } catch (err: any) {
    if (err.code === 121) {
      console.log(JSON.stringify(menu, null, 2), JSON.stringify(err, null, 2), name); // Validation error
    } else {
      console.error(err);
    }
    throw new Error('Failed to update menu');
  }
};

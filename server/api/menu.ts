// server/api/menu.ts
export default defineEventHandler(async (event) => {
  // Get query parameters
  const { city, campus } = getQuery(event);
  const filter: RestaurantFilter = {};
  if(city && campus) {
    filter['city'] = city as string;
    filter['campus'] = campus as string;
  } else if (city || campus) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You must provide both city and campus parameters or none at all',
    });
  }

  const restaurants = await getMenus(filter);

  if(restaurants.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No restaurants found with the given parameters',
    });
  }

  return restaurants;
});

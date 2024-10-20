// server/api/menu.ts
export default defineEventHandler(async (event) => {
  // Get query parameters
  const { city, campus } = getQuery(event);
  const filter: RestaurantFilter = {};
  if(city && campus) {
    filter['city'] = city as string;
    filter['campus'] = campus as string;
  }
  return await getMenus(filter);
});

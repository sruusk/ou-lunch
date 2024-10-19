// server/api/menu.ts
import {defineEventHandler} from "h3";

export default defineEventHandler(async (event) => {
  // Get query parameters
  const { city, campus } = getQuery(event);
  const filter = {};
  if(city && campus) {
    filter['city'] = city;
    filter['campus'] = campus;
  }
  return await getMenus(filter);
});

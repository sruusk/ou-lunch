// server/api/menu.ts
import {defineEventHandler} from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const url = `${runtimeConfig.apiUrl}/api/menu?campus=Oulu%20Linnanmaa`;

  return await $fetch(url);
});

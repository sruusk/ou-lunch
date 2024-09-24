// server/api/menu.ts
import {defineEventHandler} from "h3";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const url = `${runtimeConfig.apiUrl}/api/menu`;

  return await $fetch(url);
});
<template>
  <div>
    <NuxtRouteAnnouncer/>
    <UCard>
      <template #header>
        <PageHeader/>
      </template>
      <UContainer class="flex flex-wrap justify-center min-w-full">
        <RestaurantMenu
          v-for="restaurant in restaurants"
          :key="restaurant.name"
          :date="date"
          :restaurant="restaurant"
        />
      </UContainer>
      <template #footer>
        <UContainer class="flex justify-center">
          <ULink
            class="text-cool-600 dark:text-cool-400 flex items-center"
            href="https://github.com/sruusk/ou-lunch"
            target="_blank"
          >
            <UIcon class="w-10 h-10" name="grommet-icons:github"/>
          </ULink>
        </UContainer>
      </template>
    </UCard>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import PageHeader from "~/PageHeader.vue";

export default defineComponent({
  name: "app",
  components: { PageHeader },
  data() {
    return {
      date: new Date(),
    };
  },
  async setup() {
    // const url = import.meta.env.DEV ? "http://localhost:3001/api/menu" : "https://api.ouf.fi/api/menu";
    const url = "https://api.ouf.fi/api/menu";
    const response = await useFetch(url).catch((e) => {
      console.error("Failed to fetch data from the API", e);
    });
    const restaurants = response.data.value?.map(restaurant => {
      restaurant.menu = restaurant.menu.map(menu => {
        menu.date = new Date(menu.date);
        return menu;
      });
      return restaurant;
    });
    if(!restaurants) {
      console.error("Failed to fetch data from the API");
    }

    return {
      restaurants
    };
  },
  // async mounted() {
  //   const url = import.meta.env.DEV ? "http://localhost:3001/api/menu" : "https://api.ouf.fi/api/menu";
  //   const response = await fetch(url).catch((e) => {
  //     console.error("Failed to fetch data from the API", e);
  //     alert("Could not fetch data from the API. Please try again later.");
  //   });
  //   const json = await response.json();
  //   this.restaurants = json.map(restaurant => {
  //     restaurant.menu = restaurant.menu.map(menu => {
  //       menu.date = new Date(menu.date);
  //       return menu;
  //     });
  //     return restaurant;
  //   });
  // }
});
</script>

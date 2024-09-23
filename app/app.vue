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
    const url = `${import.meta.env.VITE_API_URL || 'localhost:3001'}/api/menu`;
    const response = await useFetch(url, {
      transform: restaurants => {
        return restaurants.map(restaurant => {
          restaurant.menu = restaurant.menu.map(menu => {
            menu.date = new Date(menu.date);
            return menu;
          });
          return restaurant;
        });
      },
    });


    const restaurants = response.data;

    return {
      restaurants
    };
  },
  beforeMount() {
    setInterval(() => {
      this.date = new Date();
    }, 1000);

    if(!this.restaurants?.length) {
      alert("Could not fetch data from the server. Please try again later.");
    }
  },
});
</script>

<style>
* {
  transition: background-color 0.5s;
}
</style>

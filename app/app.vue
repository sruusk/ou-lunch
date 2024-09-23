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
            to="https://github.com/sruusk/ou-lunch"
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
import PageHeader from "~/components/PageHeader.vue";

export default defineNuxtComponent({
  name: "app",
  components: { PageHeader },
  data() {
    return {
      date: new Date(),
    };
  },
  async setup() {
    const response = await useFetch('/api/menu', {
      key: "restaurants",
      server: true,
      transform: (data) => {
        return data.map(r => {
          r.menu = r.menu.map(m => {
            m.date = new Date(m.date);
            return m;
          });
          return r;
        });
      }
    });

    return {
      restaurants: response.data
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

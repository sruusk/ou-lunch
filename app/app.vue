<template>
  <div>
    <NuxtRouteAnnouncer/>
    <UCard>
      <template #header>
        <PageHeader/>
      </template>
      <div class="flex justify-center items-center mb-4">
        <DateSelect v-model:date="date" :dates="dates"/>
        <OptionsMenu v-model:config="filterConfig"/>
      </div>
      <UContainer class="flex flex-wrap justify-center max-w-7xl">
        <RestaurantMenu
          v-for="restaurant in restaurants"
          :key="restaurant.name"
          :date="date"
          :restaurant="restaurant"
          :filters="filterConfig"
        />
      </UContainer>
      <template #footer>
        <PageFooter/>
      </template>
    </UCard>
  </div>
</template>
<script>

export default defineNuxtComponent({
  name: "app",
  data() {
    return {
      date: new Date(),
      filterConfig: {
        filters: {
          vegan: false,
          eggFree: false,
          milkFree: false,
          glutenFree: false,
          lactoseFree: false,
          recommended: false,
        },
        method: "highlight",
      },
    };
  },
  async setup() {
    useSeoMeta({
      title: "Menu",
      description: "Oulu University lunch menus",
      ogImage: "/logo.png",
    });

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
  created() {
    useHead({
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - ${this.$t("title")}` : this.$t("title");
      },
    });
  },
  beforeMount() {
    if(!this.restaurants?.length) {
      alert("Could not fetch data from the server. Please try again later.");
    }
  },
  computed: {
    dates() {
      if(!this.restaurants?.length) return [];
      const dates = new Set();
      this.restaurants.forEach(r => {
        r.menu.forEach(m => {
          if(m.fi?.length)
            dates.add(m.date.toDateString());
        });
      });
      return Array.from(dates)
        .map(d => new Date(d))
        .sort((a, b) => a - b)
        .slice(0, 6);
    }
  }
});
</script>

<style>
* {
  transition: background-color 0.5s;
}
</style>

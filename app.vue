<template>
  <NuxtRouteAnnouncer/>
  <UCard>
    <template #header>
      <PageHeader/>
    </template>
    <h1 class="hidden">{{ $t('pageDescription') }}</h1>
    <div class="flex justify-center items-center flex-wrap mb-4 gap-5">
      <DateSelect v-model:date="date" :dates="dates"/>
      <OptionsMenu v-model:config="filterConfig"/>
    </div>
    <UContainer class="flex flex-wrap justify-center max-w-7xl" role="main">
      <RestaurantMenu
        v-for="restaurant in restaurants"
        :key="restaurant.name"
        :date="date"
        :restaurant="restaurant"
        :filters="filterConfig"
        class="flex-grow"
      />
    </UContainer>
    <template #footer>
      <PageFooter/>
    </template>
  </UCard>
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
      title: "OUF",
      description: "Oulu University lunch menus",
      ogImage: "/logo.png",
    });

    const orderCookie = useCookie('order', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    const order = useState('order', () => {
      return orderCookie.value;
    });

    const campus = CAMPUSES.OULU.LINNANMAA;
    const response = await useFetch(`/api/menu?city=${campus.city}&campus=${campus.campus}`, {
      key: "restaurants",
      server: true,
      transform: (data) => {
        if(!order.value) {
          order.value = data.map(r => r.name);
        }
        return data.map(r => {
          r.menu = r.menu.map(m => {
            m.date = new Date(m.date);
            return m;
          });
          return r;
        }).sort((a, b) => {
          return order.value.indexOf(a.name) - order.value.indexOf(b.name);
        });
      }
    });

    return {
      apiRestaurants: response.data,
      order,
    };
  },
  created() {
    useHead({
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - ${this.$t("title")}` : this.$t("title");
      },
    });

    this.date = this.dates[0];
  },
  beforeMount() {
    if(!this.restaurants?.length) {
      alert("Could not fetch data from the server. Please try again later.");
    } else if(Array.isArray(this.order)) {
      // Check for removed or added restaurants and add new ones to the end of the list
      const r = this.apiRestaurants.map(r => r.name);
      const newItems = r.filter(i => !this.order.includes(i));
      const removedItems = this.order.filter(i => !r.includes(i));
      if(newItems.length) this.order.push(...newItems);
      if(removedItems.length) this.order = this.order.filter(i => !removedItems.includes(i));
    }
  },
  computed: {
    restaurants() {
      if(!this.apiRestaurants) return [];
      if(!this.order) return this.apiRestaurants;
      return this.apiRestaurants.filter(r => r.menu.length).sort((a, b) => {
        return this.order.indexOf(a.name) - this.order.indexOf(b.name);
      });
    },
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
    },
  }
});
</script>

<style>
* {
  transition: background-color 0.5s ease-out, border-color 0.5s ease-out, box-shadow 0.5s ease-out;
}
</style>

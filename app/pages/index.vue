<template>
  <h1 class="hidden">
    {{ $t('pageDescription') }}
  </h1>
  <UCard :ui="{ body: 'grow' }" class="flex flex-col min-h-dvh">
    <template #header>
      <PageHeader class="h-10" />
    </template>
    <div v-if="!noRestaurants" class="flex justify-center items-center flex-wrap mb-4 gap-5">
      <DateSelect :dates="dates" />
      <OptionsMenu v-model:config="filterConfig" />
    </div>
    <UContainer class="flex flex-wrap justify-center max-w-7xl" role="main">
      <UAlert
        v-if="noRestaurants"
        class="max-w-sm mt-36"
        :title="$t('noRestaurants')"
        :description="$t('noRestaurantsDescription')"
        icon="ion:information-circle-outline"
      />
      <RestaurantMenu
        v-for="restaurant in restaurants"
        :key="restaurant.name"
        :restaurant="restaurant"
      />
    </UContainer>
    <template #footer>
      <PageFooter class="h-10" />
    </template>
  </UCard>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'Index',
  async setup() {
    useSeoMeta({
      title: 'OUF',
      description: 'Oulu University lunch menus',
      ogImage: '/logo.png',
    });

    const orderCookie = useCookie('order', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    const order = useState('order', () => {
      return orderCookie.value;
    }) as unknown as { value: string[] }; // value is only used in setup function

    const campus = CAMPUSES.OULU.LINNANMAA;
    const response = await useFetch(`/api/menu?city=${campus.city}&campus=${campus.campus}`, {
      key: 'restaurants',
      server: true,
      transform: (data: Restaurant[]) => {
        if (!order.value) {
          order.value = data.map(r => r.name);
        }
        return data.map((r) => {
          r.menu = r.menu.map((m) => {
            m.date = new Date(m.date);
            return m;
          });
          return r;
        }).sort((a, b) => {
          return order.value.indexOf(a.name) - order.value.indexOf(b.name);
        });
      },
    });

    // Check for removed or added restaurants and add new ones to the end of the list
    if (Array.isArray(order.value) && response.data.value) {
      const r = response.data.value.map((r: Restaurant) => r.name);
      const newItems = r.filter(i => !order.value.includes(i));
      const removedItems = order.value.filter(i => !r.includes(i));
      if (newItems.length) order.value.push(...newItems);
      if (removedItems.length) order.value = order.value.filter(i => !removedItems.includes(i));
    }

    return {
      apiRestaurants: response.data,
      order: order as unknown as string[],
      selectedDate: useSelectedDate(),
    };
  },
  data() {
    return {
      filterConfig: {
        filters: {
          vegan: false,
          eggFree: false,
          milkFree: false,
          glutenFree: false,
          lactoseFree: false,
          recommended: false,
        },
        method: 'highlight',
      },
    };
  },
  computed: {
    restaurants(): Restaurant[] {
      if (!this.apiRestaurants) return [];
      if (!this.order) return this.apiRestaurants;
      return this.apiRestaurants.filter(r => r.menu.length).sort((a, b) => {
        return this.order.indexOf(a.name) - this.order.indexOf(b.name);
      });
    },
    dates(): Date[] {
      if (!this.restaurants?.length) return [];
      const dates: Set<string> = new Set();
      this.restaurants.forEach((r) => {
        r.menu.forEach((m) => {
          if (m.fi?.length)
            dates.add(m.date.toISOString());
        });
      });
      return Array.from(dates)
        .map(d => new Date(d))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime())
        .slice(0, 6);
    },
    noRestaurants(): boolean {
      return !this.restaurants?.filter(r => r.menu.filter(m => m.fi.length).length)?.length;
    },
  },
  watch: {
    dates(dateArray: Date[]) {
      const selectedDate = this.selectedDate.current.value.toDateString();
      if (!dateArray.map(d => d.toDateString()).includes(selectedDate)) {
        this.selectedDate.current.value = dateArray[0]!;
      }
    },
  },
  created() {
    useHead({
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - ${this.$t('title')}` : this.$t('title');
      },
    });
  },
  beforeMount() {
    if (!this.restaurants?.length) {
      alert('Could not fetch data from the server. Please try again later.');
    }
  },
  mounted() {
    umTrackView();
  },
});
</script>

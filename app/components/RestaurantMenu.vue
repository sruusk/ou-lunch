<template>
  <UCard class="my-2 mx-2 min-h-full max-w-80 min-w-80">
    <template #header>
      <ULink
        :external="true"
        :to="restaurant.url"
        class="capitalize text-xl text-blue-800 font-semibold dark:text-blue-200"
        target="_blank"
      >
        {{ restaurant.name }}
      </ULink>
    </template>
    <div v-if="menus?.length"
         v-for="(menu, index) in menus"
         :key="index"
         class="first:-mt-2"
    >
      <MenuVariant :filters="filters" :menu="menu"/>
    </div>
    <div v-else class="py-2">
      <p class="text-cool-600 dark:text-cool-400">{{ $t("noMenu") }}</p>
    </div>
  </UCard>
</template>

<script>
export default defineNuxtComponent({
  name: "RestaurantMenu",
  props: {
    restaurant: {
      type: Object,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  computed: {
    menus() {
      const lang = this.$i18n.locale === "en" ? "en" : "fi";
      // Find the menu for the current date and return it in the correct language
      return this.restaurant.menu.find(menu => menu.date.toDateString() === this.date.toDateString())?.[lang];
    },
  },
});
</script>


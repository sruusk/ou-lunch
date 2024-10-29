<template>
  <UCard class="my-2 mx-2 min-h-full max-w-80 w-full">
    <template #header>
      <div class="flex justify-between">
        <ULink
          :external="true"
          :to="restaurant.url"
          class="capitalize text-xl text-blue-800 font-semibold dark:text-blue-200"
          target="_blank"
          :aria-label="`${$t('aria.open')} ${restaurant.name} ${$t('aria.page')}`"
        >
          {{ restaurant.name }}
        </ULink>
        <UBadge color="white" variant="solid">
          {{ restaurant.provider }}
        </UBadge>
      </div>
    </template>
    <div v-if="menus?.length"
         v-for="(menu, index) in menus"
         :key="index"
         class="first:-mt-2 mt-3"
    >
      <MenuVariant :menu="menu"/>
    </div>
    <div v-else>
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
    }
  },
  data() {
    return {

    };
  },
  computed: {
    menus() {
      const lang = this.$i18n.locale === "en" ? "en" : "fi";
      // Find the menu for the current date and return it in the correct language
      return this.restaurant.menu
        .find(menu => menu.date.toDateString() === this.date.toDateString())?.[lang]
        .filter(menu => menu.items.length);
    },
  },
});
</script>


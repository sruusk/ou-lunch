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
         class="py-2 border-b-2 last:border-0 first:pt-0"
    >
      <h2 class="uppercase text-xs">{{ menu.name }}</h2>

      <div v-for="(item, itemIndex) in menu.items"
           :key="itemIndex"
           class="mb-2 last:mb-0 flex flex-nowrap justify-between items-center"
      >
        <div>
          <h3 class="text-cool-800 dark:text-cool-200">{{ item.name }}</h3>
          <p v-if="item.diets?.length" class="text-cool-600 dark:text-cool-400 text-xs -mt-0.5">
            {{ item.diets }}
          </p>
        </div>
        <UPopover mode="click" v-if="item.ingredients?.length > 10 && item.ingredients !== item.name" :aria-label="$t('aria.ingredients')">
          <UIcon name="material-symbols:info" class="w-5 h-5 inline-block "/>
          <template #panel>
            <div class="p-2 w-96 max-w-[90vw]">
              <p class="text-cool-800 dark:text-cool-300 text-sm whitespace-break-spaces" v-html="item.ingredients" />
            </div>
          </template>
        </UPopover>
      </div>
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
    }
  },
  computed: {
    menus() {
      const lang = this.$i18n.locale === "en" ? "en" : "fi";
      // Find the menu for the current date and return it in the correct language
      return this.restaurant.menu.find(menu => menu.date.toDateString() === this.date.toDateString())?.[lang];
    }
  },
});
</script>

<style scoped>

</style>

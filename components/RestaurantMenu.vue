<template>
  <UCard class="my-2 mx-2 min-h-full md:max-w-80 max-w-md w-full" :ui="{header: { base: 'contain-layout' }}">
    <template #header>
      <div class="flex justify-between items-center">
        <ULink
          :external="true"
          :to="restaurant.url"
          class="capitalize text-xl text-blue-800 font-semibold dark:text-blue-200"
          target="_blank"
          :aria-label="`${$t('aria.open')} ${restaurant.name} ${$t('aria.page')}`"
        >
          {{ restaurant.name }}
        </ULink>

<!--        <div class="flex items-center gap-1">-->
<!--          <UIcon name="ic:round-access-time"-->
<!--                 class="text-cool-600 dark:text-cool-400"-->
<!--          />-->
<!--          <p class="text-cool-600 dark:text-cool-400 text-xs whitespace-nowrap">-->
<!--            10:30-18:00-->
<!--          </p>-->
<!--        </div>-->

<!--        <div class="flex items-center gap-1 absolute bottom-1 left-6">-->
<!--          <p class="text-cool-600 dark:text-cool-400 text-xs whitespace-nowrap">-->
<!--            10:30-18:00-->
<!--          </p>-->
<!--        </div>-->
        <div
          v-if="openingHours"
          class="absolute bottom-1 right-[50%] translate-x-[50%] translate-y-[50%]
          border rounded px-1 -mb-1 dark:border-cool-700 border-cool-300 backdrop-blur-3xl"
        >
          <p class="text-cool-600 dark:text-cool-400 text-xs whitespace-nowrap">
            {{ openingHours.open.hours }}:{{ openingHours.open.minutes.toString().padStart(2, '0') }}
            -
            {{ openingHours.close.hours }}:{{ openingHours.close.minutes.toString().padStart(2, '0') }}
          </p>
        </div>
        <UDropdown :items="items">
          <UButton color="white"
                   :aria-label="$t('aria.restaurantInfo')"
                   variant="ghost"
                   trailing-icon="material-symbols:menu-rounded" />
        </UDropdown>
        <PricesOverlay :menu="restaurant" :show="showPrices" @show="(val) => showPrices = val"/>
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
      showPrices: false
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
    items() {
      return [
        [{
          label: this.restaurant.provider,
          icon: 'ion:restaurant-outline',
          color: 'blue'
        }], [{
          label: this.$t('restaurant.openPage'),
          icon: 'material-symbols:arrow-circle-right-outline-rounded',
          color: 'blue',
          click: () => window.open(this.restaurant.url, '_blank')
        }, {
          label: this.$t('restaurant.prices'),
          icon: 'material-symbols:euro',
          color: 'green',
          disabled: !this.restaurant.prices,
          click: () => this.showPrices = !this.showPrices
        }]
      ]
    },
    openingHours() {
      if(!this.restaurant.openingHours) return;
      const today = this.date.getDay();
      return this.restaurant.openingHours.find(oh => oh.day === today);
    }
  },
});
</script>


<template>
  <UCard v-show="menus?.length" class="my-2 mx-2 min-h-full md:max-w-80 max-w-md w-full">
    <template #header>
      <div class="flex justify-between items-center">
        <ULink
          :external="true"
          :to="restaurant.url"
          class="capitalize text-xl text-blue-800 font-semibold dark:text-blue-200 whitespace-nowrap"
          target="_blank"
          :aria-label="`${$t('aria.open')} ${restaurant.name} ${$t('aria.page')}`"
        >
          {{ restaurant.name }}
        </ULink>
        <UDropdown :items="items">
          <UButton color="white"
                   :aria-label="$t('aria.restaurantInfo')"
                   variant="ghost"
                   trailing-icon="material-symbols:menu-rounded" />
        </UDropdown>
        <PricesOverlay :menu="restaurant" :show="showPrices" @show="(val) => showPrices = val"/>
      </div>
      <div class="h-0 w-full flex justify-center">
        <div
          v-if="openingHours"
          class="h-fit w-fit bottom-0 right-0 translate-y-1/2
          border rounded px-1 -mb-1 dark:border-cool-700 border-cool-300 backdrop-blur-3xl"
        >
          <p class="text-cool-600 dark:text-cool-400 text-xs whitespace-nowrap">
            {{ openingHours.open.hours }}:{{ openingHours.open.minutes.toString().padStart(2, '0') }}
            -
            {{ openingHours.close.hours }}:{{ openingHours.close.minutes.toString().padStart(2, '0') }}
          </p>
        </div>
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
  <DevOnly v-if="!menus?.length">
    <UCard class="my-2 mx-2 min-h-full md:max-w-80 max-w-md w-full">
      <h3>{{ restaurant.name }}</h3>
      <br>
      {{ $t("noMenu") }}
      <br>
      <UAlert class="mt-5" type="info" icon="ion:information-circle-outline" description="This message is only visible in development mode"/>
    </UCard>
  </DevOnly>
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
          color: 'blue',
          type: 'label'
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


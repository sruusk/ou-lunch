<template>
  <UCard v-show="menus?.length" class="my-2 mx-2 min-h-full md:max-w-80 max-w-md w-full">
    <template #header>
      <div class="flex justify-between items-center">
        <ULink
          :aria-label="`${$t('aria.open')} ${restaurant.name} ${$t('aria.page')}`"
          :external="true"
          :to="restaurant.url"
          class="capitalize text-xl text-blue-800 font-semibold dark:text-blue-200 whitespace-nowrap"
          target="_blank"
        >
          {{ restaurant.name }}
        </ULink>
        <UDropdownMenu :items="items">
          <UButton :aria-label="$t('aria.restaurantInfo')"
                   color="neutral"
                   trailing-icon="material-symbols:menu-rounded"
                   variant="ghost"/>
        </UDropdownMenu>
        <PricesOverlay :menu="restaurant" v-model:open="showPrices"/>
      </div>
      <div class="h-0 w-full flex justify-center">
        <div
          v-if="openingHours"
          :class="{ '!border-yellow-600': nonNormalOpeningHours }"
          class="h-fit w-fit bottom-0 right-0 translate-y-1/2 flex
          border rounded px-1 -mb-1 dark:border-cool-700 border-cool-300 backdrop-blur-3xl"
        >
          <p class="text-cool-600 dark:text-cool-400 text-xs whitespace-nowrap flex">
            {{ openingHours.open.hours }}:{{ openingHours.open.minutes.toString().padStart(2, '0') }}
            -
            {{ openingHours.close.hours }}:{{ openingHours.close.minutes.toString().padStart(2, '0') }}
          </p>
        </div>
        <UPopover
          v-if="nonNormalOpeningHours"
          :label="$t('aria.nonNormalOpeningHours')"
          :ui="{ content: 'w-0' }"
          mode="click"
        >
          <UButton
            :aria-label="$t('aria.nonNormalOpeningHours')"
            class="translate-y-1"
            color="warning"
            icon="iconoir:warning-circle-solid"
            size="xs"
            variant="link"
          />
          <template #content>
            <div class="w-96 max-w-[90vw]">
              <UAlert
                :description="$t('restaurant.openingHoursDisclaimer')"
                icon="iconoir:warning-circle-solid"
                type="warning"
              />
            </div>
          </template>
        </UPopover>
      </div>
    </template>
    <div v-for="(menu, index) in menus"
         v-if="menus?.length"
         :key="index"
         class="first:-mt-2 mt-3"
    >
      <MenuVariant :menu="menu"/>
    </div>
    <div v-else>
      <p class="text-cool-600 dark:text-cool-400">{{ $t('noMenu') }}</p>
    </div>
  </UCard>
  <DevOnly v-if="!menus?.length">
    <UCard class="my-2 mx-2 min-h-full md:max-w-80 max-w-md w-full">
      <h3>{{ restaurant.name }}</h3>
      <br>
      {{ $t('noMenu') }}
      <br>
      <UAlert class="mt-5" description="This restaurant is hidden in production mode" icon="ion:information-circle-outline"
              type="info"/>
    </UCard>
  </DevOnly>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'RestaurantMenu',
  props: {
    restaurant: {
      type: Object as () => Restaurant,
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
    menus(): MenuCategory[] | undefined {
      const lang = this.$i18n.locale === 'en' ? 'en' : 'fi';
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
          type: 'label'
        }], [{
          label: this.$t('restaurant.openPage'),
          icon: 'material-symbols:arrow-circle-right-outline-rounded',
          to: this.restaurant.url,
          target: '_blank',
        }, {
          label: this.$t('restaurant.prices'),
          icon: 'material-symbols:euro',
          disabled: !this.restaurant.prices,
          type: 'link',
          onSelect: () => this.showPrices = !this.showPrices
        }]
      ];
    },
    openingHours(): LunchWindow | NonNormalOpeningHours | undefined {
      if (!this.restaurant.openingHours) return;
      const today = this.date.getDay();
      const nonNormal = this.nonNormalOpeningHours;
      if (nonNormal) {
        // console.log(`Non-normal opening hours for ${this.restaurant.name} on ${this.date.toDateString()}: ${nonNormal.open.hours}:${nonNormal.open.minutes} - ${nonNormal.close.hours}:${nonNormal.close.minutes}`);
        return nonNormal;
      }
      return this.restaurant.openingHours.find(oh => oh.day === today);
    },
    nonNormalOpeningHours(): NonNormalOpeningHours | undefined {
      const today = this.date.getDay();
      return this.restaurant.nonNormalOpeningHours?.find(oh => (new Date(oh.day)).getDay() === today);
    }
  },
});
</script>


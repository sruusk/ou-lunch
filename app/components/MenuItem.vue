<template>
  <div
    v-show="isVisible"
    class="mb-2 last:mb-0 flex flex-nowrap justify-between items-center"
    :class="{
      'border-l-2 border-cool-600 dark:border-cool-300 pl-2 -ml-2': isFiltered && hasFilters && !filterHide,
      'opacity-50': !isFiltered && hasFilters && !filterHide,
    }"
  >
    <div>
      <h3 class="text-cool-800 dark:text-cool-200">
        {{ item.name }}
      </h3>
      <p v-if="item.diets?.length" class="text-cool-600 dark:text-cool-400 text-xs -mt-0.5">
        {{ item.diets }}
      </p>
    </div>
    <UPopover mode="click" v-if="item.ingredients?.length > 10 && item.ingredients !== item.name"
              :label="$t('aria.ingredients')">
      <UButton icon="material-symbols:info" variant="text" size="sm" class="p-0" :aria-label="$t('aria.ingredients')"/>
      <template #panel>
        <div class="p-2 w-96 max-w-[90vw]">
          <p class="text-cool-800 dark:text-cool-300 text-sm whitespace-break-spaces" v-html="item.ingredients"/>
        </div>
      </template>
    </UPopover>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  setup() {
    const filters = useState('config');
    return { filters };
  },
  created() {
    this.$emit('visibility', this.isVisible);
  },
  computed: {
    isFiltered() {
      let d = this.item.diets?.split(", ").map(i => i.trim());
      if (!d?.length) return false;

      // Should return true if all enabled filters are present in the diets
      const f = [
        [/^G$/i, this.filters.filters.glutenFree],
        [/^L$/i, this.filters.filters.lactoseFree],
        [/^VEG$/i, this.filters.filters.vegan],
        [/^M$/i, this.filters.filters.milkFree],
        [/^Mu$/i, this.filters.filters.eggFree],
        [/\*/i, this.filters.filters.recommended],
      ];

      return f.every(([r, v]) => {
        if(!v) return true;
        return d.some(i => r.test(i));
      });
    },
    hasFilters() {
      return Object.values(this.filters.filters).some(v => v);
    },
    filterHide() {
      return this.filters.method === 'hide';
    },
    isVisible() {
      return !this.hasFilters || this.isFiltered || !this.filterHide;
    }
  },
  watch: {
    isVisible() {
      this.$emit('visibility', this.isVisible);
    }
  }
};
</script>

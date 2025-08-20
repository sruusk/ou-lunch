<template>
  <div v-show="menuItems.length">
    <USeparator size="sm">
      <h3>{{ menu.name }}</h3>
    </USeparator>
    <MenuItem v-for="(item, itemIndex) in menuItems"
              :key="itemIndex"
              :isFiltered="item.isFiltered"
              :item="item.item"
              :showFilter="hasFilters && !filterHide"
    />
  </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'MenuVariant',
  props: {
    menu: {
      type: Object as () => MenuCategory,
      required: true
    }
  },
  setup() {
    const filters = useState<FilterConfig>('config');
    return { filters };
  },
  computed: {
    menuItems(): { item: MenuItem, isFiltered: boolean }[] {
      return this.menu.items.map(item => {
        return {
          item,
          isFiltered: this.isFiltered(item.diets)
        };
      }).filter(i => !this.filterHide || !this.hasFilters || i.isFiltered);
    },
    hasFilters() {
      return Object.values(this.filters.filters).some(v => v);
    },
    filterHide() {
      return this.filters.method === 'hide';
    },
  },
  methods: {
    isFiltered(diets: string | undefined): boolean {
      let d = diets?.split(', ').map(i => i.trim());
      if (!d?.length) return false;

      // Should return true if all enabled filters are present in the diets
      const f: [RegExp, boolean][] = [
        [/(^G$)|(Gluten free)/i, this.filters.filters.glutenFree],
        [/(^L$)|(Lactose free)|(Low lactose)/i, this.filters.filters.lactoseFree],
        [/(^VEG$)|(Vegan)/i, this.filters.filters.vegan],
        [/(^M$)|(Milk free)/i, this.filters.filters.milkFree],
        [/^Mu$/i, this.filters.filters.eggFree],
        [/\*/i, this.filters.filters.recommended],
      ];

      return f.every(([r, v]) => {
        if (!v) return true;
        return d.some(i => r.test(i));
      });
    }
  }
});
</script>
<style scoped>
</style>

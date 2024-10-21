<template>
    <div v-show="menuItems.length" class="list">
      <UDivider :label="menu.name" size="sm" class="divider" />
      <MenuItem v-for="(item, itemIndex) in menuItems"
                :key="itemIndex"
                :item="item.item"
                :isFiltered="item.isFiltered"
                :showFilter="hasFilters && !filterHide"
      />
    </div>
</template>
<script>
export default defineNuxtComponent({
  name: 'MenuVariant',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  setup() {
    const filters = useState('config');
    return { filters };
  },
  computed: {
    menuItems() {
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
    isFiltered(diets) {
      let d = diets?.split(", ").map(i => i.trim());
      if (!d?.length) return false;

      // Should return true if all enabled filters are present in the diets
      const f = [
        [/(^G$)|(Gluten free)/i, this.filters.filters.glutenFree],
        [/(^L$)|(Lactose free)|(Low lactose)/i, this.filters.filters.lactoseFree],
        [/(^VEG$)|(Vegan)/i, this.filters.filters.vegan],
        [/(^M$)|(Milk free)/i, this.filters.filters.milkFree],
        [/^Mu$/i, this.filters.filters.eggFree],
        [/\*/i, this.filters.filters.recommended],
      ];

      return f.every(([r, v]) => {
        if(!v) return true;
        return d.some(i => r.test(i));
      });
    }
  }
});
</script>
<style scoped>
</style>

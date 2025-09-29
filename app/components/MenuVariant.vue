<template>
  <div v-show="menuItems.length">
    <USeparator size="sm">
      <h3>
        <template v-for="(part, index) in menuNameParts" :key="index">
          {{ part }}
          <br v-if="index < menuNameParts.length - 1">
        </template>
      </h3>
    </USeparator>
    <MenuItem
      v-for="(item, itemIndex) in menuItems"
      :key="itemIndex"
      :is-filtered="item.isFiltered"
      :item="item.item"
      :show-filter="hasFilters && !filterHide"
    />
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'MenuVariant',
  props: {
    menu: {
      type: Object as () => MenuCategory,
      required: true,
    },
  },
  setup() {
    const filters = useState<FilterConfig>('config');
    return { filters };
  },
  computed: {
    menuItems(): { item: MenuItem; isFiltered: boolean }[] {
      return this.menu.items.map((item) => {
        return {
          item,
          isFiltered: this.isFiltered(item.diets),
        };
      }).filter(i => !this.filterHide || !this.hasFilters || i.isFiltered);
    },
    hasFilters() {
      return Object.values(this.filters.filters).some(v => v);
    },
    filterHide() {
      return this.filters.method === 'hide';
    },
    /// Returns the menu name split into appropriate length parts
    menuNameParts(): string[] {
      const parts: string[] = [];
      const maxLength = 25;
      let currentPart = '';

      this.menu.name.split(' ').forEach((word) => {
        if ((currentPart + word).length <= maxLength) {
          currentPart += (currentPart ? ' ' : '') + word;
        }
        else {
          if (currentPart) parts.push(currentPart);
          currentPart = word;
        }
      });

      if (currentPart) parts.push(currentPart);
      return parts;
    },
  },
  methods: {
    isFiltered(diets: string | undefined): boolean {
      const d = diets?.split(', ').map(i => i.trim());
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
    },
  },
});
</script>

<style scoped>
</style>

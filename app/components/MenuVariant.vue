<template>
    <div v-show="isVisible" class="list">
      <UDivider :label="menu.name" size="sm" class="divider" />
      <MenuItem v-for="(item, itemIndex) in menu.items"
                :key="itemIndex"
                :item="item"
                @visibility="visibleChildren[itemIndex] = $event"
      />
    </div>
</template>
<script>
import MenuItem from "~/components/MenuItem.vue";

export default defineNuxtComponent({
  name: 'MenuVariant',
  components: { MenuItem },
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visibleChildren: {}
    };
  },
  computed: {
    isVisible() {
      // If running in SSR, always show the menu as filtering is done client-side
      if (process.server) {
        return true;
      }
      return Object.values(this.visibleChildren).some(v => v);
    }
  },
});
</script>
<style scoped>
</style>

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
      return Object.values(this.visibleChildren).some(v => v);
    }
  },
});
</script>
<style scoped>
</style>

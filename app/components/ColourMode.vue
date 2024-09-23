<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "ColourMode",
  setup() {
    return {
      colorMode: useColorMode()
    }
  },
  computed: {
    isDark: {
      get() {
        return this.colorMode.value === 'dark'
      },
      set() {
        this.colorMode.preference = this.colorMode.value === 'dark' ? 'light' : 'dark'
      }
    }
  },
});
</script>

<style scoped>

</style>

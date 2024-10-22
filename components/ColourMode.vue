<template>
  <div>
    <ClientOnly>
      <UButton
        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="gray"
        variant="ghost"
        :aria-label="$t('aria.colourMode')"
        @click="isDark = !isDark"
      />
      <template #fallback>
        <div class="w-8 h-8" />
      </template>
    </ClientOnly>
  </div>
</template>

<script>

export default defineNuxtComponent({
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

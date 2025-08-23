<template>
  <div>
    <ClientOnly>
      <UButton
        :aria-label="$t('aria.colourMode')"
        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
        color="neutral"
        variant="ghost"
        @click="isDark = !isDark"
      />
      <template #fallback>
        <div class="size-8" />
      </template>
    </ClientOnly>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'ColourMode',
  setup() {
    return {
      colorMode: useColorMode(),
    };
  },
  computed: {
    isDark: {
      get() {
        return this.colorMode.value === 'dark';
      },
      set() {
        this.colorMode.preference = this.colorMode.value === 'dark' ? 'light' : 'dark';
      },
    },
  },
});
</script>

<style scoped>

</style>

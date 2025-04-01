<template>
  <header>
    <UContainer class="flex justify-between items-center">
      <img
        :aria-label="$t('aria.logo')"
        alt="Oulu University Food"
        class="dark:hidden h-10"
        src="@/assets/ouf-high-resolution-logo-transparent.webp"
      />
      <img
        :aria-label="$t('aria.logo')"
        alt="Oulu University Food"
        class="h-10 hidden dark:block"
        src="@/assets/ouf-high-resolution-logo-white-transparent.webp"
      />
      <div class="flex gap-2">
        <ClientOnly>
          <ColourMode/>
          <LanguageSelect/>
        </ClientOnly>
      </div>
    </UContainer>
  </header>
</template>
<script lang="ts">
export default {
  name: 'PageHeader',
  computed: {
    isDark(): boolean {
      return this.$colorMode.value === 'dark';
    },
  }
};
</script>

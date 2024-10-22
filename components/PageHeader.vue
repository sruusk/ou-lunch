<template>
  <header>
    <UContainer class="flex justify-between items-center">
      <img
        src="@/assets/ouf-high-resolution-logo-transparent.webp"
        alt="Oulu University Food"
        class="dark:hidden h-10"
        :aria-label="$t('aria.logo')"
      />
      <img
        src="@/assets/ouf-high-resolution-logo-white-transparent.webp"
        alt="Oulu University Food"
        class="h-10 hidden dark:block"
        :aria-label="$t('aria.logo')"
      />
      <div class="flex gap-2">
        <ColourMode />
        <LanguageSelect/>
      </div>
    </UContainer>
  </header>
</template>
<script>
export default {
  name: 'PageHeader',
  computed: {
    isDark() {
      return this.$colorMode.value === 'dark';
    },
  }
};
</script>

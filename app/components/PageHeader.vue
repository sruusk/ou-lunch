<template>
  <UContainer class="flex justify-between items-center">
    <img
      src="@/assets/ouf-high-resolution-logo-transparent.webp"
      alt="Oulu University Food"
      class="dark:hidden h-10"
    />
    <img
      src="@/assets/ouf-high-resolution-logo-white-transparent.webp"
      alt="Oulu University Food"
      class="h-10 hidden dark:block"
    />
    <div class="flex gap-2">
      <ColourMode />
      <LanguageSelect />
    </div>
  </UContainer>
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

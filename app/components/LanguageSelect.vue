<template>
  <USelectMenu
    v-model="selected"
    :options="languageOptions"
    :icon="selected.icon"
    aria-label="Language"
  />
</template>

<script lang="ts">


export default defineNuxtComponent({
  name: "LanguageSelect",
  setup() {
    const { locale, locales, setLocale } = useI18n()

    return { locale, locales, setLocale };
  },
  computed: {
    languageOptions() {
      return this.locales.map((locale) => ({
        id: locale.language,
        code: locale.code,
        icon: `circle-flags:${locale.language?.split('-')[1].toLowerCase()}`,
      }))
    },
    selected: {
      get() {
        console.log(this.languageOptions, this.locale);
        return this.languageOptions.find((option) => option.code === this.locale)
      },
      set(value) {
        this.setLocale(value.code)
      },
    },
  }
});
</script>

<style scoped>

</style>

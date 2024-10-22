<template>
  <USelectMenu
    v-model="selected"
    :options="languageOptions"
    :icon="selected.icon"
    :aria-label="$t('aria.language')"
  />
</template>

<script>


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

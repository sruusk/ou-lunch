<template>
  <USelectMenu
    v-model="selected"
    :search-input="false"
    :aria-label="$t('aria.language')"
    :icon="selected?.icon as string"
    :items="languageOptions"
  />
</template>

<script lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n';

export default defineNuxtComponent({
  name: 'LanguageSelect',
  setup() {
    const { locale, locales, setLocale } = useI18n();

    return { locale, locales, setLocale };
  },
  computed: {
    languageOptions(): LanguageOption[] {
      return this.locales.map((locale: LocaleObject<'en' | 'fi'>) => ({
        id: locale.language,
        code: locale.code,
        icon: `circle-flags:${ locale.language?.split('-')?.[1]!.toLowerCase() }`,
        label: locale.code === 'en' ? 'English' : 'Suomi',
      }));
    },
    selected: {
      get() {
        return this.languageOptions.find((option) => option.code === this.locale) || this.languageOptions[0];
      },
      set(value: LanguageOption) {
        this.setLocale(value.code);
      },
    },
  }
});

interface LanguageOption {
  id?: string;
  code: 'fi' | 'en';
  icon: string;
  label: string;
}
</script>

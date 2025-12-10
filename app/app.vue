<template>
  <UApp :locale="locales[locale]">
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>

<script lang="ts">
import * as locales from '@nuxt/ui/locale';

export default defineNuxtComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n();

    const lang = computed(() => locales[locale.value].code);
    const dir = computed(() => locales[locale.value].dir);

    useHead({
      htmlAttrs: {
        lang,
        dir,
      },
    });

    return {
      locales,
      locale,
    };
  },
});
</script>

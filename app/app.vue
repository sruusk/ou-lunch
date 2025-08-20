<template>
  <NuxtRouteAnnouncer/>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
<script lang="ts">
import * as locales from '@nuxt/ui/locale'

export default defineNuxtComponent({
  name: 'app',
  setup() {
    const { locale } = useI18n()

    const lang = computed(() => locales[locale.value].code)
    const dir = computed(() => locales[locale.value].dir)

    useHead({
      htmlAttrs: {
        lang,
        dir
      }
    })
  }
});
</script>

<style>
* {
  transition: background-color 0.5s ease-out, border-color 0.5s ease-out, box-shadow 0.5s ease-out;
}
</style>

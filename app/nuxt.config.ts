// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/seo'
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'fi', language: 'fi-FI' },
    ],
    defaultLocale: 'fi',
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  site: {
    name: 'Oulu Uni Lunches',
    themeColor: '#000000',
    image: '/logo.png',
    url: 'https://ouf.fi',
  },
  ui: {
    global: true,
  }
})

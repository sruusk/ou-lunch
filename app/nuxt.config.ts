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
      { code: 'en', language: 'en-UK' },
      { code: 'fi', language: 'fi-FI' },
    ],
    defaultLocale: 'en',
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  site: {
    name: 'Oulu University Food',
    url: 'https://ouf.fi',
  },
  ui: {
    global: true,
  },
  runtimeConfig: {
    apiUrl: 'http://localhost:3001'
  },
  ogImage: {
    enabled: false,
  }
})
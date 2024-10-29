// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', language: 'en-UK' },
      { code: 'fi', language: 'fi-FI' },
    ],
    defaultLocale: 'en',
    pages: {
      home: {
        en: '/',
        fi: '/',
      },
    }
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
    dbUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'ou-lunch',
    public: {
      uId: undefined,
      uScript: undefined,
    }
  },
  ogImage: {
    enabled: false,
  },
})

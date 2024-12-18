// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sitemap',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-umami',
  ],
  umami: {
    id: 'e64eac9b-39ff-4e8c-a6f5-f2fcc63baf58',
    host: 'https://umami.anttila.io',
    autoTrack: true,
    ignoreLocalhost: true,
    excludeQueryParams: true,
    trailingSlash: 'never',
  },
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
  },
  ogImage: {
    enabled: false,
  },
})

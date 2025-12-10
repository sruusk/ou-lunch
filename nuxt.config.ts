// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/sitemap',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-umami',
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  site: {
    name: 'Oulu University Food',
    url: 'https://ouf.fi',
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  ui: {
    colorMode: true,
  },
  runtimeConfig: {
    dbUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'ou-lunch',
    heroCoreUrl: '127.0.0.1:1818',
  },
  sourcemap: {
    client: false,
    server: false,
  },
  compatibilityDate: '2024-04-03',
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // Run updateMenu every day at 6, 7, 8, 9 (UTC)
      '0 6,7,8,9 * * *': ['updateMenu'],
      // Run updatePrices every Monday at 08:00 (UTC)
      '0 8 * * 1': ['updatePrices'],
      // Run updateHours every other day at 10:00 (UTC)
      '0 10 */2 * *': ['updateHours'],
    },
  },
  vite: {
    $server: {
      build: {
        rollupOptions: {
          output: {
            preserveModules: true,
          },
        },
      },
    },
  },
  debug: false,
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      },
    },
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-UK', name: 'English', file: 'en.json' },
      { code: 'fi', language: 'fi-FI', name: 'Suomi', file: 'fi.json' },
    ],
    defaultLocale: 'en',
    pages: {
      home: {
        en: '/',
        fi: '/',
      },
    },
  },
  ogImage: {
    enabled: false,
  },
  umami: {
    id: 'e64eac9b-39ff-4e8c-a6f5-f2fcc63baf58',
    host: 'https://umami.anttila.io',
    autoTrack: true,
    ignoreLocalhost: true,
    excludeQueryParams: true,
    trailingSlash: 'never',
  },
});

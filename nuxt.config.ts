// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || "https://example.com",
    name: "Kevin Guo's Blog",
    description: "Notes on technology, learning and software development",
    defaultLocale: "en",
  },

  devtools: {
    enabled: true,
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/content",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "nuxt-og-image",
  ],

  css: ["~/assets/css/main.css"],

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://example.com",
    defaultLocale: "en",
    strategy: "prefix_except_default",

    locales: [
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en-US.json",
      },
      {
        code: "zh",
        language: "zh-CN",
        name: "简体中文",
        file: "zh-CN.json",
      },
    ],

    detectBrowserLanguage: false,
  },
});

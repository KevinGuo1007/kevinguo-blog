// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

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
});

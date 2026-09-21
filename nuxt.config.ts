// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  site: {
    url: "https://kevinguo.ink",
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

  icon: {
    clientBundle: {
      icons: [
        "lucide:chevron-up",
        "lucide:list",
        "lucide:tag",
        "simple-icons:github",
        "simple-icons:x",
        "simple-icons:youtube",
        "simple-icons:linkedin",
        "simple-icons:bilibili",
        "simple-icons:tiktok",
        "simple-icons:swift",
      ],
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            "bash",
            "css",
            "html",
            "js",
            "jsx",
            "json",
            "md",
            "mdc",
            "swift",
            "ts",
            "tsx",
            "vue",
            "yaml",
          ],
        },
      },
    },
  },

  // The site is deployed as static output, so OG images should be generated
  // during development/prerendering instead of relying on a server runtime.
  ogImage: {
    zeroRuntime: true,
  },

  sitemap: {
    zeroRuntime: true,
  },

  i18n: {
    baseUrl: "https://kevinguo.ink",
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

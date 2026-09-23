// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          sizes: "32x32",
          href: "/favicon.ico",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

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
        "lucide:file-question",
        "lucide:house",
        "lucide:list",
        "lucide:newspaper",
        "lucide:tag",
        "lucide:triangle-alert",
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
        file: "en.json",
      },
      {
        code: "zh",
        language: "zh-CN",
        name: "简体中文",
        file: "zh.json",
      },
    ],

    detectBrowserLanguage: false,
  },
});

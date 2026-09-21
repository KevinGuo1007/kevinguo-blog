<script setup lang="ts">
const i18nHead = useLocaleHead({ seo: true });
const { isArticleRoute, targetLocale, targetPath } =
  await useLocaleSwitchTarget();
const { open: isSearchOpen } = useContentSearch();
const isSearchInitialized = ref(false);

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isSearchOpen.value = !isSearchOpen.value;
    },
  },
});

watch(
  isSearchOpen,
  (open) => {
    if (open) {
      isSearchInitialized.value = true;
    }
  },
  { immediate: true },
);

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir,
  },
  link: (i18nHead.value.link || []).filter((link) => {
    if (!isArticleRoute.value || targetPath.value || link.rel !== "alternate") {
      return true;
    }

    const unavailableHreflangs =
      targetLocale.value === "en"
        ? new Set(["x-default", "en", "en-US"])
        : new Set(["zh", "zh-CN"]);

    return !unavailableHreflangs.has(String(link.hreflang));
  }),
  meta: (i18nHead.value.meta || []).filter((meta) => {
    if (
      !isArticleRoute.value ||
      targetPath.value ||
      meta.property !== "og:locale:alternate"
    ) {
      return true;
    }

    const unavailableOgLocale =
      targetLocale.value === "en" ? "en_US" : "zh_CN";

    return meta.content !== unavailableOgLocale;
  }),
}));
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <LazyContentSearchModal v-if="isSearchInitialized" />
  </UApp>
</template>

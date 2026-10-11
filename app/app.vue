<script setup lang="ts">
import { en, zh_cn } from "@nuxt/ui/locale";

const { locale } = useI18n();
const uiLocale = computed(() => (locale.value === "zh" ? zh_cn : en));
const i18nHead = useLocaleHead({ seo: true });
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
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}));
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <LazyContentSearchModal v-if="isSearchInitialized" />
  </UApp>
</template>

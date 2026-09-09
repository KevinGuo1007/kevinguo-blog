<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

type SupportedLocale = "en" | "zh";

const { locale, setLocale, t } = useI18n();
const colorMode = useColorMode();
const { open: isSearchOpen } = useContentSearch();
const isMenuReady = ref(false);
const isMenuOpen = ref(false);

const targetLocale = computed<SupportedLocale>(() =>
  locale.value === "en" ? "zh" : "en",
);
const isDark = computed(() => colorMode.value === "dark");

function openMenu() {
  isMenuReady.value = true;
  isMenuOpen.value = true;
}

function openSearch() {
  isMenuOpen.value = false;
  nextTick(() => {
    isSearchOpen.value = true;
  });
}

async function switchLanguage() {
  isMenuOpen.value = false;
  await setLocale(targetLocale.value);
}

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: t("search.open"),
    icon: "i-lucide-search",
    onSelect: openSearch,
  },
  {
    label: t("language.switchTo", {
      language: t(`language.${targetLocale.value}`),
    }),
    icon: "i-lucide-languages",
    onSelect: switchLanguage,
  },
  {
    label: isDark.value ? t("theme.light") : t("theme.dark"),
    icon: isDark.value ? "i-lucide-sun" : "i-lucide-moon",
    onSelect: () => {
      colorMode.preference = isDark.value ? "light" : "dark";
    },
  },
]);
</script>

<template>
  <LazyUDropdownMenu
    v-if="isMenuReady"
    v-model:open="isMenuOpen"
    :items="items"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
      collisionPadding: 8,
    }"
    :ui="{ content: 'z-[60] min-w-48 rounded-xl' }"
  >
    <UButton
      icon="i-lucide-menu"
      color="neutral"
      variant="ghost"
      size="md"
      square
      class="rounded-full sm:hidden"
      :aria-label="isMenuOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
      :ui="{ leadingIcon: 'size-4' }"
    />
  </LazyUDropdownMenu>

  <UButton
    v-else
    icon="i-lucide-menu"
    color="neutral"
    variant="ghost"
    size="md"
    square
    class="rounded-full sm:hidden"
    :aria-label="$t('nav.openMenu')"
    :ui="{ leadingIcon: 'size-4' }"
    @click="openMenu"
  />
</template>

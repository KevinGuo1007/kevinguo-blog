<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const { open: isSearchOpen } = useContentSearch();
const { targetLabel, targetPath } = await useLocaleSwitchTarget();
const { isDark, startViewTransition } = useColorModeTransition();
const isMenuOpen = ref(false);

function openSearch() {
  isMenuOpen.value = false;
  nextTick(() => {
    isSearchOpen.value = true;
  });
}

async function switchLanguage() {
  isMenuOpen.value = false;

  if (targetPath.value) {
    await navigateTo(targetPath.value);
  }
}

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: t("search.open"),
    icon: "i-lucide-search",
    onSelect: openSearch,
  },
  ...(targetPath.value
    ? [
        {
          label: t("language.switchTo", {
            language: targetLabel.value,
          }),
          icon: "i-lucide-languages",
          onSelect: switchLanguage,
        },
      ]
    : []),
  {
    label: isDark.value ? t("theme.light") : t("theme.dark"),
    icon: isDark.value ? "i-lucide-sun" : "i-lucide-moon",
    onSelect: startViewTransition,
  },
]);
</script>

<template>
  <UDropdownMenu
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
  </UDropdownMenu>
</template>

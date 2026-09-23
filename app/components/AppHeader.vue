<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const localePath = useLocalePath();

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: t("nav.home"), to: localePath("/"), exact: true },
  { label: t("nav.project"), to: localePath("/projects") },
  { label: t("nav.blog"), to: localePath("/blog") },
  { label: t("nav.about"), to: localePath("/about") },
]);
</script>

<template>
  <header
    class="fixed top-2 left-1/2 z-50 w-[calc(100vw-1rem)] -translate-x-1/2 sm:top-4 sm:w-120"
  >
    <UNavigationMenu
      :items="navItems"
      :aria-label="$t('a11y.primaryNavigation')"
      color="neutral"
      variant="link"
      class="w-full rounded-full border border-default/70 bg-default/85 px-1.5 shadow-lg shadow-neutral-950/5 backdrop-blur-xl dark:shadow-black/25 sm:px-3"
      :ui="{
        root: '[&>div:first-child]:flex-1',
        list: 'w-full',
        item: 'flex-1',
        link: 'justify-center px-2 py-2 text-sm sm:px-2.5 sm:py-1.5',
        linkLabel: 'whitespace-nowrap',
      }"
    >
      <template #list-trailing>
        <div
          class="ml-1 flex shrink-0 items-center border-l border-default pl-1 sm:ml-2 sm:pl-2"
        >
          <MobileToolsMenu />

          <div class="hidden items-center sm:flex">
            <UContentSearchButton
              color="neutral"
              variant="ghost"
              size="sm"
              :label="$t('search.open')"
              class="rounded-full"
            />
            <LanguageSwitcher />
            <ColorModeButton />
          </div>
        </div>
      </template>
    </UNavigationMenu>
  </header>
</template>

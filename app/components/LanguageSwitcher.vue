<script setup lang="ts">
type SupportedLocale = "en" | "zh";

const { locale, t } = useI18n();
const targetLocale = computed<SupportedLocale>(() =>
  locale.value === "en" ? "zh" : "en",
);

const targetLabel = computed(() =>
  t(`language.${targetLocale.value}`),
);

const targetShortLabel = computed(() =>
  targetLocale.value === "zh" ? "中" : "EN",
);

const ariaLabel = computed(() =>
  t("language.switchTo", {
    language: targetLabel.value,
  }),
);
</script>

<template>
  <SwitchLocalePathLink
    :locale="targetLocale"
    :aria-label="ariaLabel"
    :hreflang="targetLocale"
    class="inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-default transition-colors hover:bg-elevated active:bg-elevated focus-visible:outline-3 focus-visible:outline-inverted/25"
  >
    {{ targetShortLabel }}
  </SwitchLocalePathLink>
</template>

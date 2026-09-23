<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
const i18nHead = useLocaleHead({ seo: false });

const statusCode = computed(() => props.error.statusCode || 500);
const isNotFound = computed(() => statusCode.value === 404);
const errorIcon = computed(() =>
  isNotFound.value ? "i-lucide-file-question" : "i-lucide-triangle-alert",
);
const displayError = computed(() => ({
  statusCode: statusCode.value,
  statusMessage: t(
    isNotFound.value ? "error.notFoundTitle" : "error.genericTitle",
  ),
  message: t(
    isNotFound.value ? "error.notFoundDescription" : "error.genericDescription",
  ),
}));

useHead(() => ({
  title: `${statusCode.value} — ${displayError.value.statusMessage} | ${t("site.name")}`,
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang || "en-US",
    dir: i18nHead.value.htmlAttrs?.dir || "ltr",
  },
  meta: [{ name: "robots", content: "noindex, nofollow" }],
}));

async function recover(path: string) {
  await clearError({ redirect: localePath(path) });
}
</script>

<template>
  <UApp>
    <AppDotBackground />

    <UContainer
      data-site-shell
      class="relative z-10 flex min-h-screen flex-col border-default bg-default sm:border-x"
      :ui="{ base: 'px-4 sm:px-6 lg:px-8' }"
    >
      <AppHeader />

      <UError
        :error="displayError"
        :icon="errorIcon"
        :clear="false"
        class="min-h-0 flex-1 px-4 py-24 sm:py-32"
      >
        <template #links>
          <UButton
            :label="t('error.backHome')"
            icon="i-lucide-house"
            size="lg"
            @click="recover('/')"
          />
          <UButton
            :label="t('error.browseBlog')"
            icon="i-lucide-newspaper"
            color="neutral"
            variant="outline"
            size="lg"
            @click="recover('/blog')"
          />
        </template>
      </UError>

      <AppFooter />
    </UContainer>
  </UApp>
</template>

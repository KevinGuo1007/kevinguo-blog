<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("site.name"),
  description: () => t("site.description"),
  ogTitle: () => t("site.name"),
  ogDescription: () => t("site.description"),
});
</script>

<template>
  <UContainer class="py-20">
    <div class="max-w-2xl">
      <p class="mb-3 text-sm font-medium text-primary">
        {{ $t("home.eyebrow") }}
      </p>

      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Kevin Guo</h1>

      <p class="mt-6 text-lg text-muted">
        {{ $t("home.description") }}
      </p>
    </div>
  </UContainer>
</template>

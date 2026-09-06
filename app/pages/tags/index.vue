<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("tags.title"),
  description: () => t("tags.description"),
});
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold tracking-tight">
      {{ $t("tags.title") }}
    </h1>
    <p class="mt-4 text-muted">
      {{ $t("tags.empty") }}
    </p>
  </UContainer>
</template>

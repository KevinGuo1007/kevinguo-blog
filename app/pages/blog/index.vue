<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("blog.title"),
  description: () => t("blog.description"),
});
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold tracking-tight">
      {{ $t("blog.title") }}
    </h1>
    <p class="mt-4 text-muted">
      {{ $t("blog.empty") }}
    </p>
  </UContainer>
</template>

<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("about.title"),
  description: () => t("about.description"),
});
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-bold tracking-tight">
        {{ $t("about.title") }}
      </h1>
      <p class="mt-4 text-muted">
        {{ $t("about.description") }}
      </p>
    </div>
  </UContainer>
</template>

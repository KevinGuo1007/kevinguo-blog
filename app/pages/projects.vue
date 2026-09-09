<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("projects.title"),
  description: () => t("projects.description"),
});
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="max-w-3xl">
      <h1 class="text-3xl font-bold tracking-tight">
        {{ $t("projects.title") }}
      </h1>
      <p class="mt-4 text-muted">
        {{ $t("projects.description") }}
      </p>
    </div>
  </section>
</template>

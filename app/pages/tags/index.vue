<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("tags.title"),
  description: () => t("tags.description"),
});
</script>

<template>
  <section class="py-12 sm:py-16">
    <h1
      data-animate
      class="text-3xl font-bold tracking-tight"
      style="--stagger: 1"
    >
      {{ $t("tags.title") }}
    </h1>
    <p data-animate class="mt-4 text-muted" style="--stagger: 2">
      {{ $t("tags.empty") }}
    </p>
  </section>
</template>

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
      <h1
        data-animate
        class="text-3xl font-bold tracking-tight"
        style="--stagger: 1"
      >
        {{ $t("projects.title") }}
      </h1>
      <p data-animate class="mt-4 text-muted" style="--stagger: 2">
        {{ $t("projects.description") }}
      </p>
    </div>
  </section>
</template>

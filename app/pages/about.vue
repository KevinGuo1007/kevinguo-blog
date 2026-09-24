<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("about.title"),
  description: () => t("about.description"),
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
        {{ $t("about.title") }}
      </h1>
      <p
        data-animate
        class="mt-4 text-muted"
        style="--stagger: 2"
      >
        {{ $t("about.description") }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale, t } = useI18n();
const localePath = useLocalePath();
const { collection } = useBlogCollection();
const blogListKey = computed(() => `blog-list-${locale.value}`);

const { data: articles } = await useAsyncData(
  blogListKey,
  () =>
    queryCollection(collection.value)
      .where("draft", "=", false)
      .order("date", "DESC")
      .all(),
);

function formatDate(date: string) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

useSeoMeta({
  title: () => t("blog.title"),
  description: () => t("blog.description"),
});
</script>

<template>
  <section class="py-12 sm:py-16">
    <h1 class="text-3xl font-bold tracking-tight">
      {{ $t("blog.title") }}
    </h1>

    <div v-if="articles?.length" class="mt-10 divide-y divide-default">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="localePath(`/blog/${article.slug}`)"
        class="group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:gap-8"
      >
        <div>
          <h2 class="text-lg font-medium text-highlighted transition-opacity group-hover:opacity-60">
            {{ article.title }}
          </h2>
          <p class="mt-2 max-w-2xl text-sm text-muted">
            {{ article.description }}
          </p>
        </div>
        <time :datetime="article.date" class="text-sm text-muted">
          {{ formatDate(article.date) }}
        </time>
      </NuxtLink>
    </div>

    <p v-else class="mt-4 text-muted">
      {{ $t("blog.empty") }}
    </p>
  </section>
</template>

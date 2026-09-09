<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const { collection } = useBlogCollection();

const slug = computed(() => String(route.params.slug));

const { data: article } = await useAsyncData(
  () => `blog-${locale.value}-${slug.value}`,
  () =>
    queryCollection(collection.value)
      .where("slug", "=", slug.value)
      .where("draft", "=", false)
      .first(),
  { watch: [collection, slug] },
);

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
  });
}

useSeoMeta({
  title: () => article.value?.title,
  description: () => article.value?.description,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.description,
  ogImage: () => article.value?.image,
});

const formattedDate = computed(() =>
  article.value
    ? new Intl.DateTimeFormat(locale.value, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(article.value.date))
    : "",
);
</script>

<template>
  <article v-if="article" class="mx-auto max-w-3xl py-12 sm:py-16">
    <UButton
      :to="localePath('/blog')"
      :label="$t('blog.back')"
      color="neutral"
      variant="ghost"
      size="sm"
      class="-ml-2"
    >
      <template #leading>
        <span aria-hidden="true">←</span>
      </template>
    </UButton>

    <header class="mt-8 border-b border-default pb-8">
      <p class="text-sm text-muted">
        {{ formattedDate }}
      </p>
      <h1 class="mt-3 text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl">
        {{ article.title }}
      </h1>
      <p class="mt-5 text-lg text-muted">
        {{ article.description }}
      </p>
    </header>

    <UPageBody class="prose prose-neutral dark:prose-invert max-w-none">
      <ContentRenderer :value="article" />
    </UPageBody>
  </article>
</template>

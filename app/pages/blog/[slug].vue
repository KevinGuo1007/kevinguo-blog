<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

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

const { data: articleSurround } = await useAsyncData(
  () => `blog-surround-${locale.value}-${slug.value}`,
  () =>
    queryCollectionItemSurroundings(collection.value, article.value!.path, {
      fields: ["description", "slug"],
    })
      .where("draft", "=", false)
      .order("date", "ASC"),
  { watch: [collection, slug] },
);

const surround = computed(
  () =>
    // UContentSurround uses null entries to keep first/last post cards aligned,
    // although its public prop type currently omits those placeholders.
    (articleSurround.value ?? []).map((item) =>
      item
        ? {
            ...item,
            path: localePath(`/blog/${item.slug}`),
          }
        : null,
    ) as ContentNavigationItem[],
);

const tocLinks = computed(() => article.value?.body?.toc?.links ?? []);
const isTocOpen = ref(false);

function closeToc() {
  isTocOpen.value = false;
}

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}
</script>

<template>
  <UPage
    v-if="article"
    as="article"
    class="py-12 sm:py-16"
    :ui="{
      root: 'lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-8',
      center: 'min-w-0 lg:col-span-1',
      right: 'min-w-0 lg:col-span-1',
    }"
  >
    <div>
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
        <h1
          class="mt-3 text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl"
        >
          {{ article.title }}
        </h1>
        <p class="mt-5 text-lg text-muted">
          {{ article.description }}
        </p>
        <ul
          v-if="article.tags?.length"
          class="mt-5 flex flex-wrap gap-2"
          aria-label="Article tags"
        >
          <li v-for="tag in article.tags" :key="tag">
            <UBadge :label="tag" color="neutral" variant="subtle" size="md" />
          </li>
        </ul>
      </header>

      <UPageBody class="prose prose-neutral dark:prose-invert max-w-none">
        <ContentRenderer :value="article" />

        <UContentSurround :surround="surround" class="not-prose" />
      </UPageBody>
    </div>

    <template #right>
      <UContentToc
        :title="$t('blog.toc')"
        :links="tocLinks"
        highlight
        class="hidden lg:flex"
        :ui="{ linkText: 'whitespace-normal leading-5' }"
      />
    </template>

    <div
      class="fixed right-4 z-40 flex flex-col-reverse gap-3 sm:right-6 lg:right-8"
      style="bottom: calc(1rem + env(safe-area-inset-bottom))"
    >
      <UDrawer
        v-if="tocLinks.length"
        v-model:open="isTocOpen"
        class="lg:hidden"
        :title="$t('blog.toc')"
        :ui="{
          content: 'max-h-[min(75dvh,36rem)]',
          container: 'gap-3',
          body: 'min-h-0 overflow-y-auto',
        }"
      >
        <UButton
          icon="i-lucide-list"
          color="primary"
          variant="solid"
          size="xl"
          square
          class="rounded-full shadow-lg"
          :aria-label="$t('blog.openToc')"
        />

        <template #body>
          <UContentToc
            :links="tocLinks"
            highlight
            default-open
            :ui="{
              root: 'static max-h-none overflow-visible bg-transparent p-0 mx-0 backdrop-blur-none',
              container: 'border-0 p-0',
              trigger: 'hidden',
              content: 'max-h-none overflow-visible',
            }"
            @move="closeToc"
          />
        </template>
      </UDrawer>

      <UButton
        icon="i-lucide-chevron-up"
        color="neutral"
        variant="solid"
        size="xl"
        square
        class="rounded-full shadow-lg"
        :aria-label="$t('blog.backToTop')"
        @click="scrollToTop"
      />
    </div>
  </UPage>
</template>

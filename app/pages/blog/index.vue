<script setup lang="ts">
const { locale, t } = useI18n();
const localePath = useLocalePath();
const { collection } = useBlogCollection();
const blogListKey = computed(() => `blog-list-${locale.value}`);
const selectedTags = ref<string[]>([]);

const { data: articles } = await useAsyncData(blogListKey, () =>
  queryCollection(collection.value)
    .where("draft", "=", false)
    .order("date", "DESC")
    .all(),
);

const allTags = computed(() => {
  const tags = (articles.value ?? [])
    .flatMap((article) => article.tags ?? [])
    .filter((tag): tag is string => Boolean(tag));

  return [...new Set(tags)].sort((a, b) => a.localeCompare(b, locale.value));
});

const normalizedSelectedTags = computed(() =>
  selectedTags.value
    .map((tag) => tag.trim().toLocaleLowerCase(locale.value))
    .filter(Boolean),
);

const availableTags = computed(() => {
  const selected = new Set(normalizedSelectedTags.value);

  return allTags.value.filter(
    (tag) => !selected.has(tag.toLocaleLowerCase(locale.value)),
  );
});

const filteredArticles = computed(() => {
  const tags = normalizedSelectedTags.value;

  return [...(articles.value ?? [])]
    .filter((article) => {
      if (!tags.length) {
        return true;
      }

      const articleTags = new Set(
        (article.tags ?? []).map((tag) => tag.toLocaleLowerCase(locale.value)),
      );

      return tags.every((tag) => articleTags.has(tag));
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

function selectTag(tag: string) {
  const normalizedTag = tag.toLocaleLowerCase(locale.value);

  if (
    !selectedTags.value.some(
      (selectedTag) =>
        selectedTag.toLocaleLowerCase(locale.value) === normalizedTag,
    )
  ) {
    selectedTags.value = [...selectedTags.value, tag];
  }
}

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

    <div class="mt-8 max-w-2xl">
      <label
        for="blog-tag-filter"
        class="mb-2 block text-sm font-medium text-highlighted"
      >
        {{ $t("blog.filterLabel") }}
      </label>
      <UInputTags
        id="blog-tag-filter"
        v-model="selectedTags"
        icon="i-lucide-tag"
        size="md"
        variant="outline"
        :placeholder="$t('blog.filterPlaceholder')"
        class="w-full"
      />

      <div v-if="availableTags.length" class="mt-3 flex flex-wrap gap-2">
        <UButton
          v-for="tag in availableTags"
          :key="tag"
          :label="tag"
          color="neutral"
          variant="soft"
          size="xs"
          icon="i-lucide-plus"
          @click="selectTag(tag)"
        />
      </div>
    </div>

    <div v-if="filteredArticles.length" class="mt-10 space-y-6">
      <UBlogPost
        v-for="article in filteredArticles"
        :key="article.id"
        :to="localePath(`/blog/${article.slug}`)"
        :title="article.title"
        :description="article.description"
        :date="article.date"
        :image="article.image"
        variant="outline"
      >
        <template #date>
          {{ formatDate(article.date) }}
        </template>

        <template #description>
          <p>{{ article.description }}</p>

          <div v-if="article.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
            <UBadge
              v-for="tag in article.tags ?? []"
              :key="tag"
              :label="tag"
              color="neutral"
              variant="subtle"
              size="md"
            />
          </div>
        </template>
      </UBlogPost>
    </div>

    <p v-else class="mt-4 text-muted">
      {{ selectedTags.length ? $t("blog.noMatches") : $t("blog.empty") }}
    </p>
  </section>
</template>

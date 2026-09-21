<script setup lang="ts">
import Fuse from "fuse.js";

const { locale, t } = useI18n();
const localePath = useLocalePath();
const { collection } = useBlogCollection();
const { open: isSearchOpen } = useContentSearch();
const searchTerm = ref("");

const { data: searchData, status, execute } = useAsyncData(
  "content-search",
  async () => {
    const requestedLocale = locale.value;
    const sections = await queryCollectionSearchSections(collection.value, {
      extraFields: ["slug", "description", "tags"],
    }).where("draft", "=", false);

    const files = sections.map((section) => {
      const hashIndex = section.id.indexOf("#");
      const hash = hashIndex >= 0 ? section.id.slice(hashIndex) : "";
      const path = localePath(`/blog/${section.slug}`, requestedLocale);

      return {
        id: `${path}${hash}`,
        title: section.title,
        titles: section.titles,
        level: section.level,
        content: [section.description, section.tags?.join(" "), section.content]
          .filter(Boolean)
          .join(" · "),
      };
    });

    return { files, locale: requestedLocale };
  },
  {
    immediate: false,
    server: false,
  },
);

const isLoading = computed(
  () => status.value === "idle" || status.value === "pending",
);
const files = computed(() =>
  searchData.value?.locale === locale.value ? searchData.value.files : [],
);
const searchIndex = computed(
  () =>
    new Fuse(files.value, {
      keys: [
        { name: "title", weight: 2 },
        { name: "content", weight: 1 },
      ],
      threshold: 0.28,
      ignoreLocation: true,
    }),
);
const searchResults = computed(() => {
  const query = searchTerm.value.trim();

  if (!query || isLoading.value) {
    return [];
  }

  return searchIndex.value.search(query, { limit: 12 }).map(({ item }) => item);
});

async function loadSearchData() {
  if (searchData.value?.locale !== locale.value) {
    await execute();
  }
}

watch(
  isSearchOpen,
  (open) => {
    if (open) {
      void loadSearchData();
    } else {
      searchTerm.value = "";
    }
  },
  { immediate: true },
);
</script>

<template>
  <UModal v-model:open="isSearchOpen" :close="false">
    <template #content>
      <div class="overflow-hidden rounded-xl bg-default shadow-2xl">
        <div class="flex items-start gap-4 border-b border-default p-4">
          <div class="min-w-0 flex-1">
            <h2 class="font-medium text-highlighted">
              {{ t("search.title") }}
            </h2>
            <p class="mt-0.5 text-sm text-muted">
              {{ t("search.description") }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            square
            size="sm"
            :aria-label="t('search.close')"
            @click="isSearchOpen = false"
          >
            <svg
              aria-hidden="true"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </UButton>
        </div>

        <div class="p-4">
          <UInput
            v-model="searchTerm"
            autofocus
            size="xl"
            :placeholder="t('search.placeholder')"
            class="w-full"
          />
        </div>

        <div class="max-h-80 overflow-y-auto border-t border-default p-2">
          <p v-if="isLoading" class="px-3 py-8 text-center text-sm text-muted">
            {{ t("search.loading") }}
          </p>

          <template v-else>
            <NuxtLink
              v-for="result in searchResults"
              :key="result.id"
              :to="result.id"
              class="block rounded-lg px-3 py-2.5 hover:bg-muted"
              @click="isSearchOpen = false"
            >
              <p class="text-sm font-medium text-highlighted">
                {{ result.title }}
              </p>
              <p class="mt-0.5 line-clamp-2 text-xs text-muted">
                {{ result.content }}
              </p>
            </NuxtLink>
          </template>

          <p
            v-if="!isLoading && searchTerm && !searchResults.length"
            class="px-3 py-8 text-center text-sm text-muted"
          >
            {{ t("search.empty") }}
          </p>

          <p
            v-if="!isLoading && !searchTerm"
            class="px-3 py-8 text-center text-sm text-muted"
          >
            {{ t("search.hint") }}
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>

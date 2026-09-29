<script setup lang="ts">
import type { ButtonProps, ProgressGroupItem } from "@nuxt/ui";
import type { GitHubLanguageStats } from "~~/shared/types/github-language-stats";
import generatedGitHubLanguageStats from "~/generated/github-language-stats.json";

const { t } = useI18n();
const githubLanguageStats = generatedGitHubLanguageStats as GitHubLanguageStats;
const githubLanguageItems = computed<ProgressGroupItem[]>(() =>
  githubLanguageStats.items.map((item) => ({
    ...item,
    label: item.label === "Other" ? t("about.github.other") : item.label,
  })),
);

useSeoMeta({
  title: () => t("about.title"),
  description: () => t("about.description"),
});

defineProps<{
  prevIcon?: string;
  nextIcon?: string;
}>();

const items = [
  "/images/about/event-000.webp",
  "/images/about/event-001.webp",
  "/images/about/event-002.webp",
  "/images/about/event-003.webp",
];

const links = computed<ButtonProps[]>(() => [
  {
    label: t("about.blogLink"),
    to: "/blog",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
  },
]);

const contactLinks = computed<ButtonProps[]>(() => [
  {
    label: t("about.contact.email"),
    icon: "i-lucide-mail",
    to: "mailto:kevin1007028568@gmail.com",
    // target: "_blank",

    trailingIcon: "i-lucide-arrow-up-right",
  },
  {
    label: "LinkedIn",
    icon: "i-simple-icons-linkedin",
    to: "https://www.linkedin.com/in/越齐-郭-681796355/",
    target: "_blank",
    variant: "outline",
    trailingIcon: "i-lucide-arrow-up-right",
  },
]);

const carouselContainer = useTemplateRef<HTMLElement>("carouselContainer");
const isCarouselVisible = ref(false);
let carouselObserver: IntersectionObserver | undefined;

onMounted(() => {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    isCarouselVisible.value = true;
    return;
  }

  carouselObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;

      isCarouselVisible.value = true;
      carouselObserver?.disconnect();
    },
    { threshold: 0.15 },
  );

  if (carouselContainer.value) {
    carouselObserver.observe(carouselContainer.value);
  }
});

onBeforeUnmount(() => carouselObserver?.disconnect());
</script>

<template>
  <div>
    <UPageSection
      orientation="horizontal"
      reverse
      :links="links"
      class="min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)]"
      :ui="{
        container: 'pb-8 sm:pb-12 lg:pb-16',
      }"
    >
      <template #title>
        <span data-animate style="--stagger: 1">
          {{ t("about.heading") }}
        </span>
      </template>
      <template #description>
        <span data-animate style="--stagger: 3">
          {{ t("about.tagline") }}
        </span>
      </template>
      <template #body>
        <div
          data-animate
          class="mx-auto max-w-prose space-y-5 text-base leading-7 text-highlighted sm:leading-8"
          style="--stagger: 4"
        >
          <p>{{ t("about.introduction") }}</p>
          <p>{{ t("about.fullStackBackground") }}</p>
        </div>
      </template>
      <template #links>
        <div data-animate style="--stagger: 5">
          <UButton
            v-for="link in links"
            :key="String(link.to)"
            size="lg"
            v-bind="link"
          />
        </div>
      </template>
      <NuxtImg
        data-animate
        src="/images/profile/headshot.webp"
        width="512"
        height="640"
        sizes="240px sm:320px"
        format="webp"
        quality="80"
        alt="Kevin Guo"
        class="mx-auto w-full max-w-60 rounded-lg sm:max-w-xs"
        loading="eager"
        fetchpriority="high"
        style="--stagger: 1"
      />
    </UPageSection>

    <UPageSection
      reverse
      :ui="{
        container: 'pt-8 pb-8 sm:pt-8 sm:pb-8 lg:pt-8 lg:pb-8',
      }"
    >
      <div
        ref="carouselContainer"
        :data-animate="isCarouselVisible ? '' : undefined"
        :class="{ 'motion-safe:opacity-0': !isCarouselVisible }"
        style="--stagger: 1"
      >
        <UCarousel
          v-slot="{ item }"
          arrows
          dots
          :prev-icon="prevIcon"
          :next-icon="nextIcon"
          :items="items"
          :ui="{
            dots: '-bottom-8',
            dot: 'h-1 w-6 rounded-full',
          }"
          class="w-full max-w-xs mx-auto"
        >
          <NuxtImg
            :src="item"
            width="960"
            height="640"
            sizes="320px"
            format="webp"
            quality="80"
            alt=""
            class="aspect-3/2 w-full rounded-xl object-cover"
            loading="lazy"
          />
        </UCarousel>
      </div>
      <template #body>
        <div
          class="mx-auto max-w-prose space-y-5 text-base leading-7 text-highlighted sm:leading-8"
        >
          <p>{{ t("about.infrastructureJourney") }}</p>
        </div>
      </template>
    </UPageSection>

    <UPageSection
      :description="t('about.vision')"
      :ui="{
        container: 'pt-8 sm:pt-12 lg:pt-16',
      }"
    >
      <template #body>
        <div
          class="mx-auto max-w-prose space-y-5 text-base leading-7 text-highlighted sm:leading-8"
        >
          <p>{{ t("about.community") }}</p>
          <p>{{ t("about.outsideCode") }}</p>
        </div>
      </template>
    </UPageSection>

    <UPageSection
      :ui="{
        container: 'pt-8 sm:pt-12 lg:pt-16',
      }"
    >
      <template #body>
        <div class="mx-auto w-full max-w-5xl">
          <GitHubContributions class="mb-12" />

          <UProgressGroup
            v-if="githubLanguageItems.length"
            class="mx-auto w-full max-w-96"
            :items="githubLanguageItems"
            :max="githubLanguageStats.totalBytes"
          >
            <template #item-trailing="{ percent }">
              {{ percent.toFixed(1) }}%
            </template>
          </UProgressGroup>

          <p v-else class="text-sm text-muted">
            {{ t("about.github.unavailable") }}
          </p>
        </div>
      </template>
    </UPageSection>

    <UContainer class="pb-16 sm:pb-24 lg:pb-32">
      <UPageCTA
        :title="t('about.contact.title')"
        :description="t('about.contact.description')"
        variant="naked"
        :links="contactLinks"
        :ui="{
          container: 'px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14',
          description: 'mx-auto max-w-2xl',
        }"
      />
    </UContainer>
  </div>
</template>

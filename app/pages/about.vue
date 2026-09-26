<script setup lang="ts">
import type { ButtonProps, ProgressGroupItem } from "@nuxt/ui";
import type { GitHubLanguageStats } from "~~/shared/types/github-language-stats";
import generatedGitHubLanguageStats from "~/generated/github-language-stats.json";

const { t } = useI18n();
const githubLanguageStats = generatedGitHubLanguageStats as GitHubLanguageStats;
const githubLanguageItems: ProgressGroupItem[] = githubLanguageStats.items;

useSeoMeta({
  title: () => t("about.title"),
  description: () => t("about.description"),
});

defineProps<{
  prevIcon?: string;
  nextIcon?: string;
}>();

const items = [
  "/images/about/event-000.JPG",
  "/images/about/event-001.JPG",
  "/images/about/event-002.JPG",
  "/images/about/event-003.JPG",
];

const links = ref<ButtonProps[]>([
  {
    label: "Explore my blogs",
    to: "/blog",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
  },
]);

const contactLinks = [
  {
    label: "Email",
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
] satisfies ButtonProps[];
</script>

<template>
  <div>
    <UPageSection
      title="What about me? 🧐"
      description="From building products to building the infrastructure behind them."
      orientation="horizontal"
      reverse
      :links="links"
      :ui="{
        container: 'pb-8 sm:pb-12 lg:pb-16',
      }"
    >
      <template #body>
        <div
          class="mx-auto max-w-prose space-y-5 text-base leading-7 text-highlighted sm:leading-8"
        >
          <p>
            Hi, I'm Kevin Guo, a software engineer with a full-stack background
            who is now moving deeper into DevOps and AI infrastructure.
          </p>
          <p>
            I started with full-stack development because many of the projects I
            worked on required both frontend and backend ownership.
            Understanding both sides of a product helped me build systems more
            coherently and maintain consistency across architecture,
            functionality, and user experience.
          </p>
        </div>
      </template>
      <NuxtImg
        src="/images/profile/headshot.png"
        width="512"
        height="640"
        sizes="240px sm:320px"
        format="webp"
        quality="80"
        alt="Kevin Guo"
        class="mx-auto w-full max-w-60 rounded-lg sm:max-w-xs"
        loading="lazy"
      />
    </UPageSection>

    <UPageSection
      reverse
      :ui="{
        container: 'pt-8 pb-8 sm:pt-8 sm:pb-8 lg:pt-8 lg:pb-8',
      }"
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
          sizes="100vw sm:640px lg:896px"
          format="webp"
          quality="80"
          alt=""
          class="aspect-3/2 w-full rounded-xl object-cover"
          loading="lazy"
        />
      </UCarousel>
      <template #body>
        <div
          class="mx-auto max-w-prose space-y-5 text-base leading-7 text-highlighted sm:leading-8"
        >
          <p>
            As I studied operating systems and began deploying my own projects,
            I realized that building an application is only the first step.
            Delivering it efficiently, operating it reliably, and scaling it
            sustainably are equally important. That realization gradually
            shifted my attention from applications themselves to the
            infrastructure that supports them. Today, I'm developing my
            knowledge of cloud infrastructure, CI/CD, developer productivity,
            containers, Kubernetes, deep learning, and GPU inference clusters
            while exploring practical paths into DevOps and AI infrastructure.
          </p>
        </div>
      </template>
    </UPageSection>

    <UPageSection
      description="As AI enables more people to become developers, I want to help build the “shovels” they rely on—the tools and infrastructure that allow software to be delivered efficiently, operated reliably, and scaled with confidence."
      :ui="{
        container: 'pt-8 sm:pt-12 lg:pt-16',
      }"
    >
      <template #body>
        <div
          class="mx-auto max-w-prose space-y-5 text-base leading-7 text-highlighted sm:leading-8"
        >
          <p>
            I also actively take part in technical events and open-source
            communities. For me, a community is not only a place to learn, but
            also a place to exchange ideas, test my understanding against real
            problems, and contribute alongside other developers.
          </p>
          <p>
            Outside of code, I enjoy exploring technology, photography, and
            reading. Each gives me a different way to examine problems, document
            the world, and stay curious.
          </p>
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
            GitHub language statistics are temporarily unavailable.
          </p>
        </div>
      </template>
    </UPageSection>

    <UContainer class="pb-16 sm:pb-24 lg:pb-32">
      <UPageCTA
        title="Get in touch 🔎"
        description="I'm currently open to DevOps Engineer and Infrastructure Engineer opportunities, as well as open-source collaboration and infrastructure-focused projects."
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

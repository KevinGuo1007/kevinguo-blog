<script setup lang="ts">
const socialLinks = [
  { label: "GitHub", icon: "i-simple-icons-github", to: "" },
  { label: "X", icon: "i-simple-icons-x", to: "" },
  { label: "YouTube", icon: "i-simple-icons-youtube", to: "" },
  { label: "LinkedIn", icon: "i-simple-icons-linkedin", to: "" },
  { label: "Bilibili", icon: "i-simple-icons-bilibili", to: "" },
  { label: "抖音", icon: "i-simple-icons-tiktok", to: "" },
];

const { t } = useI18n();

useSeoMeta({
  title: () => t("site.name"),
  description: () => t("site.description"),
  ogTitle: () => t("site.name"),
  ogDescription: () => t("site.description"),
});
</script>

<template>
  <UPageHero
    orientation="horizontal"
    reverse
    :ui="{
      container:
        'gap-10 px-0 py-16 sm:gap-12 sm:py-24 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16 lg:py-28',
      wrapper: 'max-w-4xl text-left lg:max-w-none',
      body: 'mt-9 sm:mt-11',
    }"
  >
    <template #header>
      <h1
        class="text-5xl font-bold tracking-tight text-highlighted sm:text-7xl lg:text-8xl"
      >
        Kevin Guo
      </h1>

      <p
        class="mt-6 font-mono text-xl font-medium tracking-tight text-accent sm:text-2xl"
      >
        {{ t("home.role") }}
      </p>

      <p class="mt-8 max-w-3xl text-lg/8 text-muted sm:text-xl/9">
        {{ t("home.introduction") }}
      </p>
    </template>

    <template #body>
      <nav
        class="flex flex-wrap items-center gap-3 sm:gap-4"
        :aria-label="t('home.socialLinksLabel')"
      >
        <UTooltip
          v-for="social in socialLinks"
          :key="social.label"
          :text="social.label"
        >
          <a
            v-if="social.to"
            :href="social.to"
            target="_blank"
            rel="noopener noreferrer"
            class="flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            :aria-label="social.label"
          >
            <UIcon :name="social.icon" class="size-6" />
          </a>

          <span
            v-else
            class="flex size-10 items-center justify-center rounded-full text-muted"
            aria-disabled="true"
          >
            <UIcon :name="social.icon" class="size-6" />
            <span class="sr-only">{{ social.label }}</span>
          </span>
        </UTooltip>
      </nav>
    </template>

    <NuxtImg
      src="/images/profile/avatar-512x512.png"
      alt="Kevin Guo"
      width="512"
      height="512"
      sizes="160px sm:192px lg:224px"
      loading="eager"
      fetchpriority="high"
      class="mx-auto aspect-square w-full max-w-40 rounded-full object-cover shadow-xl shadow-neutral-950/10 ring-1 ring-default sm:max-w-48 lg:max-w-56 dark:shadow-black/30"
    />
  </UPageHero>
</template>

<script setup lang="ts">
const socialLinks = [
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    to: "https://github.com/KevinGuo1007",
  },
  {
    label: "X",
    icon: "i-simple-icons-x",
    to: "https://x.com/KevinGuo10070",
  },
  {
    label: "YouTube",
    icon: "i-simple-icons-youtube",
    to: "https://www.youtube.com/@郭越齐",
  },
  {
    label: "LinkedIn",
    icon: "i-simple-icons-linkedin",
    to: "https://www.linkedin.com/in/越齐-郭-681796355/",
  },
  {
    label: "Bilibili",
    icon: "i-simple-icons-bilibili",
    to: "https://space.bilibili.com/39395433?spm_id_from=333.1007.0.0",
  },
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
        data-animate
        class="text-5xl font-bold tracking-tight text-highlighted sm:text-7xl lg:text-8xl"
        style="--stagger: 1"
      >
        Kevin Guo
      </h1>

      <p
        data-animate
        class="mt-6 font-mono text-xl font-medium tracking-tight text-accent sm:text-2xl"
        style="--stagger: 2"
      >
        {{ t("home.role") }}
      </p>

      <p
        data-animate
        class="mt-8 max-w-3xl text-lg/8 text-muted sm:text-xl/9"
        style="--stagger: 3"
      >
        {{ t("home.introduction") }}
      </p>
    </template>

    <template #body>
      <nav
        data-animate
        class="flex flex-wrap items-center gap-3 sm:gap-4"
        style="--stagger: 4"
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
      data-animate
      src="/images/profile/avatar-512x512.png"
      alt="Kevin Guo"
      width="512"
      height="512"
      sizes="160px sm:192px lg:224px"
      loading="eager"
      fetchpriority="high"
      class="mx-auto aspect-square w-full max-w-40 rounded-full object-cover shadow-xl shadow-neutral-950/10 ring-1 ring-default sm:max-w-48 lg:max-w-56 dark:shadow-black/30"
      style="--stagger: 2"
    />
  </UPageHero>
</template>

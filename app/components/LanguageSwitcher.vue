<script setup lang="ts">
const { ariaLabel, targetLocale, targetPath, targetShortLabel } =
  await useLocaleSwitchTarget();
</script>

<template>
  <NuxtLink
    v-if="targetPath"
    :to="targetPath"
    :aria-label="ariaLabel"
    :hreflang="targetLocale"
    class="inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-default transition-colors hover:bg-elevated active:bg-elevated focus-visible:outline-3 focus-visible:outline-inverted/25"
  >
    {{ targetShortLabel }}
  </NuxtLink>
</template>

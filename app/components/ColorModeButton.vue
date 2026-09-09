<script setup lang="ts">
const colorMode = useColorMode();
const { t } = useI18n();

const isDark = computed(() => colorMode.value === "dark");

function toggleColorMode() {
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<template>
  <ClientOnly>
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      square
      class="rounded-full"
      :aria-label="isDark ? t('theme.light') : t('theme.dark')"
      @click="toggleColorMode"
    >
      <UIcon
        :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
        class="size-4"
      />
    </UButton>

    <template #fallback>
      <span class="block size-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

function toggleColorMode() {
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    size="sm"
    square
    class="rounded-full"
    :aria-label="$t('theme.toggle')"
    @click="toggleColorMode"
  >
    <UIcon name="i-lucide-sun" class="hidden size-4 dark:block" />
    <UIcon name="i-lucide-moon" class="size-4 dark:hidden" />
  </UButton>
</template>

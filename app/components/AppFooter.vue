<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <UFooter
    class="border-t border-default bg-default"
    :ui="{
      container: 'px-0 py-6 sm:px-0 lg:px-0',
      left: 'text-xs text-muted',
      right: 'text-xs text-muted',
    }"
  >
    <template #left>
      <p>
        &copy; {{ currentYear }} {{ $t("site.name") }}.
        {{ $t("footer.rights") }}
      </p>
    </template>
  </UFooter>
</template>

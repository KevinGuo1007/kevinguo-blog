<template>
  <UContainer
    class="flex min-h-screen flex-col border-default sm:border-x"
    :ui="{ base: 'px-4 sm:px-6 lg:px-8' }"
  >
    <AppHeader />

    <UMain id="main-content" class="relative flex-1 pt-16 sm:pt-20">
      <slot />
    </UMain>

    <AppFooter />
  </UContainer>
</template>

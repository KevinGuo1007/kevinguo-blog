<template>
  <div class="relative min-h-screen">
    <AppDotBackground />

    <UContainer
      data-site-shell
      class="relative z-10 flex min-h-screen flex-col border-default bg-default sm:border-x"
      :ui="{ base: 'px-4 sm:px-6 lg:px-8' }"
    >
      <AppHeader />

      <UMain id="main-content" class="relative flex-1 pt-16 sm:pt-20">
        <slot />
      </UMain>

      <AppFooter />
    </UContainer>
  </div>
</template>

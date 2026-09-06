export function useBlogCollection() {
  const { locale } = useI18n();

  const collection = computed(() =>
    locale.value === "en" ? "blogEn" : "blogZh",
  );

  const contentLocale = computed(() =>
    locale.value === "en" ? "en-US" : "zh-CN",
  );

  return {
    collection,
    contentLocale,
  };
}

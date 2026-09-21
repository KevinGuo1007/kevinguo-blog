type SupportedLocale = "en" | "zh";

export async function useLocaleSwitchTarget() {
  const route = useRoute();
  const { locale, t } = useI18n();
  const localePath = useLocalePath();
  const switchLocalePath = useSwitchLocalePath();

  const targetLocale = computed<SupportedLocale>(() =>
    locale.value === "en" ? "zh" : "en",
  );
  const articleSlug = computed(() => {
    const slug = route.params.slug;

    return typeof slug === "string" ? slug : undefined;
  });
  const isArticleRoute = computed(() => articleSlug.value !== undefined);
  const sourceCollection = computed(() =>
    locale.value === "en" ? "blogEn" : "blogZh",
  );
  const targetCollection = computed(() =>
    targetLocale.value === "en" ? "blogEn" : "blogZh",
  );
  const translationKey = computed(
    () => `locale-switch-${locale.value}-${articleSlug.value ?? "static"}`,
  );

  const { data: translation } = await useAsyncData(
    translationKey,
    async () => {
      const sourceSlug = articleSlug.value;

      if (!sourceSlug) {
        return null;
      }

      const sourceArticle = await queryCollection(sourceCollection.value)
        .where("slug", "=", sourceSlug)
        .where("draft", "=", false)
        .first();

      if (!sourceArticle) {
        return { sourceSlug, targetSlug: null };
      }

      const targetArticle = await queryCollection(targetCollection.value)
        .where("translationKey", "=", sourceArticle.translationKey)
        .where("draft", "=", false)
        .first();

      return {
        sourceSlug,
        targetSlug: targetArticle?.slug ?? null,
      };
    },
  );

  const targetPath = computed(() => {
    if (!isArticleRoute.value) {
      return switchLocalePath(targetLocale.value);
    }

    const resolvedTranslation = translation.value;

    if (
      !resolvedTranslation ||
      resolvedTranslation.sourceSlug !== articleSlug.value ||
      !resolvedTranslation.targetSlug
    ) {
      return undefined;
    }

    return localePath(
      `/blog/${resolvedTranslation.targetSlug}`,
      targetLocale.value,
    );
  });
  const targetLabel = computed(() => t(`language.${targetLocale.value}`));
  const targetShortLabel = computed(() =>
    targetLocale.value === "zh" ? "中" : "EN",
  );
  const ariaLabel = computed(() =>
    t("language.switchTo", {
      language: targetLabel.value,
    }),
  );

  return {
    ariaLabel,
    isArticleRoute,
    targetLabel,
    targetLocale,
    targetPath,
    targetShortLabel,
  };
}

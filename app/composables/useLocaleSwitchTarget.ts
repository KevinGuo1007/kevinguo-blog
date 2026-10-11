type SupportedLocale = "en" | "zh";

export function useLocaleSwitchTarget() {
  const { locale, t } = useI18n();
  const switchLocalePath = useSwitchLocalePath();

  const targetLocale = computed<SupportedLocale>(() =>
    locale.value === "en" ? "zh" : "en",
  );
  const targetPath = computed(() => switchLocalePath(targetLocale.value));
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
    targetLabel,
    targetLocale,
    targetPath,
    targetShortLabel,
  };
}

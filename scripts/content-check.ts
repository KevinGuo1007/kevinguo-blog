import { access, readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { parse } from "yaml";

type Locale = "en-US" | "zh-CN";

interface ArticleFrontmatter {
  draft?: boolean;
  image?: string;
  slug?: string;
  tags?: string[];
  translationKey?: string;
}

interface Article extends ArticleFrontmatter {
  file: string;
  locale: Locale;
}

const projectRoot = process.cwd();
const contentRoot = join(projectRoot, "content");
const publicRoot = join(projectRoot, "public");
const locales: Locale[] = ["en-US", "zh-CN"];
// Existing editorial debt. New Chinese-only posts still fail validation; remove
// an entry as soon as its English source is added.
const knownMissingEnglishSources = new Set(["swift-swiftui-learning-notes"]);
const errors: string[] = [];
const warnings: string[] = [];

async function listMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);

      return entry.isDirectory()
        ? listMarkdownFiles(path)
        : Promise.resolve(entry.name.endsWith(".md") ? [path] : []);
    }),
  );

  return nestedFiles.flat();
}

async function readArticle(file: string, locale: Locale): Promise<Article | null> {
  const source = await readFile(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const displayPath = relative(projectRoot, file);

  if (!match?.[1]) {
    errors.push(`${displayPath}: missing YAML frontmatter`);
    return null;
  }

  try {
    return {
      ...(parse(match[1]) as ArticleFrontmatter),
      file: displayPath,
      locale,
    };
  } catch (error) {
    errors.push(
      `${displayPath}: invalid YAML (${error instanceof Error ? error.message : String(error)})`,
    );
    return null;
  }
}

function checkUnique(
  articles: Article[],
  field: "slug" | "translationKey",
) {
  const seen = new Map<string, string>();

  for (const article of articles) {
    const value = article[field];

    if (!value) {
      continue;
    }

    const previousFile = seen.get(value);

    if (previousFile) {
      errors.push(
        `${article.file}: duplicate ${field} "${value}" (already used by ${previousFile})`,
      );
    } else {
      seen.set(value, article.file);
    }
  }
}

function sameStringArray(left: string[] = [], right: string[] = []) {
  return [...left].sort().join("\0") === [...right].sort().join("\0");
}

async function checkImage(article: Article) {
  if (!article.image || /^(?:https?:)?\/\//.test(article.image)) {
    return;
  }

  if (!article.image.startsWith("/")) {
    errors.push(`${article.file}: image must be an absolute public path`);
    return;
  }

  const imageFile = resolve(publicRoot, `.${article.image}`);

  if (!imageFile.startsWith(`${publicRoot}/`)) {
    errors.push(`${article.file}: image path escapes the public directory`);
    return;
  }

  try {
    await access(imageFile);
  } catch {
    errors.push(`${article.file}: image does not exist at public${article.image}`);
  }
}

const articles = (
  await Promise.all(
    locales.map(async (locale) => {
      const files = await listMarkdownFiles(join(contentRoot, locale, "blog"));
      return Promise.all(files.map((file) => readArticle(file, locale)));
    }),
  )
).flat().filter((article): article is Article => article !== null);

for (const locale of locales) {
  const localizedArticles = articles.filter((article) => article.locale === locale);
  checkUnique(localizedArticles, "slug");
  checkUnique(localizedArticles, "translationKey");
}

await Promise.all(articles.map(checkImage));

const englishByTranslationKey = new Map(
  articles
    .filter((article) => article.locale === "en-US" && article.translationKey)
    .map((article) => [article.translationKey!, article]),
);
const chineseByTranslationKey = new Map(
  articles
    .filter((article) => article.locale === "zh-CN" && article.translationKey)
    .map((article) => [article.translationKey!, article]),
);

for (const article of articles) {
  if (!article.translationKey) {
    continue;
  }

  const counterpart =
    article.locale === "en-US"
      ? chineseByTranslationKey.get(article.translationKey)
      : englishByTranslationKey.get(article.translationKey);

  if (!counterpart) {
    const message = `${article.file}: no ${article.locale === "en-US" ? "Chinese" : "English"} counterpart for "${article.translationKey}"`;

    if (article.locale === "en-US") {
      // English is the source language and translations are optional.
      continue;
    }

    if (knownMissingEnglishSources.has(article.translationKey)) {
      warnings.push(`${message} (known editorial debt)`);
    } else {
      errors.push(message);
    }
    continue;
  }

  if (article.locale !== "en-US") {
    continue;
  }

  if (article.slug !== counterpart.slug) {
    errors.push(
      `${article.file} and ${counterpart.file}: translated articles must use the same slug`,
    );
  }

  if (!sameStringArray(article.tags, counterpart.tags)) {
    errors.push(
      `${article.file} and ${counterpart.file}: translated articles must use the same tag IDs`,
    );
  }

  if (article.image !== counterpart.image) {
    errors.push(
      `${article.file} and ${counterpart.file}: translated articles must use the same image`,
    );
  }
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

for (const error of errors) {
  console.error(`ERROR ${error}`);
}

if (errors.length) {
  console.error(`Content check failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log(
    `Content check passed for ${articles.length} article(s) with ${warnings.length} warning(s).`,
  );
}

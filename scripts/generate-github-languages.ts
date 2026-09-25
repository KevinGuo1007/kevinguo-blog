import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import * as simpleIcons from "simple-icons";
import { parse } from "yaml";

import type {
  GitHubLanguageStats,
  GitHubLanguageStatsItem,
} from "../shared/types/github-language-stats.ts";

interface GitHubRepository {
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  name: string;
}

interface LinguistLanguage {
  color?: string;
}

interface SimpleIcon {
  hex: string;
  slug: string;
  title: string;
}

type GitHubLanguages = Record<string, number>;
type LinguistLanguages = Record<string, LinguistLanguage>;

const projectRoot = process.cwd();
const outputFile = resolve(
  projectRoot,
  "app/generated/github-language-stats.json",
);
const githubApiVersion = "2026-03-10";
const githubUsername =
  process.env.NUXT_GITHUB_USERNAME?.trim() || "KevinGuo1007";
const githubToken = process.env.NUXT_GITHUB_TOKEN?.trim();
const isDevelopmentMode = process.argv.includes("--mode=dev");
const visibleLanguageCount = 5;
const fallbackColor = "#8b949e";
const fallbackIcon = "lucide:code-xml";
const otherIcon = "lucide:shapes";
const pageSize = 100;
const linguistLanguagesUrl =
  "https://raw.githubusercontent.com/github-linguist/linguist/master/lib/linguist/languages.yml";

// GitHub language names and Simple Icons brand names are not always identical.
// This table only resolves naming differences; it never controls which languages appear.
const languageIconAliases: Record<string, string> = {
  "C#": "sharp",
  "C++": "cplusplus",
  Dockerfile: "docker",
  HTML: "html5",
  Shell: "gnubash",
  TeX: "latex",
  Vue: "vuedotjs",
  XSLT: "xml",
};

const icons = Object.values(simpleIcons).filter(
  (icon): icon is SimpleIcon =>
    typeof icon === "object" &&
    icon !== null &&
    "title" in icon &&
    "slug" in icon &&
    "hex" in icon,
);
const iconsBySlug = new Map(icons.map((icon) => [icon.slug, icon]));
const iconsByNormalizedTitle = new Map(
  icons.map((icon) => [normalizeName(icon.title), icon]),
);

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveLanguageIcon(language: string) {
  const alias = languageIconAliases[language];

  if (alias) {
    return iconsBySlug.get(alias);
  }

  return (
    iconsBySlug.get(normalizeName(language)) ??
    iconsByNormalizedTitle.get(normalizeName(language))
  );
}

function createGitHubHeaders() {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "kevinguo-blog-build",
    "x-github-api-version": githubApiVersion,
  };

  if (githubToken && githubToken !== "github_pat_xxx") {
    headers.authorization = `Bearer ${githubToken}`;
  }

  return headers;
}

async function fetchJson<T>(url: URL | string, headers?: HeadersInit) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText} while requesting ${response.url}`,
    );
  }

  return response.json() as Promise<T>;
}

async function fetchRepositories(headers: HeadersInit) {
  const repositories: GitHubRepository[] = [];

  for (let page = 1; ; page += 1) {
    const url = new URL(
      `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos`,
    );
    url.search = new URLSearchParams({
      direction: "asc",
      page: String(page),
      per_page: String(pageSize),
      sort: "full_name",
      type: "owner",
    }).toString();

    const batch = await fetchJson<GitHubRepository[]>(url, headers);
    repositories.push(...batch);

    if (batch.length < pageSize) {
      break;
    }
  }

  return repositories.filter(
    (repository) =>
      !repository.fork && !repository.archived && !repository.disabled,
  );
}

async function fetchLanguageTotals(
  repositories: GitHubRepository[],
  headers: HeadersInit,
) {
  const totals: GitHubLanguages = {};

  // GitHub recommends serial requests instead of unlimited concurrency.
  for (const repository of repositories) {
    const languages = await fetchJson<GitHubLanguages>(
      `https://api.github.com/repos/${encodeURIComponent(githubUsername)}/${encodeURIComponent(repository.name)}/languages`,
      headers,
    );

    for (const [language, bytes] of Object.entries(languages)) {
      totals[language] = (totals[language] ?? 0) + bytes;
    }
  }

  return totals;
}

async function fetchLinguistLanguages(): Promise<LinguistLanguages> {
  try {
    const response = await fetch(linguistLanguagesUrl);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return parse(await response.text()) as LinguistLanguages;
  } catch (error) {
    console.warn(
      `WARN Could not load GitHub Linguist colors; Simple Icons colors will be used (${error instanceof Error ? error.message : String(error)}).`,
    );
    return {};
  }
}

function createLanguageItems(
  totals: GitHubLanguages,
  linguistLanguages: LinguistLanguages,
) {
  const totalBytes = Object.values(totals).reduce(
    (total, bytes) => total + bytes,
    0,
  );
  const sortedLanguages = Object.entries(totals).sort(
    ([leftLanguage, left], [rightLanguage, right]) =>
      right - left || leftLanguage.localeCompare(rightLanguage),
  );
  const visibleLanguages = sortedLanguages.slice(0, visibleLanguageCount);
  const otherBytes = sortedLanguages
    .slice(visibleLanguageCount)
    .reduce((total, [, value]) => total + value, 0);
  const items: GitHubLanguageStatsItem[] = visibleLanguages.map(
    ([language, value]) => {
      const percentage = totalBytes ? (value / totalBytes) * 100 : 0;
      const icon = resolveLanguageIcon(language);

      return {
        label: language,
        value,
        percentage: Number(percentage.toFixed(4)),
        icon: icon ? `simple-icons:${icon.slug}` : fallbackIcon,
        color:
          linguistLanguages[language]?.color ??
          (icon ? `#${icon.hex}` : fallbackColor),
      };
    },
  );

  if (otherBytes > 0) {
    items.push({
      label: "Other",
      value: otherBytes,
      percentage: totalBytes
        ? Number(((otherBytes / totalBytes) * 100).toFixed(4))
        : 0,
      icon: otherIcon,
      color: fallbackColor,
    });
  }

  return { items, totalBytes };
}

async function writeLanguageStats(result: GitHubLanguageStats) {
  await mkdir(dirname(outputFile), { recursive: true });

  try {
    const existing = JSON.parse(
      await readFile(outputFile, "utf8"),
    ) as GitHubLanguageStats;
    const existingData = { ...existing, updatedAt: "" };
    const nextData = { ...result, updatedAt: "" };

    if (JSON.stringify(existingData) === JSON.stringify(nextData)) {
      return false;
    }
  } catch {
    // A missing or invalid snapshot is replaced below.
  }

  await writeFile(outputFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return true;
}

async function generateLanguageStats() {
  const headers = createGitHubHeaders();
  const repositories = await fetchRepositories(headers);
  const [totals, linguistLanguages] = await Promise.all([
    fetchLanguageTotals(repositories, headers),
    fetchLinguistLanguages(),
  ]);
  const { items, totalBytes } = createLanguageItems(
    totals,
    linguistLanguages,
  );
  const result: GitHubLanguageStats = {
    username: githubUsername,
    repositoryCount: repositories.length,
    totalBytes,
    items,
    updatedAt: new Date().toISOString(),
  };

  const didWrite = await writeLanguageStats(result);

  console.log(
    `${didWrite ? "Generated" : "Verified unchanged"} GitHub language statistics for ${items.length} progress item(s) from ${repositories.length} repositories.`,
  );
}

try {
  await generateLanguageStats();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  if (isDevelopmentMode) {
    try {
      await access(outputFile);
      await readFile(outputFile, "utf8");
      console.warn(
        `WARN GitHub language refresh failed; using the existing generated snapshot (${message}).`,
      );
    } catch {
      console.error(
        `ERROR GitHub language refresh failed and no generated snapshot exists (${message}).`,
      );
      process.exitCode = 1;
    }
  } else {
    console.error(`ERROR GitHub language generation failed (${message}).`);
    process.exitCode = 1;
  }
}

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type {
  GitHubContributionDay,
  GitHubContributionLevel,
  GitHubContributions,
} from "../shared/types/github-contributions.ts";

interface GitHubGraphQLError {
  message: string;
}

interface GitHubGraphQLResponse<T> {
  data?: T;
  errors?: GitHubGraphQLError[];
}

interface ContributionCalendarResponse {
  viewer: {
    login: string;
    contributionsCollection: {
      restrictedContributionsCount: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            contributionLevel: GitHubContributionLevel;
            date: string;
          }>;
        }>;
      };
    };
  };
}

interface ContributionYearsResponse {
  viewer: {
    login: string;
    contributionsCollection: {
      contributionYears: number[];
    };
  };
}

const projectRoot = process.cwd();
const outputFile = resolve(
  projectRoot,
  "app/generated/github-contributions.json",
);
const githubGraphQLEndpoint = "https://api.github.com/graphql";
const githubUsername =
  process.env.NUXT_GITHUB_USERNAME?.trim() || "KevinGuo1007";
const githubToken = process.env.NUXT_GITHUB_TOKEN?.trim();
const isDevelopmentMode = process.argv.includes("--mode=dev");

const contributionYearsQuery = /* GraphQL */ `
  query ContributionYears {
    viewer {
      login
      contributionsCollection {
        contributionYears
      }
    }
  }
`;

const contributionCalendarQuery = /* GraphQL */ `
  query ContributionCalendar(
    $from: DateTime!
    $to: DateTime!
  ) {
    viewer {
      login
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
            }
          }
        }
      }
    }
  }
`;

async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, string>,
) {
  if (!githubToken || githubToken === "github_pat_xxx") {
    throw new Error("NUXT_GITHUB_TOKEN is required by the GitHub GraphQL API");
  }

  const response = await fetch(githubGraphQLEndpoint, {
    method: "POST",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${githubToken}`,
      "content-type": "application/json",
      "user-agent": "kevinguo-blog-build",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText} while requesting ${response.url}`,
    );
  }

  const result = (await response.json()) as GitHubGraphQLResponse<T>;

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }

  if (!result.data) {
    throw new Error("GitHub GraphQL returned no data");
  }

  return result.data;
}

function createYearRange(year: number, now: Date) {
  const from = new Date(Date.UTC(year, 0, 1));
  const endOfYear = new Date(Date.UTC(year + 1, 0, 1) - 1);
  const to = year === now.getUTCFullYear() ? now : endOfYear;

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

async function fetchContributionYears() {
  const result = await fetchGraphQL<ContributionYearsResponse>(
    contributionYearsQuery,
    {},
  );

  if (result.viewer.login.toLowerCase() !== githubUsername.toLowerCase()) {
    throw new Error(
      `NUXT_GITHUB_TOKEN belongs to ${result.viewer.login}, not ${githubUsername}`,
    );
  }

  const currentYear = new Date().getUTCFullYear();

  return [...new Set([currentYear, ...result.viewer.contributionsCollection.contributionYears])]
    .filter((year) => Number.isInteger(year) && year <= currentYear)
    .sort((left, right) => right - left);
}

async function fetchContributionYear(year: number, now: Date) {
  const range = createYearRange(year, now);
  const result = await fetchGraphQL<ContributionCalendarResponse>(
    contributionCalendarQuery,
    {
      ...range,
    },
  );

  if (result.viewer.login.toLowerCase() !== githubUsername.toLowerCase()) {
    throw new Error(
      `NUXT_GITHUB_TOKEN belongs to ${result.viewer.login}, not ${githubUsername}`,
    );
  }

  const calendar =
    result.viewer.contributionsCollection.contributionCalendar;
  const days: GitHubContributionDay[] = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => Number(day.date.slice(0, 4)) === year)
    .map((day) => ({
      contributionCount: day.contributionCount,
      date: day.date,
      level: day.contributionLevel,
    }));

  return {
    year,
    // GitHub folds public and shareable private contributions into the same
    // calendar days. Keep this count so the generated snapshot records when
    // anonymous private contributions were included.
    restrictedContributionsCount:
      result.viewer.contributionsCollection.restrictedContributionsCount,
    totalContributions: calendar.totalContributions,
    days,
  };
}

async function writeContributions(result: GitHubContributions) {
  await mkdir(dirname(outputFile), { recursive: true });

  try {
    const existing = JSON.parse(
      await readFile(outputFile, "utf8"),
    ) as GitHubContributions;
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

async function useExistingContributions() {
  let snapshot: unknown;

  try {
    snapshot = JSON.parse(await readFile(outputFile, "utf8"));
  } catch {
    throw new Error(
      "NUXT_GITHUB_TOKEN is required when no valid generated contributions snapshot exists",
    );
  }

  if (
    !snapshot ||
    typeof snapshot !== "object" ||
    !("username" in snapshot) ||
    typeof snapshot.username !== "string" ||
    snapshot.username.toLowerCase() !== githubUsername.toLowerCase() ||
    !("years" in snapshot) ||
    !Array.isArray(snapshot.years) ||
    snapshot.years.length === 0 ||
    snapshot.years.some(
      (year) => !Number.isInteger(year?.year) || !Array.isArray(year?.days),
    )
  ) {
    throw new Error(
      "NUXT_GITHUB_TOKEN is required when the generated contributions snapshot is invalid or belongs to another user",
    );
  }

  console.log(`Using existing GitHub contributions for ${snapshot.years.length} year(s).`);
}

async function generateContributions() {
  if (!githubToken || githubToken === "github_pat_xxx") {
    await useExistingContributions();
    return;
  }

  const now = new Date();
  const contributionYears = await fetchContributionYears();
  const years = [];

  // Keep requests serial to avoid GitHub secondary rate limits.
  for (const year of contributionYears) {
    years.push(await fetchContributionYear(year, now));
  }

  const result: GitHubContributions = {
    username: githubUsername,
    years,
    updatedAt: now.toISOString(),
  };
  const didWrite = await writeContributions(result);

  console.log(
    `${didWrite ? "Generated" : "Verified unchanged"} GitHub contributions for ${years.length} year(s), including ${years.reduce((total, year) => total + year.restrictedContributionsCount, 0)} restricted contribution(s).`,
  );
}

try {
  await generateContributions();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  if (isDevelopmentMode) {
    try {
      await access(outputFile);
      await readFile(outputFile, "utf8");
      console.warn(
        `WARN GitHub contributions refresh failed; using the existing generated snapshot (${message}).`,
      );
    } catch {
      console.error(
        `ERROR GitHub contributions refresh failed and no generated snapshot exists (${message}).`,
      );
      process.exitCode = 1;
    }
  } else {
    console.error(`ERROR GitHub contributions generation failed (${message}).`);
    process.exitCode = 1;
  }
}

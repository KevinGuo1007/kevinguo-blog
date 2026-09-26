export type GitHubContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface GitHubContributionDay {
  contributionCount: number;
  date: string;
  level: GitHubContributionLevel;
}

export interface GitHubContributionYear {
  days: GitHubContributionDay[];
  restrictedContributionsCount: number;
  totalContributions: number;
  year: number;
}

export interface GitHubContributions {
  username: string;
  years: GitHubContributionYear[];
  updatedAt: string;
}

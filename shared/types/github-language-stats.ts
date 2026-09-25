export interface GitHubLanguageStatsItem {
  color: string;
  icon: string;
  label: string;
  percentage: number;
  value: number;
}

export interface GitHubLanguageStats {
  username: string;
  repositoryCount: number;
  totalBytes: number;
  items: GitHubLanguageStatsItem[];
  updatedAt: string;
}


/**
 * Social media tool types
 */

export interface SocialPostData {
  id: string;
  content: string;
  author: string;
  platform: string;
  date: string;
  likes?: number;
  shares?: number;
  comments?: number;
  sentiment?: number;
  url?: string;
}

export interface SocialSearchParams {
  query: string;
  platform?: string;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  sentiment?: boolean;
  includeImages?: boolean;
  includeReplies?: boolean;
  language?: string;
}

export interface SocialMediaAccount {
  username: string;
  platform: string;
  displayName?: string;
  bio?: string;
  followers?: number;
  following?: number;
  joinDate?: string;
  profileImage?: string;
  url?: string;
}

export interface UsernameSearchParams {
  username: string;
  platforms?: string[];
  timeout?: number;
  includeSummary?: boolean;
}

export interface TwintParams {
  username?: string;
  search?: string;
  limit?: number;
  since?: string;
  until?: string;
  format?: 'csv' | 'json';
}

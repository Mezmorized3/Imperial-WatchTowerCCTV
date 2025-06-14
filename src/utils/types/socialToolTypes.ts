
/**
 * Social media tool types
 */

export interface SocialSearchParams {
  username: string;
  platforms?: string[];
  timeout?: number;
  includeMetadata?: boolean;
  saveResults?: boolean;
}

export interface SocialPostData {
  id: string;
  platform: string;
  username: string;
  content: string;
  timestamp: string;
  likes?: number;
  shares?: number;
  comments?: number;
  url?: string;
  media?: {
    type: 'image' | 'video' | 'link';
    url: string;
  }[];
  metadata?: Record<string, any>;
}

export interface TwitterParams {
  username?: string;
  query?: string;
  search?: string;
  limit?: number;
  since?: string;
  until?: string;
  saveResults?: boolean;
}

export interface TwintParams {
  username?: string;
  search?: string;
  limit?: number;
  since?: string;
  until?: string;
  saveResults?: boolean;
}

export interface UsernameSearchParams {
  username: string;
  platforms?: string[];
  timeout?: number;
  includeMetadata?: boolean;
  saveResults?: boolean;
}

export interface InstagramParams {
  username: string;
  limit?: number;
  mediaType?: 'image' | 'video' | 'all';
  saveResults?: boolean;
}

export interface OsintParams {
  target: string;
  type?: 'username' | 'domain' | 'ip' | 'email' | 'general';
  modules?: string[];
  depth?: number;
  timeout?: number;
}

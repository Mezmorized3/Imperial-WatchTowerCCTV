
/**
 * Implementation of social media OSINT tools
 */

import { ScanResult } from '../types/baseTypes';
import { SocialSearchParams, SocialPostData } from '../types/socialToolTypes';
import { simulateNetworkDelay } from '../networkUtils';

const mockUsers = [
  {
    username: 'johndoe',
    platforms: {
      twitter: { found: true, followers: 1243, following: 567, posts: 234, joinDate: '2015-04-12' },
      instagram: { found: true, followers: 872, following: 433, posts: 121, bio: 'Travel photographer and coffee lover' },
      facebook: { found: true, url: 'facebook.com/johndoe' },
      linkedin: { found: true, title: 'Software Engineer at Tech Corp', location: 'San Francisco, CA' },
      github: { found: true, repos: 23, gists: 7, joined: '2013-09-22' }
    }
  },
  {
    username: 'janedoe',
    platforms: {
      twitter: { found: true, followers: 3456, following: 876, posts: 987, joinDate: '2012-06-23' },
      instagram: { found: true, followers: 5432, following: 654, posts: 432, bio: 'Digital marketer, dog mom, and coffee addict' },
      facebook: { found: false },
      linkedin: { found: true, title: 'Marketing Director at Brand Inc', location: 'New York, NY' },
      github: { found: false }
    }
  },
  {
    username: 'techguru',
    platforms: {
      twitter: { found: true, followers: 12765, following: 342, posts: 4532, joinDate: '2010-11-14' },
      instagram: { found: true, followers: 3421, following: 243, posts: 176, bio: 'Tech reviewer and gadget enthusiast' },
      facebook: { found: true, url: 'facebook.com/techguru' },
      linkedin: { found: true, title: 'Tech Journalist', location: 'Seattle, WA' },
      github: { found: true, repos: 67, gists: 23, joined: '2011-03-12' }
    }
  }
];

/**
 * Search for a username across multiple social media platforms
 */
export const executeUsernameSearch = async (params: SocialSearchParams): Promise<ScanResult> => {
  console.log('Executing username search with params:', params);
  await simulateNetworkDelay(800, 2000);
  
  const { username, platforms = ['twitter', 'instagram', 'facebook', 'linkedin', 'github'] } = params;
  
  // Mock the search by checking our predefined users or randomizing
  let userData;
  const existingUser = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (existingUser) {
    userData = existingUser;
  } else {
    // Generate random results
    const foundPlatforms: Record<string, any> = {};
    
    platforms.forEach(platform => {
      const isFound = Math.random() > 0.3; // 70% chance to be found
      
      if (isFound) {
        switch (platform) {
          case 'twitter':
            foundPlatforms[platform] = {
              found: true,
              followers: Math.floor(Math.random() * 10000),
              following: Math.floor(Math.random() * 2000),
              posts: Math.floor(Math.random() * 5000),
              joinDate: `201${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
            };
            break;
          case 'instagram':
            foundPlatforms[platform] = {
              found: true,
              followers: Math.floor(Math.random() * 20000),
              following: Math.floor(Math.random() * 1000),
              posts: Math.floor(Math.random() * 500),
              bio: 'This is a randomly generated bio for demonstration purposes'
            };
            break;
          case 'facebook':
            foundPlatforms[platform] = {
              found: true,
              url: `facebook.com/${username}`
            };
            break;
          case 'linkedin':
            foundPlatforms[platform] = {
              found: true,
              title: `Professional at ${['Tech Corp', 'Marketing Inc', 'Design Co', 'Research Lab'][Math.floor(Math.random() * 4)]}`,
              location: `${['New York', 'Los Angeles', 'Chicago', 'San Francisco'][Math.floor(Math.random() * 4)]}, ${['NY', 'CA', 'IL', 'CA'][Math.floor(Math.random() * 4)]}`
            };
            break;
          case 'github':
            foundPlatforms[platform] = {
              found: true,
              repos: Math.floor(Math.random() * 50),
              gists: Math.floor(Math.random() * 20),
              joined: `201${Math.floor(Math.random() * 9)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
            };
            break;
          default:
            foundPlatforms[platform] = { found: true };
        }
      } else {
        foundPlatforms[platform] = { found: false };
      }
    });
    
    userData = {
      username,
      platforms: foundPlatforms
    };
  }
  
  // Format results
  const results = platforms.map(platform => {
    const platformData = userData.platforms[platform] || { found: false };
    
    return {
      platform,
      username: userData.username,
      accountFound: platformData.found,
      url: platformData.found ? `https://${platform}.com/${userData.username}` : '',
      followers: platformData.followers,
      following: platformData.following,
      posts: platformData.posts,
      profileName: userData.username,
      bio: platformData.bio,
      lastUpdated: new Date().toISOString()
    };
  });
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: platforms.length,
    found: results.filter(r => r.accountFound).length,
    data: { results, username: userData.username },
    results,
    simulatedData: true
  };
};

/**
 * Execute Twitter OSINT tool (Twint alternative)
 */
export const executeTwint = async (params: any): Promise<ScanResult> => {
  console.log('Executing Twint with params:', params);
  await simulateNetworkDelay(1000, 3000);
  
  const { username, query, limit = 10 } = params;
  
  // Generate mock Twitter posts
  const mockPosts: SocialPostData[] = [];
  const postCount = Math.min(Math.floor(Math.random() * 15) + 5, limit);
  
  for (let i = 0; i < postCount; i++) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    
    mockPosts.push({
      id: `tw-${Date.now()}-${i}`,
      platform: 'twitter',
      username: username || 'random_user',
      content: `This is a mock Twitter post #${i + 1} ${query ? 'containing ' + query : ''} for demonstration purposes.`,
      timestamp: createdAt.toISOString(),
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 30),
      comments: Math.floor(Math.random() * 20),
      url: `https://twitter.com/user/status/${Date.now()}${i}`,
      media: Math.random() > 0.5 ? [{
        type: Math.random() > 0.7 ? 'video' : 'image',
        url: `https://example.com/media/${Date.now()}${i}.jpg`
      }] : undefined
    });
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: postCount,
    found: postCount,
    data: { posts: mockPosts, query, username },
    results: mockPosts,
    simulatedData: true
  };
};

/**
 * Generic OSINT tool implementation
 */
export const executeOSINT = async (params: any): Promise<ScanResult> => {
  console.log('Executing OSINT with params:', params);
  await simulateNetworkDelay(1200, 2500);
  
  const { target, type = 'generic' } = params;
  
  // Generate mock OSINT results
  const mockResults = [];
  const resultCount = Math.floor(Math.random() * 10) + 3;
  
  for (let i = 0; i < resultCount; i++) {
    mockResults.push({
      id: `osint-${Date.now()}-${i}`,
      type,
      source: `Source ${i + 1}`,
      content: `OSINT result for ${target}: ${Math.random().toString(36).substring(2, 15)}`,
      timestamp: new Date().toISOString(),
      metadata: {
        confidence: Math.floor(Math.random() * 100),
        relevance: Math.floor(Math.random() * 100),
        category: ['social', 'web', 'network', 'document'][Math.floor(Math.random() * 4)]
      }
    });
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: resultCount,
    found: resultCount,
    data: { results: mockResults, target, type },
    results: mockResults,
    simulatedData: true
  };
};

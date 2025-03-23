
/**
 * Utility functions for video processing and handling
 */

/**
 * Extract YouTube video ID from URL
 */
export const extractYouTubeId = (url: string): string | null => {
  try {
    // Handle various YouTube URL formats
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  } catch (error) {
    console.error('Error extracting YouTube ID:', error);
    return null;
  }
};

/**
 * Sanitize and encode URLs with special characters and authentication
 */
export const sanitizeStreamUrl = (url: string): string => {
  try {
    // Parse the URL to handle special characters
    const parsed = new URL(url);
    
    // Preserve the authentication part
    let authPart = '';
    if (parsed.username || parsed.password) {
      authPart = `${encodeURIComponent(parsed.username)}:${encodeURIComponent(parsed.password)}@`;
      
      // Remove auth from the parsed URL
      parsed.username = '';
      parsed.password = '';
    }
    
    // Reconstruct the URL with proper encoding but preserving auth
    const protocol = parsed.protocol;
    const hostWithPort = parsed.host;
    const path = parsed.pathname;
    const query = parsed.search;
    const hash = parsed.hash;
    
    // Reconstruct URL with properly encoded components
    return `${protocol}//${authPart}${hostWithPort}${path}${query}${hash}`;
  } catch (error) {
    console.error('Error sanitizing stream URL:', error);
    // If URL parsing fails, return the original URL
    return url;
  }
};

/**
 * Format authentication headers for stream requests
 */
export const formatAuthHeaders = (url: string): Record<string, string> => {
  try {
    const parsed = new URL(url);
    if (parsed.username || parsed.password) {
      const authString = `${parsed.username}:${parsed.password}`;
      return {
        'Authorization': `Basic ${btoa(authString)}`
      };
    }
    return {};
  } catch (error) {
    console.error('Error formatting auth headers:', error);
    return {};
  }
};

/**
 * Check if stream requires CORS handling
 */
export const requiresCorsHandling = (url: string): boolean => {
  try {
    const currentOrigin = window.location.origin;
    const targetOrigin = new URL(url).origin;
    return currentOrigin !== targetOrigin;
  } catch (error) {
    console.error('Error checking CORS requirements:', error);
    return true; // Assume CORS is needed if there's an error
  }
};

/**
 * Add debug info to stream URL if debug mode is enabled
 */
export const addDebugInfo = (url: string, debugEnabled: boolean = false): string => {
  if (!debugEnabled) return url;
  
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.append('debug', '1');
    return parsedUrl.toString();
  } catch (error) {
    console.error('Error adding debug info to URL:', error);
    return url;
  }
};

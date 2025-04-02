
import { CameraResult } from '@/types/scanner';

// Execute a search query against real search engines
export const executeSearch = async ({ 
  query, 
  limit = 10 
}: { 
  query: string; 
  limit?: number;
}): Promise<{ cameras: CameraResult[] }> => {
  console.log(`Executing search with query: ${query}, limit: ${limit}`);
  
  try {
    // Construct API endpoint with query parameters
    const endpoint = `/api/search?query=${encodeURIComponent(query)}&limit=${limit}`;
    
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      cameras: data.results.map((result: any) => ({
        id: result.id || result.ip,
        ip: result.ip,
        port: result.port || 80,
        brand: result.brand || result.vendor || result.manufacturer,
        model: result.model || result.device_type || 'Unknown',
        status: result.status || 'online',
        accessLevel: result.access_level || 'none',
        location: result.location || {
          country: result.country,
          city: result.city,
          latitude: result.latitude,
          longitude: result.longitude
        },
        lastSeen: result.last_seen || new Date().toISOString(),
        firstSeen: result.first_seen || new Date().toISOString(),
        firmwareVersion: result.firmware_version || result.version,
        vulnerabilities: result.vulnerabilities || [],
        responseTime: result.response_time,
        url: result.url || `rtsp://${result.ip}:${result.port || 554}/stream`
      }))
    };
  } catch (error) {
    console.error('Search error:', error);
    return { cameras: [] };
  }
};

// Find Eastern European cameras with real API calls
export const findEasternEuropeanCameras = async (
  mode: string,
  options: {
    country?: string;
    onlyVulnerable?: boolean;
    limit?: number;
  }
): Promise<{ cameras: CameraResult[] }> => {
  console.log(`Finding Eastern European cameras with mode: ${mode}, options:`, options);
  
  // Create search query with Eastern European countries
  const countries = options.country ? 
    [options.country] : 
    ['ro', 'ua', 'ge', 'by', 'bg', 'hu', 'md', 'pl', 'sk'];
  
  const countryQuery = countries.map(c => `country:${c}`).join(' OR ');
  const vulnerableFilter = options.onlyVulnerable ? 'vulnerable:true' : '';
  
  const query = `(${countryQuery}) ${vulnerableFilter} type:camera`;
  
  // Use the executeSearch function
  return executeSearch({
    query,
    limit: options.limit || 15
  });
};

// Execute camera search with specific search engine
export const executeCameraSearch = async (
  options: {
    country?: string;
    onlyVulnerable?: boolean;
    limit?: number;
  },
  searchEngine: 'shodan' | 'zoomeye' | 'censys'
): Promise<{ cameras: CameraResult[] }> => {
  console.log(`Executing camera search with engine: ${searchEngine}, options:`, options);
  
  // Create search query with engine-specific format
  const countryFilter = options.country ? `country:${options.country}` : '';
  const vulnerableFilter = options.onlyVulnerable ? 'vulnerable:true' : '';
  
  let query = `type:camera engine:${searchEngine}`;
  
  if (countryFilter) {
    query += ` ${countryFilter}`;
  }
  
  if (vulnerableFilter) {
    query += ` ${vulnerableFilter}`;
  }
  
  // Add search engine specific parameters
  switch (searchEngine) {
    case 'shodan':
      query += ' product:webcam OR product:camera OR product:ipcam';
      break;
    case 'zoomeye':
      query += ' +app:"webcam" +app:"rtsp"';
      break;
    case 'censys':
      query += ' services.service_name=rtsp OR services.service_name=http';
      break;
  }
  
  // Use the executeSearch function with the appropriate engine endpoint
  try {
    const endpoint = `/api/search/${searchEngine}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        limit: options.limit || 20,
        filters: {
          country: options.country,
          onlyVulnerable: options.onlyVulnerable
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`${searchEngine} search failed: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      cameras: data.results.map((result: any) => ({
        id: result.id || result.ip,
        ip: result.ip,
        port: result.port || 80,
        brand: result.brand || result.vendor || 'Unknown',
        model: result.model || 'Unknown',
        status: result.status || 'online',
        accessLevel: result.access_level || 'none',
        location: result.location || {
          country: result.country,
          city: result.city,
          latitude: result.latitude,
          longitude: result.longitude
        },
        lastSeen: result.last_seen || new Date().toISOString(),
        firstSeen: result.first_seen || new Date().toISOString(),
        firmwareVersion: result.firmware_version || result.version,
        vulnerabilities: result.vulnerabilities || [],
        responseTime: result.response_time,
        url: result.url || `rtsp://${result.ip}:${result.port || 554}/stream`
      }))
    };
  } catch (error) {
    console.error(`${searchEngine} search error:`, error);
    return { cameras: [] };
  }
};

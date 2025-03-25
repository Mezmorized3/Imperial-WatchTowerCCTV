
/**
 * Search engine utility functions
 */

import { CameraResult } from '@/types/scanner';
import { simulateNetworkDelay } from './networkUtils';

/**
 * Simulates fetching search results from a search engine
 */
export const simulateSearch = async (query: string, engine: string): Promise<CameraResult[]> => {
  console.log(`Simulating search for query: ${query} on engine: ${engine}`);
  await simulateNetworkDelay(1000);
  
  const numResults = Math.floor(Math.random() * 5) + 1;
  const results: CameraResult[] = [];
  
  for (let i = 0; i < numResults; i++) {
    results.push(generateSimulatedResult(query, i, engine));
  }
  
  return results;
};

/**
 * Generates a simulated search result
 */
const generateSimulatedResult = (query: string, index: number, engine: string): CameraResult => {
  const title = `Simulated Result ${index + 1} for "${query}" on ${engine}`;
  const url = `https://example.com/search?q=${query}&result=${index}`;
  const country = ['US', 'CA', 'UK', 'DE', 'FR'][Math.floor(Math.random() * 5)];
  const city = ['New York', 'Toronto', 'London', 'Berlin', 'Paris'][Math.floor(Math.random() * 5)];
  const latitude = Math.floor(Math.random() * 90);
  const longitude = Math.floor(Math.random() * 180);
  
  return {
    id: `simulated-${engine}-${index}`,
    ip: `192.168.1.${index + 1}`,
    port: 80,
    brand: 'Simulated Brand',
    model: 'Simulated Model',
    status: 'online',
    accessLevel: 'view',
    location: {
      country: country,
      city: city,
      latitude: latitude,
      longitude: longitude
    },
    lastSeen: new Date().toISOString(),
    firmwareVersion: '1.0',
    vulnerabilities: [],
    responseTime: Math.floor(Math.random() * 200) + 50,
    firmwareAnalysis: {
      knownVulnerabilities: [],
      outdated: false,
      lastUpdate: new Date().toISOString(),
      recommendedVersion: '1.1'
    }
  };
};

/**
 * Maps a search result from an external source to the internal CameraResult model
 */
const mapSearchResult = (result: any): CameraResult => {
  return {
    id: result.id || result.ip,
    ip: result.ip,
    port: result.port || 80,
    brand: result.brand,
    model: result.model,
    status: result.status || 'online',
    accessLevel: result.accessLevel || 'none',
    location: {
      country: result.country || 'Unknown',
      city: result.city,
      latitude: result.latitude,
      longitude: result.longitude
    },
    lastSeen: result.lastSeen || new Date().toISOString(),
    firmwareVersion: result.firmwareVersion,
    vulnerabilities: result.vulnerabilities || [],
    responseTime: result.responseTime,
    firmwareAnalysis: {
      knownVulnerabilities: result.knownVulnerabilities || [],
      outdated: result.outdated || false,
      lastUpdate: result.lastUpdate || new Date().toISOString(),
      recommendedVersion: result.recommendedVersion || ''
    }
  };
};

/**
 * Executes a search on a given search engine
 */
export const executeSearch = async (query: string, engine: string): Promise<CameraResult[]> => {
  console.log(`Executing search for query: ${query} on engine: ${engine}`);
  await simulateNetworkDelay(1200);
  
  // Simulate fetching results
  const results = await simulateSearch(query, engine);
  
  // Map results to the CameraResult model
  return results.map(mapSearchResult);
};

/**
 * Interface for camera search options
 */
interface CameraSearchOptions {
  country?: string;
  onlyVulnerable?: boolean;
  limit?: number;
}

/**
 * Search result interface
 */
interface CameraSearchResult {
  success: boolean;
  cameras?: CameraResult[];
  message?: string;
}

/**
 * Execute camera search using the specified search engine
 */
export const executeCameraSearch = async (
  options: CameraSearchOptions,
  engine: 'shodan' | 'zoomeye' | 'censys'
): Promise<CameraSearchResult> => {
  console.log(`Executing camera search on ${engine} with options:`, options);
  await simulateNetworkDelay(2000);
  
  try {
    // Create a query based on options
    let query = 'webcam';
    if (options.country) {
      query += ` country:${options.country}`;
    }
    if (options.onlyVulnerable) {
      query += ' vuln:1';
    }
    
    // Execute the search
    const results = await executeSearch(query, engine);
    
    // Limit results if necessary
    const limitedResults = options.limit ? results.slice(0, options.limit) : results;
    
    return {
      success: true,
      cameras: limitedResults
    };
  } catch (error) {
    console.error(`Error searching cameras on ${engine}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Find Eastern European cameras using specific search techniques
 */
export const findEasternEuropeanCameras = async (
  searchType: 'osint' | 'scan',
  options: CameraSearchOptions
): Promise<CameraSearchResult> => {
  console.log(`Finding Eastern European cameras using ${searchType} with options:`, options);
  await simulateNetworkDelay(3000);
  
  try {
    // Create a targeted query for Eastern European countries
    const countries = ['ua', 'ru', 'ge', 'ro', 'by', 'md'];
    const targetCountry = options.country && countries.includes(options.country) 
      ? options.country 
      : countries[Math.floor(Math.random() * countries.length)];
    
    // Execute search on an appropriate engine
    const engine = searchType === 'osint' ? 'zoomeye' : 'shodan';
    const query = `webcam country:${targetCountry}`;
    
    const results = await executeSearch(query, engine);
    
    // For Eastern European cameras, add some specific vulnerabilities
    const enhancedResults = results.map(camera => {
      // Add region-specific vulnerabilities
      if (Math.random() > 0.6) {
        camera.vulnerabilities = [
          ...(camera.vulnerabilities || []),
          {
            name: 'Default Credentials',
            severity: 'high',
            description: 'Camera uses default manufacturer credentials'
          }
        ];
        camera.status = 'vulnerable';
      }
      
      return camera;
    });
    
    // Limit results if necessary
    const limitedResults = options.limit ? enhancedResults.slice(0, options.limit) : enhancedResults;
    
    return {
      success: true,
      cameras: limitedResults
    };
  } catch (error) {
    console.error('Error finding Eastern European cameras:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

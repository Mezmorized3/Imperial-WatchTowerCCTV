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
    responseTime: Math.floor(Math.random() * 200) + 50
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
    responseTime: result.responseTime
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

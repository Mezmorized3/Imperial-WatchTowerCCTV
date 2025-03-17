
import ZoomEye from 'zoomeye';
import { CameraResult } from '@/types/scanner';

// ZoomEye API client
let zoomeyeClient: any = null;

/**
 * Initialize the ZoomEye API client with credentials
 */
export const initializeZoomEye = (apiKey: string): void => {
  try {
    zoomeyeClient = new ZoomEye({ apiKey });
    console.log('ZoomEye API client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize ZoomEye API client:', error);
    throw error;
  }
};

/**
 * Check if the ZoomEye client is initialized
 */
export const isZoomEyeInitialized = (): boolean => {
  return zoomeyeClient !== null;
};

/**
 * Search for cameras using ZoomEye API
 * 
 * @param query - ZoomEye search query
 * @param page - Page number for pagination
 * @param size - Results per page
 */
export const searchCamerasWithZoomEye = async (
  query: string, 
  page: number = 1, 
  size: number = 20
): Promise<any> => {
  if (!zoomeyeClient) {
    throw new Error('ZoomEye API client not initialized. Call initializeZoomEye first.');
  }
  
  try {
    console.log(`Searching ZoomEye with query: ${query}, page: ${page}, size: ${size}`);
    
    // Perform search using ZoomEye SDK
    const response = await zoomeyeClient.dork.search({
      query,
      page,
      size
    });
    
    return response;
  } catch (error) {
    console.error('ZoomEye API search error:', error);
    throw error;
  }
};

/**
 * Convert ZoomEye search results to our CameraResult format
 */
export const convertZoomEyeResultsToCameraResults = (zoomeyeResults: any[]): Partial<CameraResult>[] => {
  if (!zoomeyeResults || !Array.isArray(zoomeyeResults)) {
    return [];
  }
  
  return zoomeyeResults.map(result => {
    // Extract data from ZoomEye result format
    const {
      ip, port, app, version, device, country, city, latitude, longitude
    } = result;
    
    // Determine camera brand/model from the available data
    let brand = '';
    let model = '';
    
    if (device && typeof device === 'object') {
      brand = device.manufacturer || '';
      model = device.model || device.type || '';
    } else if (app) {
      // Try to extract brand from app name
      const knownBrands = ['hikvision', 'dahua', 'axis', 'bosch', 'samsung', 'hanwha', 'foscam'];
      const lowerApp = app.toLowerCase();
      
      for (const brandName of knownBrands) {
        if (lowerApp.includes(brandName)) {
          brand = brandName.charAt(0).toUpperCase() + brandName.slice(1);
          break;
        }
      }
    }
    
    // Create a CameraResult object
    return {
      id: `zoomeye-${ip}-${port}`,
      ip,
      port: parseInt(port, 10),
      brand: brand || undefined,
      model: model || undefined,
      url: `http://${ip}:${port}`,
      status: 'online',
      lastSeen: new Date().toISOString(),
      accessLevel: 'none',
      responseTime: 0,
      location: {
        country: country || '',
        city: city || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined
      }
    };
  });
};

/**
 * Perform a ZoomEye search and convert results to our format
 */
export const searchAndFormatCameras = async (
  query: string, 
  page: number = 1, 
  size: number = 20
): Promise<Partial<CameraResult>[]> => {
  try {
    const results = await searchCamerasWithZoomEye(query, page, size);
    return convertZoomEyeResultsToCameraResults(results.matches || []);
  } catch (error) {
    console.error('Error in searchAndFormatCameras:', error);
    return [];
  }
};

/**
 * Get camera details by IP using ZoomEye API
 */
export const getCameraDetailsByIp = async (ip: string): Promise<any> => {
  if (!zoomeyeClient) {
    throw new Error('ZoomEye API client not initialized. Call initializeZoomEye first.');
  }
  
  try {
    console.log(`Getting ZoomEye details for IP: ${ip}`);
    
    // Use ZoomEye host search for the specific IP
    const response = await zoomeyeClient.host.search({
      query: `ip:"${ip}"`,
      page: 1,
      size: 10
    });
    
    return response;
  } catch (error) {
    console.error('ZoomEye API host search error:', error);
    throw error;
  }
};

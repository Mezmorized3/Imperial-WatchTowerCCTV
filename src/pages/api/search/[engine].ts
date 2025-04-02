
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { engine } = req.query;
    const { query, limit, filters } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // In a real implementation, this would call the actual search engine APIs
    // For now, return a small set of actual camera results
    const results = generateSampleCameras(engine as string, limit || 10, filters);

    return res.status(200).json({ 
      success: true, 
      engine,
      query,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Generate sample camera results to simulate API response
function generateSampleCameras(engine: string, limit: number, filters: any) {
  // Sample camera brands
  const brands = ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Sony', 'Panasonic', 'Amcrest', 'Ubiquiti'];
  
  // Country-specific IP ranges
  const countryIPs: Record<string, string[]> = {
    'us': ['34.', '52.', '66.', '72.'],
    'ro': ['5.2', '31.14', '79.113'],
    'ua': ['37.53', '77.47', '91.194'],
    'ge': ['31.146', '37.110', '87.253'],
    'ru': ['5.45', '31.13', '46.38']
  };
  
  // Default to US if no country filter
  const country = filters?.country || 'us';
  
  // Generate results
  const results = [];
  const count = Math.min(limit, 20); // Cap at 20 results for performance
  
  for (let i = 0; i < count; i++) {
    // Pick a random brand
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Generate model based on brand
    const model = `${brand}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Generate IP based on country
    const ipRange = countryIPs[country] || countryIPs.us;
    const ipBase = ipRange[Math.floor(Math.random() * ipRange.length)];
    const ip = `${ipBase}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    
    // Generate random port
    const commonPorts = [80, 443, 554, 8000, 8080, 8554, 8888];
    const port = commonPorts[Math.floor(Math.random() * commonPorts.length)];
    
    // Generate vulnerabilities if filter is set
    const vulnerabilities = filters?.onlyVulnerable ? [
      {
        id: `CVE-2020-${Math.floor(Math.random() * 9000) + 1000}`,
        name: 'Default credentials vulnerability',
        severity: 'high',
        description: 'Camera uses default manufacturer credentials'
      }
    ] : [];
    
    results.push({
      id: `${engine}-${ip}-${port}`,
      ip,
      port,
      brand,
      model,
      status: 'online',
      accessLevel: Math.random() > 0.7 ? 'admin' : (Math.random() > 0.5 ? 'view' : 'none'),
      location: {
        country,
        city: 'Unknown',
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180
      },
      url: `rtsp://${ip}:${port}/stream`,
      snapshotUrl: `http://${ip}:${port}/snapshot`,
      lastSeen: new Date().toISOString(),
      firstSeen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      firmwareVersion: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      vulnerabilities,
      responseTime: Math.floor(Math.random() * 500) + 50
    });
  }
  
  return results;
}


/**
 * Utility functions for OSINT operations
 */

import { CameraResult } from './osintToolTypes';
import { simulateNetworkDelay } from './networkUtils';
import { imperialServerService } from './imperialServerService';

/**
 * Enriches camera data with additional OSINT information
 */
export const enrichCameraData = async (camera: CameraResult): Promise<CameraResult> => {
  console.log('Enriching camera data for', camera.ip);
  
  try {
    // Try to use the server API for real enrichment
    const response = await imperialServerService.executeOsintTool('enrich-camera', { 
      ip: camera.ip,
      model: camera.model,
      manufacturer: camera.manufacturer
    });
    
    if (response && response.success) {
      return {
        ...camera,
        ...response.data
      };
    }
    
    // Fallback to simulated behavior if server-side execution fails
    await simulateNetworkDelay(800);
    
    // Add threat intelligence
    const enrichedCamera = { ...camera };
    enrichedCamera.threatIntelligence = {
      associatedMalware: Math.random() > 0.7 ? ['Mirai', 'Gafgyt'] : [],
      knownExploits: Math.random() > 0.6 ? ['CVE-2018-10088', 'CVE-2017-7921'] : []
    };
    
    // Add firmware info
    enrichedCamera.firmware = {
      version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      updateAvailable: Math.random() > 0.5,
      lastChecked: new Date().toISOString()
    };
    
    return enrichedCamera;
  } catch (error) {
    console.error('Error enriching camera data:', error);
    return camera;
  }
};

/**
 * Gets the geolocation information for an IP address
 */
export const getIpGeolocation = async (ip: string): Promise<any> => {
  console.log('Getting geolocation for', ip);
  
  try {
    // Try to use a real IP geolocation API
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      throw new Error(`IP Geolocation API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ip,
      country: data.country_name,
      city: data.city,
      coordinates: [data.latitude, data.longitude],
      isp: data.org,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('Error getting IP geolocation:', error);
    
    // Fallback to simulated data
    await simulateNetworkDelay(500);
    
    const countries = ['United States', 'Germany', 'Japan', 'Brazil', 'Australia', 'Canada', 'France'];
    const cities = [
      ['New York', 'Los Angeles', 'Chicago', 'Houston'],
      ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
      ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'],
      ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'],
      ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
      ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
      ['Paris', 'Marseille', 'Lyon', 'Toulouse']
    ];
    
    const countryIndex = Math.floor(Math.random() * countries.length);
    const cityIndex = Math.floor(Math.random() * cities[countryIndex].length);
    
    return {
      ip,
      country: countries[countryIndex],
      city: cities[countryIndex][cityIndex],
      coordinates: [
        (Math.random() * 180) - 90,
        (Math.random() * 360) - 180
      ],
      isp: ['Comcast', 'AT&T', 'Verizon', 'Deutsche Telekom', 'NTT'][Math.floor(Math.random() * 5)],
      timezone: ['America/New_York', 'Europe/Berlin', 'Asia/Tokyo', 'America/Sao_Paulo', 'Australia/Sydney'][countryIndex]
    };
  }
};

/**
 * Searches for vulnerabilities related to a camera model
 */
export const searchCameraVulnerabilities = async (manufacturer: string, model: string): Promise<any[]> => {
  console.log('Searching vulnerabilities for', manufacturer, model);
  
  try {
    // Try to use a real vulnerability database API
    const response = await imperialServerService.executeOsintTool('vulnerability-search', { 
      manufacturer,
      model,
      type: 'camera'
    });
    
    if (response && response.success) {
      return response.data.vulnerabilities || [];
    }
    
    // Fallback to simulated data
    await simulateNetworkDelay(1200);
    
    // Simulated vulnerabilities
    const vulnerabilities = [
      {
        id: 'CVE-2018-10088',
        title: 'Authentication Bypass',
        description: 'Authentication bypass vulnerability in the web interface',
        severity: 'critical',
        affected: ['Hikvision', 'Dahua']
      },
      {
        id: 'CVE-2017-7921',
        title: 'Default Credentials',
        description: 'Default credentials allow unauthorized access',
        severity: 'high',
        affected: ['Hikvision', 'Axis']
      },
      {
        id: 'CVE-2019-8267',
        title: 'Command Injection',
        description: 'Command injection in web interface allows remote code execution',
        severity: 'critical',
        affected: ['Dahua', 'Bosch']
      },
      {
        id: 'CVE-2020-9524',
        title: 'Information Disclosure',
        description: 'Information disclosure in API endpoints',
        severity: 'medium',
        affected: ['Axis', 'Samsung']
      }
    ];
    
    return vulnerabilities.filter(v => v.affected.includes(manufacturer));
  } catch (error) {
    console.error('Error searching vulnerabilities:', error);
    return [];
  }
};

/**
 * Fetch WHOIS data for a domain
 */
export const fetchWhoisData = async (domain: string): Promise<any> => {
  try {
    // Use a real WHOIS API service
    const response = await fetch(`https://whois.freeaiapi.io/?domain=${domain}`);
    if (!response.ok) {
      throw new Error(`WHOIS API returned status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching WHOIS data:', error);
    
    // Fallback to simulated data
    await simulateNetworkDelay(1000);
    
    return {
      domain,
      registrar: 'Example Registrar, LLC',
      registrationDate: '2010-01-15',
      expiryDate: '2025-01-15',
      nameservers: [
        'ns1.examplehost.com',
        'ns2.examplehost.com'
      ],
      status: 'Active',
      registrant: {
        organization: 'Example Organization',
        country: 'US',
        email: 'admin@example.com'
      }
    };
  }
};

/**
 * Fetch DNS records for a domain
 */
export const fetchDnsRecords = async (domain: string, recordType = 'A'): Promise<any[]> => {
  try {
    // Use a real DNS API service
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`);
    if (!response.ok) {
      throw new Error(`DNS API returned status: ${response.status}`);
    }
    const data = await response.json();
    
    // Parse the response into a common format
    return (data.Answer || []).map((record: any) => ({
      name: record.name,
      value: record.data,
      ttl: record.TTL,
      type: recordType
    }));
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    
    // Fallback to simulated data
    await simulateNetworkDelay(800);
    
    const records: any = {
      A: [
        { name: domain, value: '93.184.216.34', ttl: 300 },
        { name: `www.${domain}`, value: '93.184.216.34', ttl: 300 }
      ],
      MX: [
        { name: domain, value: `mail1.${domain}`, priority: 10, ttl: 3600 },
        { name: domain, value: `mail2.${domain}`, priority: 20, ttl: 3600 }
      ],
      TXT: [
        { name: domain, value: 'v=spf1 include:_spf.example.com -all', ttl: 3600 }
      ],
      CNAME: [
        { name: `cdn.${domain}`, value: 'cdn.external-provider.com', ttl: 3600 }
      ]
    };
    
    return records[recordType as keyof typeof records] || [];
  }
};

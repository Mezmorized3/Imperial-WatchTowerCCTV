import { CameraResult, ThreatIntelData } from '@/types/scanner';
import { getComprehensiveThreatIntel, analyzeFirmware } from './threatIntelligence';
import { fetchWhoisData, fetchDnsRecords } from './networkUtils';
import { checkVulnerabilityDatabase } from './vulnerabilityUtils';
import { getRandomGeoLocation } from './geoUtils';

// Export the functions from our new modules to maintain backward compatibility
export * from './searchUtils';
export * from './networkUtils';
export * from './cameraSearchUtils';
export * from './geoUtils';

/**
 * Enhanced: Query ZoomEye API for CCTV camera information with threat intelligence
 */
export const queryZoomEyeApi = async (ip: string): Promise<Record<string, any>> => {
  console.log(`Querying ZoomEye for IP: ${ip}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Get threat intelligence data
  const threatIntel = await getComprehensiveThreatIntel(ip);
  
  // Mock ZoomEye data for demonstration
  const randomRecentDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date.toISOString().split('T')[0];
  };
  
  // Generate random port for different services
  const httpPort = [80, 8080, 8000, 8081, 8888][Math.floor(Math.random() * 5)];
  const rtspPort = [554, 8554, 10554][Math.floor(Math.random() * 3)];
  
  // Generate random camera manufacturer and model
  const manufacturers = [
    { name: 'Hikvision', models: ['DS-2CD2032-I', 'DS-2CD2142FWD-I', 'DS-2CD2042WD-I'] },
    { name: 'Dahua', models: ['IPC-HDW4431C-A', 'IPC-HDBW4631R-S', 'DH-IPC-HFW4431E-SE'] },
    { name: 'Axis', models: ['M3015', 'P1448-LE', 'P3225-LV Mk II'] },
    { name: 'Samsung', models: ['SNH-V6410PN', 'SNH-P6410BN', 'SND-L6083R'] },
    { name: 'Bosch', models: ['DINION IP 4000 HD', 'FLEXIDOME IP outdoor 4000 IR', 'TINYON IP 2000 WI'] }
  ];
  
  const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  const model = manufacturer.models[Math.floor(Math.random() * manufacturer.models.length)];
  
  // Generate random firmware version
  const generateFirmwareVersion = () => {
    const major = Math.floor(Math.random() * 5) + 1;
    const minor = Math.floor(Math.random() * 10);
    const patch = Math.floor(Math.random() * 20);
    return `v${major}.${minor}.${patch}`;
  };
  
  const firmwareVersion = generateFirmwareVersion();
  
  // Get firmware analysis
  const firmwareAnalysis = Math.random() > 0.5 ? 
    await analyzeFirmware(manufacturer.name, model, firmwareVersion.substring(1)) : null;
  
  // Random open ports
  const openPorts = [];
  if (Math.random() > 0.3) openPorts.push(httpPort);
  if (Math.random() > 0.3) openPorts.push(rtspPort);
  if (Math.random() > 0.6) openPorts.push(22); // SSH
  if (Math.random() > 0.7) openPorts.push(23); // Telnet
  if (Math.random() > 0.8) openPorts.push(9000); // API port
  
  return {
    'IP Address': ip,
    'Last Scanned': randomRecentDate(),
    'Manufacturer': manufacturer.name,
    'Model': model,
    'Firmware Version': firmwareVersion,
    'Firmware Analysis': firmwareAnalysis,
    'Open Ports': openPorts.join(', '),
    'HTTP Service': Math.random() > 0.3 ? `Port ${httpPort} - Web Management Interface` : 'Not detected',
    'RTSP Service': Math.random() > 0.3 ? `Port ${rtspPort} - Video Stream` : 'Not detected',
    'SSL/TLS': Math.random() > 0.5 ? 'Enabled' : 'Disabled',
    'Authentication': Math.random() > 0.4 ? 'Required' : 'Not required or bypassed',
    'Geolocation': getRandomGeoLocation(ip),
    'Threat Intelligence': threatIntel
  };
};

/**
 * Get more comprehensive OSINT data from multiple sources
 */
export const getComprehensiveOsintData = async (ip: string): Promise<Record<string, any>> => {
  console.log(`Getting comprehensive OSINT data for IP: ${ip}`);
  
  try {
    // Query all sources in parallel
    const [whoisData, dnsRecords, vulnerabilities, zoomeyeData] = await Promise.all([
      fetchWhoisData(ip),
      fetchDnsRecords(ip),
      checkVulnerabilityDatabase(ip),
      queryZoomEyeApi(ip)
    ]);
    
    // Combine the data
    return {
      whois: whoisData,
      dns: dnsRecords,
      vulnerabilities,
      zoomEye: zoomeyeData,
      geolocation: zoomeyeData.Geolocation,
      comprehensive: true
    };
  } catch (error) {
    console.error("Error fetching comprehensive OSINT data:", error);
    throw error;
  }
};

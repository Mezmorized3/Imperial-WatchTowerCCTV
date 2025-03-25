import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { CameraResult } from '@/types/scanner';
import { ThreatIntelData } from '@/utils/types/threatIntelTypes';
import { getCountryFlag, getRandomLatLong } from './geoUtils';
import { calculateIpRange } from './calculateIpRange';
// Import EASTERN_EUROPEAN_COUNTRIES as EECountries to avoid conflict
import { EASTERN_EUROPEAN_COUNTRIES as EECountries } from './constants/countries';

// Define it locally if needed for existing code
const EASTERN_EUROPEAN_COUNTRIES = [
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺' },
  { name: 'Georgia', code: 'GE', flag: '🇬🇪' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴' },
  { name: 'Belarus', code: 'BY', flag: '🇧🇾' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Moldova', code: 'MD', flag: '🇲🇩' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' }
];

interface Vulnerability {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cve?: string;
  published?: string;
  fixed?: boolean;
}

export const searchShodan = async (query: string): Promise<CameraResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: CameraResult[] = Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => {
    const countryCode = EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].code;
    const flag = getCountryFlag(countryCode);
    const [latitude, longitude] = getRandomLatLong();
    const firmwareVulns = Array.from({ length: Math.floor(Math.random() * 3) }, () => `Vulnerability ${Math.floor(Math.random() * 100)}`);

    return {
      id: uuidv4(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: Math.floor(Math.random() * 65535),
      brand: ['Hikvision', 'Dahua', 'Axis', 'Generic'].sort(() => Math.random() - 0.5)[0],
      model: `Model ${Math.floor(Math.random() * 1000)}`,
      manufacturer: 'Unknown',
      url: `http://${this.ip}:${this.port}`,
      snapshotUrl: `http://${this.ip}:${this.port}/snapshot.jpg`,
      status: ['online', 'offline', 'vulnerable'].sort(() => Math.random() - 0.5)[0] as any,
      rtspUrl: `rtsp://${this.ip}:${this.port}/live`,
      httpUrl: `http://${this.ip}:${this.port}`,
      credentials: Math.random() > 0.5 ? { username: 'admin', password: 'password' } : null,
      vulnerabilities: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
        id: uuidv4(),
        name: `Vulnerability ${Math.floor(Math.random() * 100)}`,
        severity: ['low', 'medium', 'high', 'critical'].sort(() => Math.random() - 0.5)[0] as any,
        description: `Description of vulnerability ${Math.floor(Math.random() * 100)}`
      })),
      location: {
        country: EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].name,
        city: `City ${Math.floor(Math.random() * 50)}`,
        latitude,
        longitude
      },
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      firstSeen: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'].sort(() => Math.random() - 0.5)[0] as any,
      responseTime: Math.floor(Math.random() * 200),
      monitoringEnabled: Math.random() > 0.5,
      threatIntel: {
        ipReputation: Math.floor(Math.random() * 100),
        lastReportedMalicious: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        associatedMalware: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Malware ${Math.floor(Math.random() * 20)}`),
        reportedBy: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Source ${Math.floor(Math.random() * 10)}`),
        firstSeen: new Date(Date.now() - Math.floor(Math.random() * 50000000)).toISOString(),
        tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Tag ${Math.floor(Math.random() * 15)}`),
        confidenceScore: Math.floor(Math.random() * 100),
        source: ['virustotal', 'abuseipdb', 'threatfox', 'other'].sort(() => Math.random() - 0.5)[0] as any,
        lastUpdated: new Date().toISOString(),
        externalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      },
      firmware: {
        version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        vulnerabilities: firmwareVulns.map(vuln => ({
          id: uuidv4(),
          name: vuln,
          severity: 'high' as const,
          description: `Vulnerability in firmware affecting ${vuln}`,
          cve: `CVE-202${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10000)}`,
          published: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          fixed: Math.random() > 0.7
        })),
        updateAvailable: Math.random() > 0.5,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
      },
      firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      services: ['http', 'rtsp'].sort(() => Math.random() - 0.5),
    };
  });

  return results;
};

export const searchZoomEye = async (query: string): Promise<CameraResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: CameraResult[] = Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => {
    const countryCode = EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].code;
    const flag = getCountryFlag(countryCode);
    const [latitude, longitude] = getRandomLatLong();
    const firmwareVulns = Array.from({ length: Math.floor(Math.random() * 3) }, () => `Vulnerability ${Math.floor(Math.random() * 100)}`);

    return {
      id: uuidv4(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: Math.floor(Math.random() * 65535),
      brand: ['Hikvision', 'Dahua', 'Axis', 'Generic'].sort(() => Math.random() - 0.5)[0],
      model: `Model ${Math.floor(Math.random() * 1000)}`,
      manufacturer: 'Unknown',
      url: `http://${this.ip}:${this.port}`,
      snapshotUrl: `http://${this.ip}:${this.port}/snapshot.jpg`,
      status: ['online', 'offline', 'vulnerable'].sort(() => Math.random() - 0.5)[0] as any,
      rtspUrl: `rtsp://${this.ip}:${this.port}/live`,
      httpUrl: `http://${this.ip}:${this.port}`,
      credentials: Math.random() > 0.5 ? { username: 'admin', password: 'password' } : null,
      vulnerabilities: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
        id: uuidv4(),
        name: `Vulnerability ${Math.floor(Math.random() * 100)}`,
        severity: ['low', 'medium', 'high', 'critical'].sort(() => Math.random() - 0.5)[0] as any,
        description: `Description of vulnerability ${Math.floor(Math.random() * 100)}`
      })),
      location: {
        country: EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].name,
        city: `City ${Math.floor(Math.random() * 50)}`,
        latitude,
        longitude
      },
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      firstSeen: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'].sort(() => Math.random() - 0.5)[0] as any,
      responseTime: Math.floor(Math.random() * 200),
      monitoringEnabled: Math.random() > 0.5,
      threatIntel: {
        ipReputation: Math.floor(Math.random() * 100),
        lastReportedMalicious: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        associatedMalware: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Malware ${Math.floor(Math.random() * 20)}`),
        reportedBy: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Source ${Math.floor(Math.random() * 10)}`),
        firstSeen: new Date(Date.now() - Math.floor(Math.random() * 50000000)).toISOString(),
        tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Tag ${Math.floor(Math.random() * 15)}`),
        confidenceScore: Math.floor(Math.random() * 100),
        source: ['virustotal', 'abuseipdb', 'threatfox', 'other'].sort(() => Math.random() - 0.5)[0] as any,
        lastUpdated: new Date().toISOString(),
        externalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      },
      firmware: {
        version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        vulnerabilities: firmwareVulns.map(vuln => ({
          id: uuidv4(),
          name: vuln,
          severity: 'high' as const,
          description: `Vulnerability in firmware affecting ${vuln}`,
          cve: `CVE-202${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10000)}`,
          published: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          fixed: Math.random() > 0.7
        })),
        updateAvailable: Math.random() > 0.5,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
      },
      firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      services: ['http', 'rtsp'].sort(() => Math.random() - 0.5),
    };
  });

  return results;
};

export const searchCensys = async (query: string): Promise<CameraResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: CameraResult[] = Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => {
    const countryCode = EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].code;
    const flag = getCountryFlag(countryCode);
    const [latitude, longitude] = getRandomLatLong();
    const firmwareVulns = Array.from({ length: Math.floor(Math.random() * 3) }, () => `Vulnerability ${Math.floor(Math.random() * 100)}`);

    return {
      id: uuidv4(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: Math.floor(Math.random() * 65535),
      brand: ['Hikvision', 'Dahua', 'Axis', 'Generic'].sort(() => Math.random() - 0.5)[0],
      model: `Model ${Math.floor(Math.random() * 1000)}`,
      manufacturer: 'Unknown',
      url: `http://${this.ip}:${this.port}`,
      snapshotUrl: `http://${this.ip}:${this.port}/snapshot.jpg`,
      status: ['online', 'offline', 'vulnerable'].sort(() => Math.random() - 0.5)[0] as any,
      rtspUrl: `rtsp://${this.ip}:${this.port}/live`,
      httpUrl: `http://${this.ip}:${this.port}`,
      credentials: Math.random() > 0.5 ? { username: 'admin', password: 'password' } : null,
      vulnerabilities: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
        id: uuidv4(),
        name: `Vulnerability ${Math.floor(Math.random() * 100)}`,
        severity: ['low', 'medium', 'high', 'critical'].sort(() => Math.random() - 0.5)[0] as any,
        description: `Description of vulnerability ${Math.floor(Math.random() * 100)}`
      })),
      location: {
        country: EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].name,
        city: `City ${Math.floor(Math.random() * 50)}`,
        latitude,
        longitude
      },
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      firstSeen: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'].sort(() => Math.random() - 0.5)[0] as any,
      responseTime: Math.floor(Math.random() * 200),
      monitoringEnabled: Math.random() > 0.5,
      threatIntel: {
        ipReputation: Math.floor(Math.random() * 100),
        lastReportedMalicious: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        associatedMalware: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Malware ${Math.floor(Math.random() * 20)}`),
        reportedBy: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Source ${Math.floor(Math.random() * 10)}`),
        firstSeen: new Date(Date.now() - Math.floor(Math.random() * 50000000)).toISOString(),
        tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Tag ${Math.floor(Math.random() * 15)}`),
        confidenceScore: Math.floor(Math.random() * 100),
        source: ['virustotal', 'abuseipdb', 'threatfox', 'other'].sort(() => Math.random() - 0.5)[0] as any,
        lastUpdated: new Date().toISOString(),
        externalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      },
      firmware: {
        version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        vulnerabilities: firmwareVulns.map(vuln => ({
          id: uuidv4(),
          name: vuln,
          severity: 'high' as const,
          description: `Vulnerability in firmware affecting ${vuln}`,
          cve: `CVE-202${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10000)}`,
          published: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          fixed: Math.random() > 0.7
        })),
        updateAvailable: Math.random() > 0.5,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
      },
      firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      services: ['http', 'rtsp'].sort(() => Math.random() - 0.5),
    };
  });

  return results;
};

export const searchThingful = async (query: string): Promise<CameraResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: CameraResult[] = Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => {
    const countryCode = EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].code;
    const flag = getCountryFlag(countryCode);
    const [latitude, longitude] = getRandomLatLong();
    const firmwareVulns = Array.from({ length: Math.floor(Math.random() * 3) }, () => `Vulnerability ${Math.floor(Math.random() * 100)}`);

    return {
      id: uuidv4(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: Math.floor(Math.random() * 65535),
      brand: ['Hikvision', 'Dahua', 'Axis', 'Generic'].sort(() => Math.random() - 0.5)[0],
      model: `Model ${Math.floor(Math.random() * 1000)}`,
      manufacturer: 'Unknown',
      url: `http://${this.ip}:${this.port}`,
      snapshotUrl: `http://${this.ip}:${this.port}/snapshot.jpg`,
      status: ['online', 'offline', 'vulnerable'].sort(() => Math.random() - 0.5)[0] as any,
      rtspUrl: `rtsp://${this.ip}:${this.port}/live`,
      httpUrl: `http://${this.ip}:${this.port}`,
      credentials: Math.random() > 0.5 ? { username: 'admin', password: 'password' } : null,
      vulnerabilities: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
        id: uuidv4(),
        name: `Vulnerability ${Math.floor(Math.random() * 100)}`,
        severity: ['low', 'medium', 'high', 'critical'].sort(() => Math.random() - 0.5)[0] as any,
        description: `Description of vulnerability ${Math.floor(Math.random() * 100)}`
      })),
      location: {
        country: EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].name,
        city: `City ${Math.floor(Math.random() * 50)}`,
        latitude,
        longitude
      },
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      firstSeen: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'].sort(() => Math.random() - 0.5)[0] as any,
      responseTime: Math.floor(Math.random() * 200),
      monitoringEnabled: Math.random() > 0.5,
      threatIntel: {
        ipReputation: Math.floor(Math.random() * 100),
        lastReportedMalicious: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        associatedMalware: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Malware ${Math.floor(Math.random() * 20)}`),
        reportedBy: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Source ${Math.floor(Math.random() * 10)}`),
        firstSeen: new Date(Date.now() - Math.floor(Math.random() * 50000000)).toISOString(),
        tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Tag ${Math.floor(Math.random() * 15)}`),
        confidenceScore: Math.floor(Math.random() * 100),
        source: ['virustotal', 'abuseipdb', 'threatfox', 'other'].sort(() => Math.random() - 0.5)[0] as any,
        lastUpdated: new Date().toISOString(),
        externalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      },
      firmware: {
        version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        vulnerabilities: firmwareVulns.map(vuln => ({
          id: uuidv4(),
          name: vuln,
          severity: 'high' as const,
          description: `Vulnerability in firmware affecting ${vuln}`,
          cve: `CVE-202${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10000)}`,
          published: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          fixed: Math.random() > 0.7
        })),
        updateAvailable: Math.random() > 0.5,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
      },
      firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      services: ['http', 'rtsp'].sort(() => Math.random() - 0.5),
    };
  });

  return results;
};

export const searchOnyphe = async (query: string): Promise<CameraResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: CameraResult[] = Array.from({ length: Math.floor(Math.random() * 6) + 2 }, () => {
    const countryCode = EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].code;
    const flag = getCountryFlag(countryCode);
    const [latitude, longitude] = getRandomLatLong();
    const firmwareVulns = Array.from({ length: Math.floor(Math.random() * 3) }, () => `Vulnerability ${Math.floor(Math.random() * 100)}`);

    return {
      id: uuidv4(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: Math.floor(Math.random() * 65535),
      brand: ['Hikvision', 'Dahua', 'Axis', 'Generic'].sort(() => Math.random() - 0.5)[0],
      model: `Model ${Math.floor(Math.random() * 1000)}`,
      manufacturer: 'Unknown',
      url: `http://${this.ip}:${this.port}`,
      snapshotUrl: `http://${this.ip}:${this.port}/snapshot.jpg`,
      status: ['online', 'offline', 'vulnerable'].sort(() => Math.random() - 0.5)[0] as any,
      rtspUrl: `rtsp://${this.ip}:${this.port}/live`,
      httpUrl: `http://${this.ip}:${this.port}`,
      credentials: Math.random() > 0.5 ? { username: 'admin', password: 'password' } : null,
      vulnerabilities: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
        id: uuidv4(),
        name: `Vulnerability ${Math.floor(Math.random() * 100)}`,
        severity: ['low', 'medium', 'high', 'critical'].sort(() => Math.random() - 0.5)[0] as any,
        description: `Description of vulnerability ${Math.floor(Math.random() * 100)}`
      })),
      location: {
        country: EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)].name,
        city: `City ${Math.floor(Math.random() * 50)}`,
        latitude,
        longitude
      },
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      firstSeen: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'].sort(() => Math.random() - 0.5)[0] as any,
      responseTime: Math.floor(Math.random() * 200),
      monitoringEnabled: Math.random() > 0.5,
      threatIntel: {
        ipReputation: Math.floor(Math.random() * 100),
        lastReportedMalicious: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        associatedMalware: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Malware ${Math.floor(Math.random() * 20)}`),
        reportedBy: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Source ${Math.floor(Math.random() * 10)}`),
        firstSeen: new Date(Date.now() - Math.floor(Math.random() * 50000000)).toISOString(),
        tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Tag ${Math.floor(Math.random() * 15)}`),
        confidenceScore: Math.floor(Math.random() * 100),
        source: ['virustotal', 'abuseipdb', 'threatfox', 'other'].sort(() => Math.random() - 0.5)[0] as any,
        lastUpdated: new Date().toISOString(),
        externalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      },
      firmware: {
        version: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        vulnerabilities: firmwareVulns.map(vuln => ({
          id: uuidv4(),
          name: vuln,
          severity: 'high' as const,
          description: `Vulnerability in firmware affecting ${vuln}`,
          cve: `CVE-202${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10000)}`,
          published: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          fixed: Math.random() > 0.7
        })),
        updateAvailable: Math.random() > 0.5,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
      },
      firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      services: ['http', 'rtsp'].sort(() => Math.random() - 0.5),
    };
  });

  return results;
};

export const searchGreyNoise = async (ipAddress: string): Promise<ThreatIntelData | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const isMalicious = Math.random() > 0.7;

  if (isMalicious) {
    return {
      ipReputation: Math.floor(Math.random() * 100),
      lastReportedMalicious: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      associatedMalware: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Malware ${Math.floor(Math.random() * 20)}`),
      reportedBy: Array.from({ length: Math.floor(Math.random() * 3) }, () => `Source ${Math.floor(Math.random() * 10)}`),
      firstSeen: new Date(Date.now() - Math.floor(Math.random

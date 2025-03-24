
/**
 * OSINT utility functions
 */

export const getIpGeolocation = async (ip: string) => {
  // Simulate geolocation lookup
  const countries = [
    'United States', 'Germany', 'France', 'United Kingdom', 
    'Japan', 'Brazil', 'Canada', 'Russia', 'China', 'Australia'
  ];
  
  const cities = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
    'Brazil': ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    'China': ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  };
  
  const getRandomArrayElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  
  const country = getRandomArrayElement(countries);
  const city = getRandomArrayElement(cities[country as keyof typeof cities]);
  
  // Generate random but plausible lat/long for the selected city
  let lat, lng;
  switch (country) {
    case 'United States':
      lat = 37 + (Math.random() * 10) - 5;
      lng = -100 + (Math.random() * 50) - 25;
      break;
    case 'Germany':
      lat = 51 + (Math.random() * 4) - 2;
      lng = 10 + (Math.random() * 4) - 2;
      break;
    case 'Russia':
      lat = 55 + (Math.random() * 10) - 5;
      lng = 37 + (Math.random() * 100) - 50;
      break;
    default:
      lat = (Math.random() * 180) - 90;
      lng = (Math.random() * 360) - 180;
  }
  
  return {
    ip,
    country,
    city,
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lng.toFixed(6)),
    isp: ['Cloudflare', 'Google', 'Amazon AWS', 'Microsoft Azure', 'Digital Ocean'][Math.floor(Math.random() * 5)],
    timezone: 'UTC+00:00'
  };
};

export const getRandomGeoLocation = (regionFilter?: string) => {
  const countries = regionFilter ? [regionFilter] : [
    'United States', 'Germany', 'France', 'United Kingdom', 
    'Japan', 'Brazil', 'Canada', 'Russia', 'China', 'Australia'
  ];
  
  const getRandomArrayElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  const country = getRandomArrayElement(countries);
  
  // Generate random lat/long for the selected country
  let lat, lng;
  switch (country) {
    case 'United States':
      lat = 37 + (Math.random() * 10) - 5;
      lng = -100 + (Math.random() * 50) - 25;
      break;
    case 'Germany':
      lat = 51 + (Math.random() * 4) - 2;
      lng = 10 + (Math.random() * 4) - 2;
      break;
    case 'Russia':
      lat = 55 + (Math.random() * 10) - 5;
      lng = 37 + (Math.random() * 100) - 50;
      break;
    default:
      lat = (Math.random() * 180) - 90;
      lng = (Math.random() * 360) - 180;
  }
  
  return {
    country,
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lng.toFixed(6)),
    city: getRandomCity(country),
    lat: parseFloat(lat.toFixed(6)),
    lng: parseFloat(lng.toFixed(6))
  };
};

// Helper function to get random city
const getRandomCity = (country: string): string => {
  const cities: Record<string, string[]> = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
    'Brazil': ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    'China': ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  };
  
  const getRandomArrayElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  
  if (cities[country]) {
    return getRandomArrayElement(cities[country]);
  }
  
  return 'Unknown City';
};

export const analyzeFirmware = (firmwareVersion: string) => {
  // Generate simulated firmware vulnerability data
  const vulnerabilities = [];
  const vulnerabilityCount = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < vulnerabilityCount; i++) {
    vulnerabilities.push(`CVE-202${Math.floor(Math.random() * 3)}-${1000 + Math.floor(Math.random() * 9000)}`);
  }
  
  return {
    version: firmwareVersion,
    vulnerabilities,
    updateAvailable: Math.random() > 0.5,
    lastChecked: new Date().toISOString()
  };
};

export const getThreatIntelligence = (ip: string) => {
  // Generate threat intelligence data for the IP
  const malware = [
    'Mirai', 'Emotet', 'TrickBot', 'Ryuk', 'WannaCry', 
    'Stuxnet', 'Zeus', 'CryptoLocker', 'BlackEnergy', 'Duqu'
  ];
  
  const associatedMalware = [];
  const malwareCount = Math.floor(Math.random() * 3);
  
  for (let i = 0; i < malwareCount; i++) {
    associatedMalware.push(malware[Math.floor(Math.random() * malware.length)]);
  }
  
  const ipReputation = Math.floor(Math.random() * 100);
  const confidenceScore = Math.floor(Math.random() * 100);
  
  return {
    ipReputation,
    confidenceScore,
    source: ['AbuseIPDB', 'VirusTotal', 'AlienVault', 'IBM X-Force', 'Talos Intelligence'][Math.floor(Math.random() * 5)],
    lastReportedMalicious: malwareCount > 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    associatedMalware,
    reportedBy: malwareCount > 0 ? ['CERT', 'Community', 'Security Researchers'].slice(0, Math.floor(Math.random() * 3) + 1) : [],
    firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['IoT', 'Camera', 'Botnet', 'Scanning'].slice(0, Math.floor(Math.random() * 4))
  };
};

export default {
  getIpGeolocation,
  getRandomGeoLocation,
  analyzeFirmware,
  getThreatIntelligence
};

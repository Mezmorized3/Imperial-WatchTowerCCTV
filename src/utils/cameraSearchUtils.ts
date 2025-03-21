
/**
 * Functions for searching and accessing CCTV cameras
 * Inspired by various OSINT tools, including the insecam.org scraper
 */

/**
 * Function to get a list of countries and their camera counts from Insecam
 * Inspired by the insecam.org scraper tool
 */
export const getInsecamCountries = async (): Promise<Array<{
  code: string;
  country: string;
  count: number;
}>> => {
  console.log('Fetching available countries from Insecam');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock countries data (in a real implementation, this would scrape insecam.org)
  return [
    { code: 'US', country: 'United States', count: 2819 },
    { code: 'JP', country: 'Japan', count: 1432 },
    { code: 'KR', country: 'South Korea', count: 1120 },
    { code: 'GB', country: 'United Kingdom', count: 987 },
    { code: 'DE', country: 'Germany', count: 756 },
    { code: 'FR', country: 'France', count: 651 },
    { code: 'IT', country: 'Italy', count: 542 },
    { code: 'CA', country: 'Canada', count: 475 },
    { code: 'BR', country: 'Brazil', count: 423 },
    { code: 'TR', country: 'Turkey', count: 378 },
    { code: 'RU', country: 'Russia', count: 312 },
    { code: 'ES', country: 'Spain', count: 278 },
    { code: 'AU', country: 'Australia', count: 245 },
    { code: 'NL', country: 'Netherlands', count: 218 },
    { code: 'IN', country: 'India', count: 187 },
    { code: 'SE', country: 'Sweden', count: 164 }
  ];
};

/**
 * Function to search for cameras by country on Insecam
 * Inspired by the insecam.org scraper
 */
export const searchInsecamByCountry = async (
  countryCode: string,
  page: number = 1
): Promise<{
  cameras: Array<{
    id: string;
    ip: string;
    port: number;
    previewUrl: string;
    location: string;
    manufacturer?: string;
  }>;
  totalPages: number;
  currentPage: number;
}> => {
  console.log(`Searching for cameras in country: ${countryCode}, page: ${page}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data (in a real implementation, this would scrape insecam.org)
  const totalPages = Math.floor(Math.random() * 10) + 3;
  const camerasPerPage = Math.floor(Math.random() * 4) + 5;
  
  // Generate random camera data
  const cameras = Array.from({ length: camerasPerPage }).map((_, index) => {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const port = [80, 8080, 8081, 8082, 554][Math.floor(Math.random() * 5)];
    
    // Generate a placeholder image URL (in a real app, this would be the actual camera image)
    const placeholderTypes = ['buildings', 'nature', 'animals', 'people', 'architecture', 'business'];
    const placeholderImageUrl = `https://source.unsplash.com/featured/?${placeholderTypes[Math.floor(Math.random() * placeholderTypes.length)]},${Math.random()}`;
    
    // Manufacturer options
    const manufacturers = [
      'Hikvision', 'Dahua', 'Axis', 'Foscam', 'Amcrest', 
      'Reolink', 'Vivotek', 'Bosch', 'Sony', 'Samsung'
    ];
    
    // City based on country
    let cities: string[] = [];
    switch (countryCode) {
      case 'US':
        cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        break;
      case 'JP':
        cities = ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'];
        break;
      case 'GB':
        cities = ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'];
        break;
      case 'DE':
        cities = ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'];
        break;
      default:
        cities = ['Capital City', 'Major City', 'Urban Area', 'Suburb', 'Industrial Zone'];
    }
    
    return {
      id: `cam-${countryCode}-${page}-${index}`,
      ip,
      port,
      previewUrl: placeholderImageUrl,
      location: `${cities[Math.floor(Math.random() * cities.length)]}, ${getCountryName(countryCode)}`,
      manufacturer: Math.random() > 0.3 ? manufacturers[Math.floor(Math.random() * manufacturers.length)] : undefined
    };
  });
  
  return {
    cameras,
    totalPages,
    currentPage: page
  };
};

/**
 * Get country name from country code
 */
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    'US': 'United States',
    'JP': 'Japan',
    'KR': 'South Korea',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'CA': 'Canada',
    'BR': 'Brazil',
    'TR': 'Turkey',
    'RU': 'Russia',
    'ES': 'Spain',
    'AU': 'Australia',
    'NL': 'Netherlands',
    'IN': 'India',
    'SE': 'Sweden'
  };
  
  return countries[code] || code;
}

/**
 * Function to check if an IP/camera is in a vulnerability database
 * Inspired by various OSINT tools for camera security assessment
 */
export const checkVulnerabilityDatabase = async (ip: string): Promise<Array<{
  cveid: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedModels: string[];
}>> => {
  console.log(`Checking vulnerability database for IP: ${ip}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock vulnerability data
  const mockVulnerabilities = [
    {
      cveid: 'CVE-2018-10088',
      description: 'Authentication bypass vulnerability in web interface',
      severity: 'High' as const,
      affectedModels: ['Hikvision DS-2CD2xx2F-I', 'Hikvision DS-2CD2xx2F-IS']
    },
    {
      cveid: 'CVE-2017-7921',
      description: 'Backdoor account with static password',
      severity: 'Critical' as const,
      affectedModels: ['Hikvision DS-2CD2xx2F-I', 'Hikvision DS-2CD2xx2F-IS', 'Hikvision DS-2CD2xx2F-IWS']
    },
    {
      cveid: 'CVE-2019-11561',
      description: 'Stack-based buffer overflow in ONVIF service',
      severity: 'High' as const,
      affectedModels: ['Dahua IPC-HDW4XXX', 'Dahua IPC-HFW4XXX']
    },
    {
      cveid: 'CVE-2020-9529',
      description: 'Remote code execution via command injection',
      severity: 'Critical' as const,
      affectedModels: ['Foscam C1', 'Foscam C2']
    },
    {
      cveid: 'CVE-2021-32941',
      description: 'Information disclosure in web interface',
      severity: 'Medium' as const,
      affectedModels: ['Axis P13 Series', 'Axis P14 Series']
    }
  ];
  
  // Return 0-3 random vulnerabilities
  const count = Math.floor(Math.random() * 4);
  const selectedVulnerabilities = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * mockVulnerabilities.length);
    if (!selectedVulnerabilities.includes(mockVulnerabilities[randomIndex])) {
      selectedVulnerabilities.push(mockVulnerabilities[randomIndex]);
    }
  }
  
  return selectedVulnerabilities;
};

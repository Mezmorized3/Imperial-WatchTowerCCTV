
/**
 * Utility functions for handling country data
 * Includes support for Ukraine, Russia, Georgia, Romania and other countries
 */

// Country data with IP prefixes
interface CountryData {
  name: string;
  code: string;
  ipPrefixes: string[];
  cities?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Map of country data including IP prefixes
export const countryData: Record<string, CountryData> = {
  'ukraine': {
    name: 'Ukraine',
    code: 'UA',
    ipPrefixes: [
      '31.128.0.0/11',
      '37.52.0.0/14',
      '46.119.0.0/16',
      '77.120.0.0/13',
      '93.170.0.0/15',
      '95.132.0.0/14',
      '176.36.0.0/14',
      '178.92.0.0/14',
      '193.108.0.0/16',
      '194.44.0.0/16',
      '195.64.0.0/16',
      '212.26.0.0/16',
      '213.111.0.0/16'
    ],
    cities: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Donetsk', 'Zaporizhzhia'],
    coordinates: {
      latitude: 49.4871968,
      longitude: 31.2718321
    }
  },
  'russia': {
    name: 'Russia',
    code: 'RU',
    ipPrefixes: [
      '2.60.0.0/14',
      '5.136.0.0/13',
      '31.13.0.0/16',
      '37.9.0.0/16',
      '45.10.0.0/16',
      '77.37.0.0/16',
      '79.165.0.0/16',
      '85.143.0.0/16',
      '91.143.0.0/16',
      '93.170.0.0/16',
      '95.213.0.0/16',
      '176.215.0.0/16',
      '178.210.0.0/16',
      '188.130.0.0/16',
      '194.85.0.0/16',
      '195.211.0.0/16',
      '213.180.0.0/16'
    ],
    cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Omsk', 'Samara'],
    coordinates: {
      latitude: 55.7504461,
      longitude: 37.6174943
    }
  },
  'georgia': {
    name: 'Georgia',
    code: 'GE',
    ipPrefixes: [
      '31.146.0.0/16',
      '37.232.0.0/16',
      '46.49.0.0/16',
      '77.92.0.0/16',
      '82.211.0.0/16',
      '85.114.0.0/16',
      '91.151.0.0/16',
      '92.241.0.0/16',
      '94.43.0.0/16',
      '176.74.0.0/16',
      '178.134.0.0/16',
      '188.169.0.0/16',
      '212.58.0.0/16',
      '213.157.0.0/16'
    ],
    cities: ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori'],
    coordinates: {
      latitude: 41.7151377,
      longitude: 44.827096
    }
  },
  'romania': {
    name: 'Romania',
    code: 'RO',
    ipPrefixes: [
      '37.120.0.0/16',
      '46.214.0.0/16',
      '77.81.0.0/16',
      '79.112.0.0/16',
      '89.120.0.0/16',
      '109.163.0.0/16',
      '176.223.0.0/16',
      '193.231.0.0/16',
      '194.102.0.0/16',
      '195.95.0.0/16',
      '212.146.0.0/16',
      '213.157.0.0/16'
    ],
    cities: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov'],
    coordinates: {
      latitude: 44.4267674,
      longitude: 26.1025384
    }
  }
};

/**
 * Get IP prefixes for a specific country
 */
export const getIpPrefixByCountry = (country: string): string[] => {
  const countryKey = country.toLowerCase();
  return countryData[countryKey]?.ipPrefixes || [];
};

/**
 * Get full country name from country code or partial name
 */
export const getCountryName = (country: string): string => {
  const countryKey = country.toLowerCase();
  return countryData[countryKey]?.name || country;
};

/**
 * Get cities for a specific country
 */
export const getCountryCities = (country: string): string[] => {
  const countryKey = country.toLowerCase();
  return countryData[countryKey]?.cities || [];
};

/**
 * Get coordinates for a specific country
 */
export const getCountryCoordinates = (country: string): { latitude: number; longitude: number } | undefined => {
  const countryKey = country.toLowerCase();
  return countryData[countryKey]?.coordinates;
};


/**
 * Geo utilities for handling geolocation data
 */

/**
 * Generate random geolocation for an IP (for simulation)
 */
export const getRandomGeoLocation = (ip: string): Record<string, any> => {
  // Use the IP to deterministically generate a location
  const ipHash = ip.split('.').reduce((sum, num) => sum + parseInt(num), 0);
  
  // List of countries and cities
  const countries = [
    { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
    { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'] },
    { code: 'DE', name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'] },
    { code: 'FR', name: 'France', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'] },
    { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'] },
    { code: 'CA', name: 'Canada', cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'] },
    { code: 'AU', name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] }
  ];
  
  // Select a country based on the IP hash
  const country = countries[ipHash % countries.length];
  
  // Select a city based on the IP hash
  const city = country.cities[(ipHash * 31) % country.cities.length];
  
  // Generate latitude and longitude
  // These are very rough approximations for demonstration
  let lat, lon;
  
  switch (country.code) {
    case 'US':
      lat = 37 + (ipHash % 15) - 7.5;
      lon = -100 + (ipHash % 50) - 25;
      break;
    case 'GB':
      lat = 54 + (ipHash % 5) - 2.5;
      lon = -2 + (ipHash % 3) - 1.5;
      break;
    case 'DE':
      lat = 51 + (ipHash % 5) - 2.5;
      lon = 10 + (ipHash % 5) - 2.5;
      break;
    case 'FR':
      lat = 47 + (ipHash % 5) - 2.5;
      lon = 2 + (ipHash % 5) - 2.5;
      break;
    case 'JP':
      lat = 36 + (ipHash % 5) - 2.5;
      lon = 138 + (ipHash % 5) - 2.5;
      break;
    case 'CA':
      lat = 56 + (ipHash % 10) - 5;
      lon = -106 + (ipHash % 50) - 25;
      break;
    case 'AU':
      lat = -25 + (ipHash % 10) - 5;
      lon = 135 + (ipHash % 10) - 5;
      break;
    default:
      lat = (ipHash % 180) - 90;
      lon = (ipHash % 360) - 180;
  }
  
  return {
    country: country.name,
    countryCode: country.code,
    city: city,
    coordinates: [lat, lon],
    ip: ip
  };
};

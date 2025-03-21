
/**
 * Generate a random geolocation near the country associated with the IP
 */
export const getRandomGeoLocation = (ip: string): {lat: number; lng: number; accuracy: string; country: string; city: string} => {
  // Use the mock country to determine a base location
  const country = getMockCountry(ip);
  
  // Base coordinates for countries (approximate centers)
  const countryCoords: Record<string, [number, number]> = {
    'United States': [37.0902, -95.7129],
    'Germany': [51.1657, 10.4515],
    'France': [46.2276, 2.2137],
    'Netherlands': [52.1326, 5.2913],
    'United Kingdom': [55.3781, -3.4360],
    'Japan': [36.2048, 138.2529],
    'Singapore': [1.3521, 103.8198],
    'Australia': [-25.2744, 133.7751],
    'Brazil': [-14.2350, -51.9253],
    'Canada': [56.1304, -106.3468],
    'Italy': [41.8719, 12.5674],
    'Spain': [40.4637, -3.7492]
  };
  
  // Default to US if country not found
  const baseCoords = countryCoords[country] || countryCoords['United States'];
  
  // Add some randomness to the coordinates (within ~50-100km)
  const latVariation = (Math.random() - 0.5) * 0.9;
  const lngVariation = (Math.random() - 0.5) * 0.9;
  
  // Generate a random city based on the country
  const cities: Record<string, string[]> = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
    'Singapore': ['Singapore'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza']
  };
  
  // Choose a random city for the country
  const countryCity = cities[country] || cities['United States'];
  const city = countryCity[Math.floor(Math.random() * countryCity.length)];
  
  return {
    lat: baseCoords[0] + latVariation,
    lng: baseCoords[1] + lngVariation,
    accuracy: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
    country: country,
    city: city
  };
};

// Helper function
function getMockCountry(ip: string): string {
  const countries = [
    'United States',
    'Germany',
    'France',
    'Netherlands',
    'United Kingdom',
    'Japan',
    'Singapore',
    'Australia',
    'Brazil',
    'Canada',
    'Italy',
    'Spain'
  ];
  
  // Use the second octet of the IP to determine the country (for consistent mock results)
  const secondOctet = parseInt(ip.split('.')[1]);
  return countries[secondOctet % countries.length];
}

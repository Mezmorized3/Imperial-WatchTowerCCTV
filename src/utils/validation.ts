
export const isValidIPv4 = (ip: string): boolean => {
  const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return pattern.test(ip);
};

export const isValidCIDR = (cidr: string): boolean => {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  
  const ip = parts[0];
  const prefix = parseInt(parts[1], 10);
  
  return isValidIPv4(ip) && !isNaN(prefix) && prefix >= 0 && prefix <= 32;
};

export const isValidIPRange = (range: string): boolean => {
  return isValidIPv4(range) || isValidCIDR(range);
};

export const isValidShodanQuery = (query: string): boolean => {
  // Basic validation for Shodan queries
  // In a real app, this would be more complex
  return query.trim().length > 0;
};

export const isValidZoomEyeQuery = (query: string): boolean => {
  // Basic validation for ZoomEye queries
  return query.trim().length > 0;
};

export const isValidCensysQuery = (query: string): boolean => {
  // Basic validation for Censys queries
  return query.trim().length > 0;
};

export const validateScanInput = (input: string, type: 'ip' | 'range' | 'file' | 'shodan' | 'zoomeye' | 'censys'): boolean => {
  switch (type) {
    case 'ip':
      return isValidIPv4(input);
    case 'range':
      return isValidCIDR(input);
    case 'file':
      return input.trim().length > 0; // Basic check, in real app would verify file exists
    case 'shodan':
      return isValidShodanQuery(input);
    case 'zoomeye':
      return isValidZoomEyeQuery(input);
    case 'censys':
      return isValidCensysQuery(input);
    default:
      return false;
  }
};

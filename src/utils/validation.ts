
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

export const validateScanInput = (input: string, type: 'ip' | 'range' | 'file' | 'shodan' | 'zoomeye'): boolean => {
  switch (type) {
    case 'ip':
      return isValidIPv4(input);
    case 'range':
      return isValidCIDR(input);
    case 'file':
      return input.trim().length > 0; // Basic check, in real app would verify file exists
    case 'shodan':
      return input.trim().length > 0;
    case 'zoomeye':
      return input.trim().length > 0; // Basic validation for ZoomEye queries
    default:
      return false;
  }
};

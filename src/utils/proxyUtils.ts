
import { ProxyConfig } from './osintToolTypes';

/**
 * Utilities for working with proxies in OSINT and security tools
 */

/**
 * Default proxy configurations that can be used across tools
 */
export const PROXY_PRESETS = {
  TOR: {
    enabled: true,
    type: 'socks5' as const,
    host: '127.0.0.1',
    port: 9050,
    rotation: true,
    rotationInterval: 60 // seconds
  },
  PRIVOXY: {
    enabled: true,
    type: 'http' as const,
    host: '127.0.0.1',
    port: 8118
  },
  BURP: {
    enabled: true,
    type: 'http' as const,
    host: '127.0.0.1',
    port: 8080
  }
};

/**
 * Get proxy string in the format required by different tools and libraries
 * @param config Proxy configuration
 * @param format Output format (url, curl, requests, python, etc.)
 * @returns Formatted proxy string
 */
export const getProxyString = (config: ProxyConfig, format: string = 'url'): string => {
  if (!config.enabled) {
    return '';
  }

  const auth = config.username && config.password 
    ? `${config.username}:${config.password}@` 
    : '';

  const base = `${config.type}://${auth}${config.host}:${config.port}`;

  switch (format) {
    case 'url':
      return base;
    case 'curl':
      return `--proxy ${base}`;
    case 'requests':
      return base; 
    case 'python':
      return `{'${config.type}': '${config.host}:${config.port}'}`;
    case 'environment':
      return `${config.type.toUpperCase()}_PROXY=${base}`;
    default:
      return base;
  }
};

/**
 * Verify if a proxy is working by attempting a connection
 * @param config Proxy configuration to test
 * @returns Promise resolving to a boolean indicating if proxy is working
 */
export const testProxy = async (config: ProxyConfig): Promise<boolean> => {
  if (!config.enabled) {
    return false;
  }

  console.log(`Testing proxy: ${config.type}://${config.host}:${config.port}`);

  try {
    // This is a mock implementation for the frontend
    // In a real backend implementation, this would make an actual request through the proxy
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For simulation purposes, assume proxy works 80% of the time
    return Math.random() > 0.2;
  } catch (error) {
    console.error('Error testing proxy:', error);
    return false;
  }
};

/**
 * Get a new proxy from a rotation service or list
 * @param currentProxy Current proxy configuration
 * @param proxyList Optional list of proxies to rotate through
 * @returns A new proxy configuration
 */
export const rotateProxy = async (
  currentProxy: ProxyConfig,
  proxyList?: ProxyConfig[]
): Promise<ProxyConfig> => {
  if (!currentProxy.rotation || !proxyList || proxyList.length === 0) {
    return currentProxy;
  }

  console.log('Rotating proxy...');

  try {
    // Get current index
    const currentIndex = proxyList.findIndex(p => 
      p.host === currentProxy.host && p.port === currentProxy.port
    );
    
    // Get next proxy in rotation
    const nextIndex = (currentIndex + 1) % proxyList.length;
    const nextProxy = proxyList[nextIndex];
    
    return {
      ...nextProxy,
      enabled: true,
      rotation: true,
      rotationInterval: currentProxy.rotationInterval
    };
  } catch (error) {
    console.error('Error rotating proxy:', error);
    return currentProxy;
  }
};

/**
 * Get a list of available proxy servers (mock implementation)
 * In a real implementation, this might fetch from a proxy provider API
 */
export const getAvailableProxies = async (): Promise<ProxyConfig[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return some mock proxy servers
  return [
    {
      enabled: true,
      type: 'http' as const,
      host: '103.152.112.162',
      port: 80,
    },
    {
      enabled: true,
      type: 'https' as const,
      host: '45.32.101.24',
      port: 3128,
    },
    {
      enabled: true,
      type: 'socks5' as const,
      host: '192.111.139.162',
      port: 4145,
    },
    {
      enabled: true,
      type: 'socks4' as const,
      host: '72.206.181.123',
      port: 4145,
    },
    {
      enabled: true,
      type: 'http' as const,
      host: '103.125.174.35',
      port: 8080,
    },
  ];
};


import { ProxyConfig } from '../types/baseTypes';

/**
 * Utility functions for generating proxy URLs based on different proxy configurations.
 */

/**
 * Generates a proxy URL based on the provided configuration.
 * @param {ProxyConfig} config - The proxy configuration object.
 * @returns {string} The generated proxy URL.
 */
export const getProxyUrl = (config: ProxyConfig): string => {
  if (!config) return '';
  
  // Use https if force TLS is enabled for http proxies
  const protocol = config.type === 'http' && config.forceTls ? 'https' : config.type;
  const auth = config.useAuthentication && config.username && config.password 
    ? `${config.username}:${config.password}@`
    : '';
  
  return `${protocol}://${auth}${config.host}:${config.port}`;
};

/**
 * Tests if the provided proxy configuration is valid.
 * @param {ProxyConfig} config - The proxy configuration object.
 * @returns {boolean} True if the configuration is valid, false otherwise.
 */
export const isValidProxyConfig = (config: ProxyConfig): boolean => {
  if (!config) return false;
  if (!config.enabled) return true; // If proxy is not enabled, consider it valid
  
  const hasCredentials = config.useAuthentication ? !!(config.username && config.password) : true;
  
  return !!(config.host && config.port && hasCredentials);
};

/**
 * Convert a proxy object to a string format
 * @param proxyObj The proxy object with host, port and country properties
 * @returns A string representation of the proxy
 */
export const proxyToString = (proxyObj: { host: string; port: number; country?: string }): string => {
  return `${proxyObj.host}:${proxyObj.port}${proxyObj.country ? ` (${proxyObj.country})` : ''}`;
};

/**
 * Convert a list of proxy objects to an array of strings
 * @param proxyList Array of proxy objects
 * @returns Array of string representations of proxies
 */
export const proxyListToString = (proxyList: { host: string; port: number; country?: string }[]): string[] => {
  return proxyList.map(proxy => proxyToString(proxy));
};

export default {
  getProxyUrl,
  isValidProxyConfig,
  proxyToString,
  proxyListToString
};

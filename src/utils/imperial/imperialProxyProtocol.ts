import { ProxyConfig } from '../osintToolTypes';

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

export default {
  getProxyUrl,
  isValidProxyConfig
};

import { ProxyConfig } from '../osintToolTypes';

/**
 * Imperial Proxy Protocol - Enhanced security proxy handling
 * This module provides advanced proxy functionality for the Imperial Scanner
 */

interface ProxyProtocolStatus {
  active: boolean;
  type: string;
  host: string;
  port: number;
  encrypted: boolean;
  authenticated: boolean;
  lastRotation?: Date;
  externalIp?: string;
  latency?: number;
  uptime?: number;
}

interface ProxyProtocolMetrics {
  requestCount: number;
  bytesTransferred: number;
  blockedRequests: number;
  rotationCount: number;
  avgLatency: number;
  errors: {
    connectionErrors: number;
    timeoutErrors: number;
    authErrors: number;
  };
}

// Initial empty metrics
const emptyMetrics: ProxyProtocolMetrics = {
  requestCount: 0,
  bytesTransferred: 0,
  blockedRequests: 0,
  rotationCount: 0,
  avgLatency: 0,
  errors: {
    connectionErrors: 0,
    timeoutErrors: 0,
    authErrors: 0
  }
};

// Initialize with default values
let proxyStatus: ProxyProtocolStatus = {
  active: false,
  type: 'none',
  host: '',
  port: 0,
  encrypted: false,
  authenticated: false
};

let proxyMetrics: ProxyProtocolMetrics = {...emptyMetrics};
let currentProxyConfig: ProxyConfig | null = null;
let rotationTimer: NodeJS.Timeout | null = null;

/**
 * Initialize the Imperial Proxy Protocol with a proxy configuration
 */
export function initializeProxyProtocol(config: ProxyConfig): boolean {
  if (!config.enabled || !config.host || !config.port) {
    deactivateProxy();
    return false;
  }
  
  // Store the configuration
  currentProxyConfig = {...config};
  
  // Update proxy status
  proxyStatus = {
    active: true,
    type: config.type,
    host: config.host,
    port: config.port,
    encrypted: (config.type === "http" && config.forceTls) || config.type === "socks5" || config.type === "socks4" || config.type === "tor",
    authenticated: config.useAuthentication === true,
    lastRotation: new Date()
  };
  
  // Set external IP if we have one
  if (config.lastKnownExternalIp) {
    proxyStatus.externalIp = config.lastKnownExternalIp;
  }
  
  // Reset metrics when starting a new proxy session
  proxyMetrics = {...emptyMetrics};
  
  // Setup rotation if enabled
  if (config.rotationEnabled && config.proxyList && config.proxyList.length > 0) {
    setupProxyRotation(config);
  } else if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
  
  console.log(`Imperial Proxy Protocol initialized with ${config.type} proxy at ${config.host}:${config.port}`);
  return true;
}

/**
 * Setup automatic proxy rotation
 */
function setupProxyRotation(config: ProxyConfig): void {
  if (rotationTimer) {
    clearInterval(rotationTimer);
  }
  
  // Convert interval to milliseconds with a minimum of 5 seconds
  const interval = Math.max((config.rotationInterval || 300), 5) * 1000;
  
  rotationTimer = setInterval(() => {
    if (!config.proxyList || config.proxyList.length === 0) {
      return;
    }
    
    // Find the next proxy in the list
    let currentIndex = -1;
    if (proxyStatus.host && proxyStatus.port) {
      const currentProxy = `${proxyStatus.host}:${proxyStatus.port}`;
      currentIndex = config.proxyList.indexOf(currentProxy);
    }
    
    // Move to the next proxy or wrap around to the first
    const nextIndex = (currentIndex + 1) % config.proxyList.length;
    const nextProxy = config.proxyList[nextIndex];
    
    // Parse the next proxy address
    const [host, portStr] = nextProxy.split(':');
    const port = parseInt(portStr, 10);
    
    if (host && !isNaN(port)) {
      // Update configuration and status
      currentProxyConfig = {
        ...config,
        host,
        port
      };
      
      proxyStatus = {
        ...proxyStatus,
        host,
        port,
        lastRotation: new Date()
      };
      
      // Update metrics
      proxyMetrics.rotationCount++;
      
      console.log(`Imperial Proxy Protocol rotated to ${host}:${port}`);
    }
  }, interval);
  
  console.log(`Imperial Proxy Protocol rotation enabled every ${interval/1000} seconds`);
}

/**
 * Deactivate the proxy protocol
 */
export function deactivateProxy(): void {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
  
  proxyStatus = {
    active: false,
    type: 'none',
    host: '',
    port: 0,
    encrypted: false,
    authenticated: false
  };
  
  currentProxyConfig = null;
  console.log('Imperial Proxy Protocol deactivated');
}

/**
 * Get the current proxy status
 */
export function getProxyStatus(): ProxyProtocolStatus {
  return {...proxyStatus};
}

/**
 * Get proxy metrics for the current session
 */
export function getProxyMetrics(): ProxyProtocolMetrics {
  return {...proxyMetrics};
}

/**
 * Log an event to the proxy metrics
 */
export function logProxyEvent(event: 'request' | 'transfer' | 'block' | 'error', details?: any): void {
  if (!proxyStatus.active) return;
  
  switch (event) {
    case 'request':
      proxyMetrics.requestCount++;
      if (details?.latency) {
        // Update average latency
        const newAvg = ((proxyMetrics.avgLatency * (proxyMetrics.requestCount - 1)) + details.latency) / proxyMetrics.requestCount;
        proxyMetrics.avgLatency = newAvg;
        proxyStatus.latency = details.latency;
      }
      break;
    case 'transfer':
      if (details?.bytes) {
        proxyMetrics.bytesTransferred += details.bytes;
      }
      break;
    case 'block':
      proxyMetrics.blockedRequests++;
      break;
    case 'error':
      if (details?.type === 'connection') {
        proxyMetrics.errors.connectionErrors++;
      } else if (details?.type === 'timeout') {
        proxyMetrics.errors.timeoutErrors++;
      } else if (details?.type === 'auth') {
        proxyMetrics.errors.authErrors++;
      }
      break;
  }
}

/**
 * Create a proxy agent for HTTP/HTTPS requests
 */
export function createProxyAgent(): any {
  if (!proxyStatus.active || !currentProxyConfig) {
    return null;
  }
  
  // This would actually create a proxy agent using http-proxy-agent, https-proxy-agent,
  // or socks-proxy-agent based on the type, but for the browser environment
  // we're just returning a simulation
  
  return {
    type: proxyStatus.type,
    host: proxyStatus.host,
    port: proxyStatus.port,
    auth: proxyStatus.authenticated ? 
      `${currentProxyConfig.username}:${currentProxyConfig.password}` : undefined
  };
}

/**
 * Update external IP information for the current proxy
 */
export function updateExternalIpInfo(ip: string): void {
  if (proxyStatus.active) {
    proxyStatus.externalIp = ip;
    
    // Store in the current config for persistence
    if (currentProxyConfig) {
      currentProxyConfig.lastKnownExternalIp = ip;
    }
  }
}

/**
 * Check if a request should go through the proxy
 * This allows for selective proxying based on rules
 */
export function shouldProxyRequest(url: string, options?: { bypassProxy?: boolean }): boolean {
  if (!proxyStatus.active || options?.bypassProxy) {
    return false;
  }
  
  // Add filtering logic here if needed
  // For example, exclude local addresses
  if (/^(127\.0\.0\.1|localhost|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(url)) {
    return false;
  }
  
  return true;
}

/**
 * Get a proxy URL string for the current proxy
 */
export function getProxyUrl(): string | null {
  if (!proxyStatus.active) {
    return null;
  }
  
  let auth = '';
  if (proxyStatus.authenticated && currentProxyConfig?.username && currentProxyConfig?.password) {
    auth = `${encodeURIComponent(currentProxyConfig.username)}:${encodeURIComponent(currentProxyConfig.password)}@`;
  }
  
  return `${proxyStatus.type}://${auth}${proxyStatus.host}:${proxyStatus.port}`;
}

/**
 * Get the current proxy configuration
 */
export function getCurrentProxyConfig(): ProxyConfig | null {
  return currentProxyConfig ? {...currentProxyConfig} : null;
}

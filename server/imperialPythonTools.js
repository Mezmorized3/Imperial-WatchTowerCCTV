
/**
 * Imperial Python Tools Integration
 * 
 * This module provides integration with various Python-based OSINT and camera scanning tools.
 * It creates a bridge between the Imperial Server and Python tools from various repositories.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const winston = require('winston');

// Configure logging for Python tool integration
const pythonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'imperial-python-tools.log', maxSize: 10485760 }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Base directory for Python tools
const TOOLS_DIR = path.join(__dirname, 'python_tools');
const CACHE_DIR = path.join(__dirname, 'results_cache');

// Ensure directories exist
if (!fs.existsSync(TOOLS_DIR)) {
  fs.mkdirSync(TOOLS_DIR, { recursive: true });
}

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Tool configurations
const TOOL_CONFIGS = {
  sherlock: {
    path: path.join(TOOLS_DIR, 'sherlock', 'sherlock'),
    args: (username) => ['--timeout', '10', '--print-found', username],
    processOutput: (output) => {
      // Extract results from Sherlock output
      const results = [];
      const lines = output.split('\n');
      
      for (const line of lines) {
        if (line.includes('[+]')) {
          const parts = line.split('[+]')[1].trim().split(' - ');
          if (parts.length >= 2) {
            results.push({
              platform: parts[0].trim(),
              url: parts[1].trim(),
              exists: true
            });
          }
        }
      }
      
      return { results };
    }
  },
  
  cameradar: {
    path: path.join(TOOLS_DIR, 'cameradar'),
    args: (target, options = {}) => ['--target', target, '--ports', options.ports || '554,8554', '--speed', '4'],
    processOutput: (output) => {
      // Parse Cameradar JSON output
      try {
        return JSON.parse(output);
      } catch (e) {
        pythonLogger.error('Failed to parse Cameradar output', { error: e.message, output });
        return { streams: [] };
      }
    }
  },
  
  ipcamsearch: {
    path: path.join(TOOLS_DIR, 'ipcam_search_protocol'),
    args: (subnet, protocols = []) => ['--subnet', subnet, '--protocols', (protocols.join(',') || 'all')],
    processOutput: (output) => {
      // Parse IP camera search protocol output
      const devices = [];
      const lines = output.split('\n');
      
      for (const line of lines) {
        if (line.includes('Found device at')) {
          const ip = line.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)?.[0];
          const protocol = line.match(/protocol: (\w+)/)?.[1] || 'Unknown';
          
          if (ip) {
            devices.push({
              ip,
              protocol,
              port: line.match(/port: (\d+)/)?.[1] || '80',
              manufacturer: line.match(/manufacturer: ([^,]+)/)?.[1] || 'Unknown'
            });
          }
        }
      }
      
      return { devices };
    }
  },
  
  webcheck: {
    path: path.join(TOOLS_DIR, 'web-check'),
    args: (url) => ['--url', url, '--no-browser', '--output', 'json'],
    processOutput: (output) => {
      // Parse web-check JSON output
      try {
        return JSON.parse(output);
      } catch (e) {
        pythonLogger.error('Failed to parse web-check output', { error: e.message });
        return {};
      }
    }
  }
};

/**
 * Main function to run a Python tool with the given parameters
 */
async function runPythonTool(toolName, params = {}) {
  const toolConfig = TOOL_CONFIGS[toolName];
  
  if (!toolConfig) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  // Check if the tool directory exists
  if (!fs.existsSync(toolConfig.path)) {
    pythonLogger.warn(`Tool not found at ${toolConfig.path}. Using simulated data.`);
    return simulateToolOutput(toolName, params);
  }
  
  return new Promise((resolve, reject) => {
    let args;
    
    // Generate arguments based on the tool and params
    switch (toolName) {
      case 'sherlock':
        args = toolConfig.args(params.username);
        break;
      case 'cameradar':
        args = toolConfig.args(params.target, { ports: params.ports });
        break;
      case 'ipcamsearch':
        args = toolConfig.args(params.subnet, params.protocols);
        break;
      case 'webcheck':
        args = toolConfig.args(params.url);
        break;
      default:
        reject(new Error(`Tool ${toolName} exists but has no argument configuration`));
        return;
    }
    
    pythonLogger.info(`Executing ${toolName}`, { args });
    
    // Some tools use Python, some are binary executables
    const isPythonScript = toolName === 'sherlock';
    const command = isPythonScript ? 'python' : toolConfig.path;
    const commandArgs = isPythonScript ? [toolConfig.path, ...args] : args;
    
    // Execute the command
    const process = spawn(command, commandArgs);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        pythonLogger.error(`Tool ${toolName} exited with code ${code}`, { stderr });
        // Still return simulated data if the tool fails
        resolve(simulateToolOutput(toolName, params));
        return;
      }
      
      try {
        const result = toolConfig.processOutput(stdout);
        resolve(result);
      } catch (error) {
        pythonLogger.error(`Error processing ${toolName} output`, { error: error.message });
        reject(error);
      }
    });
    
    process.on('error', (error) => {
      pythonLogger.error(`Failed to start ${toolName}`, { error: error.message });
      // Return simulated data if the tool fails to start
      resolve(simulateToolOutput(toolName, params));
    });
  });
}

/**
 * Generate simulated output for when the tools aren't installed
 */
function simulateToolOutput(toolName, params) {
  pythonLogger.info(`Simulating output for ${toolName}`, { params });
  
  switch (toolName) {
    case 'sherlock':
      return generateSimulatedSherlockResults(params.username);
    case 'cameradar':
      return generateSimulatedCameradarResults(params.target);
    case 'ipcamsearch':
      return generateSimulatedIPCamResults(params.subnet, params.protocols);
    case 'webcheck':
      return generateSimulatedWebCheckResults(params.url);
    default:
      return { error: 'Unknown tool', simulated: true };
  }
}

/**
 * Simulate Sherlock username search results
 */
function generateSimulatedSherlockResults(username) {
  const platforms = [
    'Twitter', 'Instagram', 'Facebook', 'GitHub', 'Reddit', 'YouTube',
    'Pinterest', 'LinkedIn', 'Spotify', 'TikTok', 'Twitch', 'Medium'
  ];
  
  const results = platforms.map(platform => {
    const exists = Math.random() > 0.5;
    let url;
    
    switch (platform) {
      case 'Twitter':
        url = `https://twitter.com/${username}`;
        break;
      case 'Instagram':
        url = `https://instagram.com/${username}`;
        break;
      case 'Facebook':
        url = `https://facebook.com/${username}`;
        break;
      case 'GitHub':
        url = `https://github.com/${username}`;
        break;
      case 'Reddit':
        url = `https://reddit.com/user/${username}`;
        break;
      case 'YouTube':
        url = `https://youtube.com/@${username}`;
        break;
      case 'Pinterest':
        url = `https://pinterest.com/${username}`;
        break;
      case 'LinkedIn':
        url = `https://linkedin.com/in/${username}`;
        break;
      case 'Spotify':
        url = `https://open.spotify.com/user/${username}`;
        break;
      case 'TikTok':
        url = `https://tiktok.com/@${username}`;
        break;
      case 'Twitch':
        url = `https://twitch.tv/${username}`;
        break;
      case 'Medium':
        url = `https://medium.com/@${username}`;
        break;
      default:
        url = `https://${platform.toLowerCase()}.com/${username}`;
    }
    
    return {
      platform,
      url,
      exists,
      username
    };
  });
  
  return { results, simulated: true };
}

/**
 * Simulate Cameradar RTSP stream discovery results
 */
function generateSimulatedCameradarResults(target) {
  const ipParts = target.split('.');
  const baseIP = ipParts.slice(0, 3).join('.');
  
  const numResults = Math.floor(Math.random() * 5) + 1;
  const streams = [];
  
  const routes = [
    '/live/ch00_0',
    '/h264/ch1/main/av_stream',
    '/cam/realmonitor?channel=1&subtype=0',
    '/live/main',
    '/videostream.asf',
    '/mpeg4',
    '/live.sdp'
  ];
  
  for (let i = 0; i < numResults; i++) {
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    const ip = `${baseIP}.${lastOctet}`;
    const route = routes[Math.floor(Math.random() * routes.length)];
    
    streams.push({
      address: ip,
      port: 554,
      route,
      service_name: 'rtspd',
      device_type: ['Hikvision', 'Dahua', 'Axis', 'Sony'][Math.floor(Math.random() * 4)],
      credentials: Math.random() > 0.7 ? {
        username: 'admin',
        password: ['admin', '12345', 'password', ''][Math.floor(Math.random() * 4)]
      } : null
    });
  }
  
  return { streams, simulated: true };
}

/**
 * Simulate IP camera discovery results
 */
function generateSimulatedIPCamResults(subnet, protocols) {
  const baseIP = subnet.split('/')[0];
  const ipParts = baseIP.split('.');
  const baseIPPrefix = ipParts.slice(0, 3).join('.');
  
  const numDevices = Math.floor(Math.random() * 8) + 1;
  const devices = [];
  
  // Default to all protocols if none specified
  const protocolsList = protocols.length > 0 ? protocols : ['ONVIF', 'Hikvision', 'Dahua', 'RTSP'];
  
  for (let i = 0; i < numDevices; i++) {
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    const ip = `${baseIPPrefix}.${lastOctet}`;
    const protocol = protocolsList[Math.floor(Math.random() * protocolsList.length)];
    
    // Port depends on the protocol
    let port;
    switch (protocol) {
      case 'ONVIF':
        port = 80;
        break;
      case 'Hikvision':
        port = 8000;
        break;
      case 'Dahua':
        port = 37777;
        break;
      case 'RTSP':
        port = 554;
        break;
      default:
        port = 80;
    }
    
    // Generate manufacturer based on protocol
    let manufacturer;
    if (protocol === 'Hikvision') {
      manufacturer = 'Hikvision';
    } else if (protocol === 'Dahua') {
      manufacturer = 'Dahua';
    } else {
      manufacturer = ['Axis', 'Bosch', 'Sony', 'Samsung'][Math.floor(Math.random() * 4)];
    }
    
    devices.push({
      ip,
      port,
      protocol,
      manufacturer,
      model: `${manufacturer}-${Math.floor(Math.random() * 1000)}`,
      accessible: Math.random() > 0.3,
    });
  }
  
  return { devices, subnet, simulated: true };
}

/**
 * Simulate web-check results
 */
function generateSimulatedWebCheckResults(url) {
  // Extract domain from URL
  let domain = url.replace(/^https?:\/\//, '').split('/')[0];
  
  return {
    url,
    domain,
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    headers: {
      'server': ['nginx', 'apache', 'cloudflare', 'microsoft-iis'][Math.floor(Math.random() * 4)],
      'content-type': 'text/html; charset=UTF-8',
      'x-powered-by': Math.random() > 0.5 ? 'PHP/7.4' : undefined,
      'strict-transport-security': Math.random() > 0.5 ? 'max-age=31536000; includeSubDomains' : undefined
    },
    technologies: [
      'NGINX', 'jQuery', 'Google Analytics', 'Bootstrap',
      'WordPress', 'React', 'Font Awesome', 'PHP'
    ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 1),
    security: {
      https: Math.random() > 0.2,
      hsts: Math.random() > 0.5,
      xssProtection: Math.random() > 0.6,
      csp: Math.random() > 0.7,
      cookieSecure: Math.random() > 0.5
    },
    dns: [
      { type: 'A', value: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
      { type: 'MX', value: `mail.${domain}` },
      { type: 'TXT', value: 'v=spf1 include:_spf.google.com ~all' },
      { type: 'NS', value: `ns1.${domain.split('.')[1]}.com` }
    ],
    simulated: true
  };
}

module.exports = {
  runPythonTool
};

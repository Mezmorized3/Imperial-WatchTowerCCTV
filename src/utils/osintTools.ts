
/**
 * OSINT Tools Utilities
 * 
 * This file provides functions for executing various OSINT tools.
 * In development mode, it simulates results for testing without actual tools.
 * In production, it would connect to server-side implementations.
 */

import { imperialOsintService } from './imperial/osintService';
import { toast } from "sonner";

// Helper to simulate delay in development mode
const simulateDelay = async (ms = 1500) => {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Common function to execute a tool with fallback to simulated data
const executeTool = async (
  toolName: string, 
  params: any,
  simulatedDataFn: () => any
): Promise<any> => {
  try {
    // In development, we can simulate responses
    if (process.env.NODE_ENV !== 'production') {
      await simulateDelay();
      const data = simulatedDataFn();
      data.simulatedData = true;
      return data;
    }
    
    // In production, we would call the actual tool
    const method = `execute${toolName}` as keyof typeof imperialOsintService;
    
    if (typeof imperialOsintService[method] === 'function') {
      return await (imperialOsintService[method] as Function)(params);
    } else {
      return await imperialOsintService.executeOsintTool(toolName.toLowerCase(), params);
    }
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    toast.error(`Failed to execute ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// WebHack Tool
export const executeWebHack = async (params: {
  url: string;
  scanType: 'basic' | 'full';
  findVulnerabilities?: boolean;
  checkHeaders?: boolean;
  testXss?: boolean;
  testSql?: boolean;
}) => {
  return executeTool('WebHack', params, () => {
    // Simulate web vulnerabilities
    const vulnerabilities = params.findVulnerabilities ? [
      {
        name: 'Cross-Site Scripting (XSS)',
        severity: params.testXss ? 'high' : 'medium',
        path: '/search?q=test',
        details: 'User input is reflected without sanitization'
      },
      {
        name: 'Missing Security Headers',
        severity: 'medium',
        path: '/',
        details: 'Content-Security-Policy header is missing'
      },
      params.testSql ? {
        name: 'SQL Injection',
        severity: 'critical',
        path: '/product?id=1',
        details: 'Parameter "id" appears to be vulnerable to SQL injection'
      } : null,
      {
        name: 'Cross-Site Request Forgery (CSRF)',
        severity: 'medium',
        path: '/account/settings',
        details: 'No CSRF tokens implemented on forms'
      }
    ].filter(Boolean) : [];

    // Simulate security headers
    const headers = params.checkHeaders ? {
      'Content-Security-Policy': null,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': params.scanType === 'full' ? 'max-age=31536000; includeSubDomains' : null,
      'Referrer-Policy': 'no-referrer-when-downgrade',
      'Permissions-Policy': null
    } : {};

    return {
      url: params.url,
      scanType: params.scanType,
      scanDate: new Date().toISOString(),
      vulnerabilities,
      headers,
      serverInfo: params.scanType === 'full' ? {
        server: 'nginx/1.18.0',
        technologies: ['PHP/7.4.3', 'WordPress/5.8.1', 'jQuery/1.12.4']
      } : null
    };
  });
};

// TorBot Tool
export const executeTorBot = async (params: {
  url: string;
  scanType?: 'basic' | 'deep';
  checkLive?: boolean;
  findMail?: boolean;
  saveCrawl?: boolean;
}) => {
  return executeTool('TorBot', params, () => {
    // Generate random .onion links
    const generateOnionLinks = (count: number) => {
      const links = [];
      for (let i = 0; i < count; i++) {
        const rnd = Math.random().toString(36).substring(2, 12);
        links.push(`http://${rnd}.onion`);
      }
      return links;
    };

    // Generate random emails if enabled
    const emails = params.findMail ? [
      'hidden@darkweb.onion',
      'admin@secretservice.onion',
      'contact@anonymous.onion',
      'sales@marketplace.onion'
    ] : [];

    return {
      url: params.url,
      scanType: params.scanType || 'basic',
      scanDate: new Date().toISOString(),
      links: generateOnionLinks(params.scanType === 'deep' ? 15 : 7),
      emails: emails,
      liveLinks: params.checkLive ? Math.floor(Math.random() * 5) + 2 : null
    };
  });
};

// Photon Web Crawler
export const executePhoton = async (params: {
  url: string;
  depth?: number;
  timeout?: number;
  findSecrets?: boolean;
  findKeys?: boolean;
}) => {
  return executeTool('Photon', params, () => {
    // Generate random links
    const generateLinks = (count: number) => {
      const domain = new URL(params.url).hostname;
      const paths = [
        'about', 'contact', 'services', 'blog', 'products', 
        'faq', 'support', 'login', 'register', 'careers',
        'privacy', 'terms', 'sitemap', 'gallery', 'events'
      ];
      
      return Array.from({ length: count }, () => {
        const path = paths[Math.floor(Math.random() * paths.length)];
        const subpath = Math.random() > 0.5 ? `/${Math.random().toString(36).substring(2, 6)}` : '';
        return `https://${domain}/${path}${subpath}`;
      });
    };

    // Generate random emails
    const generateEmails = (count: number) => {
      const domain = new URL(params.url).hostname;
      const names = ['info', 'contact', 'support', 'admin', 'sales', 'marketing', 'help', 'webmaster', 'jobs'];
      
      return Array.from({ length: count }, () => {
        const name = names[Math.floor(Math.random() * names.length)];
        return `${name}@${domain}`;
      });
    };

    // Generate secrets if enabled
    const secrets = (params.findSecrets || params.findKeys) ? [
      { type: 'API Key', value: 'AIzaSyD8X2RxSKU1vqNIaLRFMRm4aP3JX9Cxxyk' },
      { type: 'AWS Key', value: 'AKIAIOSFODNN7EXAMPLE' },
      { type: 'Password', value: 'db_password=admin123' }
    ] : [];

    return {
      url: params.url,
      depth: params.depth || 2,
      scanDate: new Date().toISOString(),
      links: generateLinks((params.depth || 2) * 10),
      emails: generateEmails(Math.floor(Math.random() * 5) + 2),
      secrets: secrets,
      assets: {
        images: Math.floor(Math.random() * 25) + 10,
        scripts: Math.floor(Math.random() * 15) + 5,
        stylesheets: Math.floor(Math.random() * 8) + 3
      }
    };
  });
};

// Twint Twitter Intelligence Tool
export const executeTwint = async (params: {
  username?: string;
  search?: string;
  since?: string;
  until?: string;
  limit?: number;
  verified?: boolean;
}) => {
  return executeTool('Twint', params, () => {
    // Generate fake tweets
    const generateTweets = (count: number) => {
      const tweets = [];
      const now = new Date();
      
      const tweetTexts = [
        "Just published a new blog post about security. Check it out!",
        "Looking forward to speaking at the upcoming conference #infosec",
        "New vulnerability discovered in popular software. Update ASAP.",
        "Working on a new tool for network security. Stay tuned!",
        "Great discussion today about zero trust architecture.",
        "Security is not a product, but a process.",
        "The most secure system is the one that doesn't exist.",
        "The S in IoT stands for Security 😂",
        "Just fixed that bug that was driving everyone crazy.",
        "Remember to update your passwords regularly!"
      ];
      
      for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        tweets.push({
          id: `1${Math.floor(Math.random() * 1000000000)}`,
          username: params.username || 'security_expert',
          text: tweetTexts[Math.floor(Math.random() * tweetTexts.length)],
          date: date.toISOString(),
          retweets: Math.floor(Math.random() * 200),
          likes: Math.floor(Math.random() * 500),
          verified: params.verified ? true : Math.random() > 0.5
        });
      }
      
      return tweets;
    };

    return {
      query: params.username ? `@${params.username}` : params.search,
      scanDate: new Date().toISOString(),
      tweets: generateTweets(params.limit || 10),
      stats: {
        total: params.limit || 10,
        verified: params.verified ? params.limit || 10 : Math.floor((params.limit || 10) / 2)
      }
    };
  });
};

// BotExploits for IoT device discovery
export const executeBotExploits = async (params: {
  target: string;
  scanType?: string;
  timeout?: number;
  ports?: number[];
}) => {
  return executeTool('BotExploits', params, () => {
    // Generate fake IoT devices
    const generateDevices = () => {
      const deviceCount = Math.floor(Math.random() * 5) + 1;
      const devices = [];
      
      const deviceTypes = [
        { type: 'IP Camera', manufacturer: 'Hikvision' },
        { type: 'IP Camera', manufacturer: 'Dahua' },
        { type: 'Smart Hub', manufacturer: 'Samsung' },
        { type: 'IoT Gateway', manufacturer: 'Cisco' },
        { type: 'Smart Thermostat', manufacturer: 'Nest' },
        { type: 'Security System', manufacturer: 'Honeywell' },
        { type: 'IP Camera', manufacturer: 'Axis' },
        { type: 'Router', manufacturer: 'TP-Link' }
      ];
      
      const vulnerabilities = [
        { name: 'Default Credentials', severity: 'high' },
        { name: 'Outdated Firmware', severity: 'medium' },
        { name: 'Exposed Services', severity: 'medium' },
        { name: 'Unauthenticated Access', severity: 'high' },
        { name: 'Command Injection', severity: 'critical' },
        { name: 'Insecure Cloud API', severity: 'high' }
      ];
      
      for (let i = 0; i < deviceCount; i++) {
        const ipParts = params.target.split('.');
        const lastOctet = Math.floor(Math.random() * 254) + 1;
        const ip = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${lastOctet}`;
        
        const deviceInfo = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
        const deviceVulns = [];
        
        // Add 0-3 vulnerabilities
        const vulnCount = Math.floor(Math.random() * 3);
        for (let j = 0; j < vulnCount; j++) {
          deviceVulns.push(vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)]);
        }
        
        // Generate random open ports
        const ports = [];
        const commonPorts = [21, 22, 23, 80, 443, 554, 1883, 8080];
        const portCount = Math.floor(Math.random() * 5) + 1;
        
        for (let j = 0; j < portCount; j++) {
          ports.push(commonPorts[Math.floor(Math.random() * commonPorts.length)]);
        }
        
        devices.push({
          ip,
          type: deviceInfo.type,
          manufacturer: deviceInfo.manufacturer,
          model: `${deviceInfo.manufacturer}-${Math.floor(Math.random() * 1000)}`,
          ports: [...new Set(ports)],
          vulnerabilities: deviceVulns.length > 0 ? deviceVulns : undefined,
          firmware: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
        });
      }
      
      return devices;
    };

    const devices = generateDevices();

    return {
      target: params.target,
      scanType: params.scanType || 'passive',
      scanDate: new Date().toISOString(),
      devicesFound: devices.length,
      devices
    };
  });
};

// Execute Speed Camera detection
export const executeSpeedCamera = async (params: {
  source: string;
  motionThreshold?: number;
  fps?: number;
  mode?: string;
}) => {
  return executeTool('SpeedCamera', params, () => {
    // Simulate motion events
    const generateMotionEvents = (count: number) => {
      const events = [];
      const now = new Date();
      
      for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
        
        events.push({
          id: `motion-${Date.now()}-${i}`,
          timestamp: date.toISOString(),
          speed: Math.floor(Math.random() * 30) + 5, // mph or kph
          direction: ['incoming', 'outgoing'][Math.floor(Math.random() * 2)],
          objectType: ['person', 'vehicle', 'animal', 'unknown'][Math.floor(Math.random() * 4)],
          confidence: Math.floor(Math.random() * 30) + 70,
          boundingBox: {
            x: Math.floor(Math.random() * 800),
            y: Math.floor(Math.random() * 600),
            width: Math.floor(Math.random() * 200) + 50,
            height: Math.floor(Math.random() * 200) + 50
          }
        });
      }
      
      return events;
    };

    return {
      source: params.source,
      mode: params.mode || 'standard',
      fps: params.fps || 10,
      threshold: params.motionThreshold || 25,
      scanDate: new Date().toISOString(),
      status: 'active',
      motionEvents: generateMotionEvents(Math.floor(Math.random() * 10) + 3),
      statistics: {
        averageSpeed: Math.floor(Math.random() * 20) + 10,
        peakActivity: '18:00-19:00',
        sensitivityLevel: params.motionThreshold ? 
          params.motionThreshold > 30 ? 'low' : params.motionThreshold > 15 ? 'medium' : 'high' 
          : 'medium'
      }
    };
  });
};

// Execute CCTV Tool Suite
export const executeCCTV = async (params: {
  target: string;
  mode: string;
  scanDepth?: string;
  timeout?: number;
}) => {
  return executeTool('CCTV', params, () => {
    // Generate results based on mode
    const generateCredentials = () => {
      const usernames = ['admin', 'root', 'user', 'operator', 'service'];
      const passwords = ['admin', 'password', '12345', 'default', ''];
      
      return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        username: usernames[Math.floor(Math.random() * usernames.length)],
        password: passwords[Math.floor(Math.random() * passwords.length)],
        success: Math.random() > 0.3
      }));
    };

    const generateExploits = () => {
      return [
        {
          name: 'CVE-2018-12680',
          type: 'Authentication Bypass',
          success: Math.random() > 0.5,
          details: 'Bypass authentication through malformed HTTP request'
        },
        {
          name: 'CVE-2019-10225',
          type: 'Command Injection',
          success: Math.random() > 0.5,
          details: 'Command injection in web interface'
        },
        {
          name: 'Firmware Extraction',
          type: 'Data Exfiltration',
          success: Math.random() > 0.7,
          details: 'Downloaded and extracted firmware for analysis'
        }
      ].filter(() => Math.random() > 0.3);
    };

    let result;
    switch (params.mode) {
      case 'bruteforce':
        result = {
          credentials: generateCredentials(),
          attempts: Math.floor(Math.random() * 50) + 10,
          timeElapsed: `${Math.floor(Math.random() * 60) + 10}s`
        };
        break;
      case 'exploit':
        result = {
          exploits: generateExploits(),
          attempts: Math.floor(Math.random() * 10) + 1
        };
        break;
      case 'firmware':
        result = {
          firmwareVersion: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          extracted: Math.random() > 0.3,
          vulnerabilities: Math.floor(Math.random() * 5) + 1,
          components: ['Busybox', 'OpenSSL', 'uClibc', 'RTSP Server'].filter(() => Math.random() > 0.3)
        };
        break;
      default:
        result = {
          credentials: generateCredentials(),
          exploits: generateExploits()
        };
    }

    return {
      target: params.target,
      mode: params.mode,
      scanDate: new Date().toISOString(),
      scanDepth: params.scanDepth || 'medium',
      result
    };
  });
};

// Execute Camerattack Tool
export const executeCamerattack = async (params: {
  target: string;
  mode: string;
  timeout?: number;
  advanced?: boolean;
}) => {
  return executeTool('Camerattack', params, () => {
    // Generate attack results based on mode
    let result;
    switch (params.mode) {
      case 'dos':
        result = {
          attackType: 'Denial of Service',
          success: Math.random() > 0.3,
          timeToDisable: `${Math.floor(Math.random() * 60) + 5}s`,
          packetsRequired: Math.floor(Math.random() * 10000) + 1000
        };
        break;
      case 'hijack':
        result = {
          attackType: 'Stream Hijacking',
          success: Math.random() > 0.5,
          streamAccess: Math.random() > 0.5,
          controlAccess: Math.random() > 0.7
        };
        break;
      case 'replay':
        result = {
          attackType: 'Video Replay',
          success: Math.random() > 0.4,
          capturedFrames: Math.floor(Math.random() * 500) + 100,
          replayDuration: `${Math.floor(Math.random() * 60) + 10}s`
        };
        break;
      default:
        result = {
          attackType: 'Reconnaissance',
          openPorts: [80, 443, 554].filter(() => Math.random() > 0.3),
          vulnerabilities: Math.floor(Math.random() * 3)
        };
    }

    if (params.advanced) {
      result.advancedTechniques = {
        packetForging: Math.random() > 0.5,
        encryptionBypass: Math.random() > 0.7,
        firmwareAnalysis: Math.random() > 0.6
      };
    }

    return {
      target: params.target,
      mode: params.mode,
      timestamp: new Date().toISOString(),
      result
    };
  });
};

// Execute OSINT Suite
export const executeOSINT = async (params: {
  target: string;
  mode: string;
  depth?: string;
  scope?: string[];
}) => {
  return executeTool('OSINT', params, () => {
    // Generate comprehensive OSINT results
    const generateEmailAddresses = () => {
      const domain = params.target.includes('@') ? params.target.split('@')[1] : 
        params.target.includes('.') ? params.target : 'example.com';
      
      const names = ['info', 'contact', 'admin', 'support', 'sales', 'security', 'webmaster'];
      return names.filter(() => Math.random() > 0.3).map(name => `${name}@${domain}`);
    };

    const generateSocialProfiles = () => {
      const platforms = ['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'GitHub', 'YouTube'];
      const username = params.target.includes('@') ? params.target.split('@')[0] : 
        params.target.includes('.') ? params.target.split('.')[0] : 'user123';
      
      return platforms.filter(() => Math.random() > 0.4).map(platform => ({
        platform,
        username: username,
        url: `https://${platform.toLowerCase()}.com/${username}`,
        verified: Math.random() > 0.7
      }));
    };

    const generateDomainInfo = () => {
      const domain = params.target.includes('@') ? params.target.split('@')[1] : 
        params.target.includes('.') ? params.target : 'example.com';
      
      return {
        domain,
        registrar: ['GoDaddy', 'Namecheap', 'Google Domains', 'Amazon Route 53'][Math.floor(Math.random() * 4)],
        created: `${2010 + Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        expires: `${2023 + Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        nameservers: ['ns1.hosting.com', 'ns2.hosting.com'].filter(() => Math.random() > 0.3)
      };
    };

    // Build result based on mode and scope
    const result: Record<string, any> = {};
    
    if (params.mode === 'person' || params.scope?.includes('email')) {
      result.emails = generateEmailAddresses();
    }
    
    if (params.mode === 'person' || params.scope?.includes('social')) {
      result.socialProfiles = generateSocialProfiles();
    }
    
    if (params.mode === 'domain' || params.scope?.includes('domain')) {
      result.domainInfo = generateDomainInfo();
    }
    
    if (params.mode === 'comprehensive' || params.scope?.includes('breaches')) {
      result.breaches = Math.floor(Math.random() * 3);
    }

    return {
      target: params.target,
      mode: params.mode,
      timestamp: new Date().toISOString(),
      depth: params.depth || 'medium',
      scope: params.scope || ['all'],
      result
    };
  });
};

// Execute Shield AI
export const executeShieldAI = async (params: {
  target: string;
  mode: string;
  depth?: string;
  aiModel?: string;
}) => {
  return executeTool('ShieldAI', params, () => {
    // Generate AI-powered security analysis
    const generateVulnerabilityAssessment = () => {
      const categories = ['Authentication', 'Encryption', 'Access Control', 'Data Validation', 'Configuration'];
      const assessments = [];
      
      for (const category of categories) {
        if (Math.random() > 0.3) {
          assessments.push({
            category,
            riskLevel: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
            confidenceScore: Math.floor(Math.random() * 30) + 70,
            recommendations: Math.floor(Math.random() * 3) + 1
          });
        }
      }
      
      return assessments;
    };

    const generateAnomalyDetection = () => {
      return {
        anomaliesDetected: Math.floor(Math.random() * 5),
        baselineVariance: Math.floor(Math.random() * 20) + 5,
        falsePositiveRate: Math.random() * 0.1,
        monitoringPeriod: `${Math.floor(Math.random() * 24) + 1} hours`
      };
    };

    const generateNetworkAnalysis = () => {
      return {
        deviceCount: Math.floor(Math.random() * 50) + 5,
        unusualConnections: Math.floor(Math.random() * 3),
        encryptedTraffic: `${Math.floor(Math.random() * 60) + 40}%`,
        externalConnections: Math.floor(Math.random() * 10) + 2
      };
    };

    // Build result based on mode
    let result;
    switch (params.mode) {
      case 'vulnerability':
        result = {
          vulnerabilityAssessment: generateVulnerabilityAssessment(),
          overallRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          remediationTimeEstimate: `${Math.floor(Math.random() * 40) + 5} hours`
        };
        break;
      case 'anomaly':
        result = {
          anomalyDetection: generateAnomalyDetection(),
          potentialThreats: Math.floor(Math.random() * 3)
        };
        break;
      case 'network':
        result = {
          networkAnalysis: generateNetworkAnalysis()
        };
        break;
      default:
        result = {
          vulnerabilityAssessment: generateVulnerabilityAssessment(),
          anomalyDetection: generateAnomalyDetection(),
          networkAnalysis: generateNetworkAnalysis()
        };
    }

    return {
      target: params.target,
      mode: params.mode,
      timestamp: new Date().toISOString(),
      aiModel: params.aiModel || 'ShieldCore-v2',
      result
    };
  });
};

// Execute BackHack
export const executeBackHack = async (params: {
  target: string;
  scanType: string;
  depth?: string;
  timeout?: number;
}) => {
  return executeTool('BackHack', params, () => {
    // Generate backend system analysis
    const generateEndpoints = () => {
      const endpoints = [
        '/api/users', '/api/products', '/api/auth/login', '/api/admin',
        '/api/orders', '/api/settings', '/api/search', '/api/profile'
      ];
      
      return endpoints.filter(() => Math.random() > 0.5).map(endpoint => ({
        path: endpoint,
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        authenticated: Math.random() > 0.5,
        vulnerabilities: Math.random() > 0.7 ? ['Injection', 'IDOR', 'Rate Limiting'][Math.floor(Math.random() * 3)] : null
      }));
    };

    const generateDatabases = () => {
      const types = ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch'];
      return types.filter(() => Math.random() > 0.6).map(type => ({
        type,
        version: `${Math.floor(Math.random() * 5) + 5}.${Math.floor(Math.random() * 10)}`,
        exposed: Math.random() > 0.8,
        tables: Math.floor(Math.random() * 20) + 5
      }));
    };

    // Build result based on scan type
    let result;
    switch (params.scanType) {
      case 'api':
        result = {
          endpoints: generateEndpoints(),
          authMechanism: ['JWT', 'OAuth', 'Session', 'Basic'][Math.floor(Math.random() * 4)],
          weaknesses: Math.floor(Math.random() * 3)
        };
        break;
      case 'database':
        result = {
          databases: generateDatabases(),
          backupFiles: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
        };
        break;
      case 'framework':
        result = {
          framework: ['Laravel', 'Django', 'Express', 'Spring', 'Ruby on Rails'][Math.floor(Math.random() * 5)],
          version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          outdated: Math.random() > 0.5,
          knownVulnerabilities: Math.floor(Math.random() * 5)
        };
        break;
      default:
        result = {
          endpoints: generateEndpoints(),
          databases: generateDatabases(),
          framework: ['Laravel', 'Django', 'Express', 'Spring', 'Ruby on Rails'][Math.floor(Math.random() * 5)]
        };
    }

    return {
      target: params.target,
      scanType: params.scanType,
      timestamp: new Date().toISOString(),
      depth: params.depth || 'medium',
      result
    };
  });
};

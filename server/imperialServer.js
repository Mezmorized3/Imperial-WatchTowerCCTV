
/**
 * Imperial Server for Security Camera Scanner
 * This server provides backend functionality for the scanner application.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createTerminus } = require('@godaddy/terminus');
const http = require('http');
const https = require('https');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const minimist = require('minimist');
const { spawn, exec } = require('child_process');
const NodeMediaServer = require('node-media-server');
const ffmpeg = require('fluent-ffmpeg');
const config = require('./config.json');

// Parse command line arguments
const args = minimist(process.argv.slice(2));

// Set up logging
const logger = winston.createLogger({
  level: args['log-level'] || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'imperial-server.log' })
  ]
});

// Security level configuration
const securityLevel = args['security-level'] || 'normal';
logger.info(`Starting Imperial Server with security level: ${securityLevel}`);

// Create Express app for the main API
const app = express();

// Apply basic security middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', /\.yourdomain\.com$/] 
    : '*'
}));

// Rate limiting setup
const rateLimit = require('express-rate-limit');
const rateLimitOptions = {
  windowMs: securityLevel === 'max' ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5 or 15 minutes
  max: securityLevel === 'max' ? 50 : 100, // Limit each IP to 50 or 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
};

app.use('/v1/api/', rateLimit(rateLimitOptions));

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.adminToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Token generation endpoint
app.post('/v1/auth/token', (req, res) => {
  const { username, password } = req.body;
  
  // In a real implementation, validate against a secure user database
  if (username === 'admin' && password === 'imperial-scanner-password') {
    const token = jwt.sign(
      { username, role: 'admin' },
      config.adminToken,
      { expiresIn: config.securitySettings.tokenExpiration || '24h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// API Routes
app.get('/v1/api/status', authenticate, (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    securityLevel,
    timestamp: new Date().toISOString()
  });
});

// OSINT Tools API
app.post('/v1/api/osint/:tool', authenticate, async (req, res) => {
  const { tool } = req.params;
  const params = req.body;
  
  logger.info(`Executing OSINT tool: ${tool}`, { params });
  
  try {
    // This would dispatch to the appropriate OSINT tool based on the tool name
    // For now, we'll just return a placeholder response
    executeOsintTool(tool, params)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        logger.error(`Error executing ${tool}:`, error);
        res.status(500).json({ error: `Failed to execute ${tool}` });
      });
  } catch (error) {
    logger.error(`Error in OSINT API:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to execute OSINT tools with actual tool implementations
async function executeOsintTool(toolName, params) {
  // Map of tool names to their execution functions
  const toolExecutors = {
    'cameradar': executeCameradar,
    'ipcamsearch': executeIpCamSearch,
    'sherlock': executeSherlock,
    'webcheck': executeWebCheck,
    // Add more tools as needed
  };
  
  if (!toolExecutors[toolName]) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  return toolExecutors[toolName](params);
}

// Example implementation of Cameradar execution
async function executeCameradar(params) {
  const { target, scanType } = params;
  
  return new Promise((resolve, reject) => {
    // Build command for cameradar
    const args = ['-t', target];
    if (scanType) args.push('-s', scanType);
    
    const process = spawn('cameradar', args);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse output and return results
          resolve({
            success: true,
            data: parseCommandOutput(output, 'cameradar')
          });
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`cameradar exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// Example implementation of IP Camera Search execution
async function executeIpCamSearch(params) {
  const { subnet, protocols } = params;
  
  return new Promise((resolve, reject) => {
    // Build command for ipcam_search
    const args = ['-s', subnet];
    if (protocols && protocols.length > 0) {
      protocols.forEach(protocol => {
        args.push('-p', protocol);
      });
    }
    
    const process = spawn('ipcam_search', args);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse output and return results
          resolve({
            success: true,
            data: parseCommandOutput(output, 'ipcam_search')
          });
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`ipcam_search exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// Example implementation of Sherlock execution
async function executeSherlock(params) {
  const { username } = params;
  
  return new Promise((resolve, reject) => {
    // Build command for sherlock
    const process = spawn('python3', ['-m', 'sherlock', username]);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse sherlock output
          const sites = output.split('\n')
            .filter(line => line.includes('[+]') || line.includes('[X]'))
            .map(line => {
              const found = line.includes('[+]');
              const site = found 
                ? line.split('[+]')[1].trim().split(':')[0].trim()
                : line.split('[X]')[1].trim().split(':')[0].trim();
              
              return {
                name: site,
                found,
                url: found ? `https://${site.toLowerCase()}.com/${username}` : undefined
              };
            });
          
          resolve({
            success: true,
            data: {
              sites,
              totalFound: sites.filter(s => s.found).length
            }
          });
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`sherlock exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// Example implementation of Web Check execution
async function executeWebCheck(params) {
  const { domain } = params;
  
  return new Promise((resolve, reject) => {
    // Use the web-check tool from GitHub
    exec(`npx @lissy93/web-check ${domain}`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`web-check failed: ${stderr || error.message}`));
        return;
      }
      
      try {
        // Attempt to parse JSON output or return raw output
        let data = stdout;
        try {
          data = JSON.parse(stdout);
        } catch (parseError) {
          // If parsing fails, use the raw output
        }
        
        resolve({
          success: true,
          data
        });
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

// Helper function to parse command output based on tool
function parseCommandOutput(output, tool) {
  switch (tool) {
    case 'cameradar':
      try {
        // This assumes cameradar outputs JSON
        return JSON.parse(output);
      } catch (error) {
        // If not JSON, parse the text output
        const cameras = output.split('\n')
          .filter(line => line.includes('rtsp://'))
          .map((line, index) => {
            const match = line.match(/rtsp:\/\/([^:]+):(\d+)(\/[^:]+)?/);
            return match ? {
              id: `cam-${index}`,
              ip: match[1],
              port: parseInt(match[2], 10),
              path: match[3] || '/',
              status: 'discovered'
            } : null;
          })
          .filter(Boolean);
        
        return { cameras, total: cameras.length };
      }
    
    case 'ipcam_search':
      // Parse ipcam_search output format
      const cameras = output.split('\n')
        .filter(line => line.includes('Camera found:'))
        .map((line, index) => {
          const match = line.match(/Camera found: ([0-9.]+)(?::(\d+))?/);
          return match ? {
            id: `ipcam-${index}`,
            ip: match[1],
            port: match[2] ? parseInt(match[2], 10) : 80,
            status: 'online'
          } : null;
        })
        .filter(Boolean);
      
      return { cameras, total: cameras.length };
    
    default:
      // Default parser for simple output
      return { output };
  }
}

// Camera Conversion Service
// This service offers RTSP to HLS conversion using FFmpeg
app.post('/v1/api/stream/convert', authenticate, (req, res) => {
  const { rtspUrl, outputPath } = req.body;
  
  if (!rtspUrl) {
    return res.status(400).json({ error: 'RTSP URL is required' });
  }
  
  // Generate a unique output path if none provided
  const uniqueOutputPath = outputPath || `output/streams/${Date.now()}/stream.m3u8`;
  
  // Ensure output directory exists
  const outputDir = path.dirname(uniqueOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Setup FFmpeg conversion
  ffmpeg(rtspUrl)
    .outputOptions([
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-hls_time', '4',
      '-hls_list_size', '10',
      '-hls_flags', 'delete_segments',
      '-f', 'hls'
    ])
    .output(uniqueOutputPath)
    .on('start', () => {
      logger.info(`Starting RTSP to HLS conversion: ${rtspUrl} -> ${uniqueOutputPath}`);
      
      // Return immediately with the output path
      res.json({
        success: true,
        outputPath: uniqueOutputPath,
        accessUrl: `/streams/${path.basename(outputDir)}/stream.m3u8`
      });
    })
    .on('error', (err) => {
      logger.error(`FFmpeg error: ${err.message}`);
    })
    .run();
});

// Media Server for HLS streaming
const mediaServerConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'
      }
    ]
  }
};

const mediaServer = new NodeMediaServer(mediaServerConfig);
mediaServer.run();

// Start HTTP server
const httpServer = http.createServer(app);

// Configure graceful shutdown
createTerminus(httpServer, {
  signal: 'SIGINT',
  healthChecks: {
    '/healthcheck': async () => {
      // Add db or other dependency checks here
      return { status: 'ok' };
    }
  },
  onSignal: async () => {
    logger.info('Server is shutting down');
    // Clean up resources, close connections
    mediaServer.stop();
  },
  onShutdown: async () => {
    logger.info('Cleanup completed, server is shut down');
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  logger.info(`🔒 Imperial Server running on port ${PORT}`);
});

// If HTTPS is enabled in config, start HTTPS server
if (config.useHttps && config.sslOptions.keyPath && config.sslOptions.certPath) {
  try {
    const sslOptions = {
      key: fs.readFileSync(config.sslOptions.keyPath),
      cert: fs.readFileSync(config.sslOptions.certPath)
    };
    
    const httpsServer = https.createServer(sslOptions, app);
    const HTTPS_PORT = process.env.HTTPS_PORT || 5443;
    
    // Configure graceful shutdown for HTTPS
    createTerminus(httpsServer, {
      signal: 'SIGINT',
      onSignal: async () => {
        logger.info('HTTPS Server is shutting down');
      }
    });
    
    httpsServer.listen(HTTPS_PORT, () => {
      logger.info(`🔐 Imperial Server HTTPS running on port ${HTTPS_PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start HTTPS server:', error);
  }
}

// Export for testing
module.exports = app;

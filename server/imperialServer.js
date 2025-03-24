
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
const bodyParser = require('body-parser');
const config = require('./config.json');
const morgan = require('morgan');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');

// Import Redis if available
let redis;
let redisClient;
try {
  redis = require('redis');
  if (config.vassalServices?.redis?.enabled) {
    redisClient = redis.createClient({
      url: `redis://${config.vassalServices.redis.password ? 
        `${config.vassalServices.redis.password}@` : ''}${config.vassalServices.redis.host}:${config.vassalServices.redis.port}`
    });
    redisClient.connect().catch(err => {
      console.error('Redis connection error:', err);
    });
  }
} catch (error) {
  console.warn('Redis not available:', error.message);
}

// Import Sentry if available
let Sentry;
try {
  if (config.vassalServices?.sentry?.enabled && config.vassalServices.sentry.dsn) {
    Sentry = require('@sentry/node');
    const Tracing = require('@sentry/tracing');
    
    Sentry.init({
      dsn: config.vassalServices.sentry.dsn,
      environment: config.vassalServices.sentry.environment || 'production',
      tracesSampleRate: config.vassalServices.sentry.tracesSampleRate || 0.2,
    });
  }
} catch (error) {
  console.warn('Sentry not available:', error.message);
}

// Parse command line arguments
const args = minimist(process.argv.slice(2));

// Set up logging
const logger = winston.createLogger({
  level: args['log-level'] || config.logConfig?.level || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: path.join(config.logConfig?.directory || './logs', 'imperial-server.log') 
    })
  ]
});

// Create logs directory if it doesn't exist
if (!fs.existsSync(config.logConfig?.directory || './logs')) {
  fs.mkdirSync(config.logConfig?.directory || './logs', { recursive: true });
}

// Security level configuration
const securityLevel = args['security-level'] || 'normal';
logger.info(`Starting Imperial Server with security level: ${securityLevel}`);

// Create Express app for the main API
const app = express();

// Apply security middleware
app.use(helmet());
app.use(compression()); // Add compression for better performance
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// CORS Configuration for Chrome Extension integration
app.use(cors({
  origin: config.chromeExtension?.allowedOrigins || [
    'chrome-extension://imperial-scanner-extension',
    'https://imperial-command-center.example'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['X-Imperial-Seal', 'Content-Type', 'Authorization']
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

// Token blacklist for auth
const tokenBlacklist = new Set();

// Function to maintain token blacklist
const maintainTokenBlacklist = async () => {
  if (redisClient) {
    try {
      // Use Redis for token blacklist if available
      const keys = await redisClient.keys('blacklist:*');
      for (const key of keys) {
        const ttl = await redisClient.ttl(key);
        if (ttl <= 0) {
          await redisClient.del(key);
        }
      }
    } catch (error) {
      logger.error('Error maintaining Redis token blacklist:', error);
    }
  } else {
    // Use in-memory blacklist if Redis not available
    // Nothing to do in this case, as we don't have expiration on the Set
  }
};

// Run maintenance periodically
setInterval(maintainTokenBlacklist, 3600000); // Every hour

// Tool paths configuration
let toolPaths = {};
try {
  if (fs.existsSync(path.join(__dirname, '..', '.toolpaths'))) {
    const toolPathsContent = fs.readFileSync(path.join(__dirname, '..', '.toolpaths'), 'utf8');
    toolPaths = JSON.parse(toolPathsContent);
    logger.info('Loaded tool paths configuration');
  } else {
    logger.warn('No .toolpaths file found, using default paths');
  }
} catch (error) {
  logger.error('Error loading tool paths:', error);
}

// Get the path for a specific tool
function getToolPath(toolName) {
  if (toolPaths[toolName]) {
    return toolPaths[toolName];
  }
  
  // Default paths based on common installations
  const defaultPaths = {
    cameradar: process.platform === 'win32' ? 'cameradar.exe' : 'cameradar',
    sherlock: process.platform === 'win32' ? 'python sherlock.py' : 'python3 sherlock.py',
    ffmpeg: process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg',
    ffprobe: process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe',
    webcheck: 'npx @lissy93/web-check',
    twint: process.platform === 'win32' ? 'python twint.py' : 'python3 twint.py'
  };
  
  return defaultPaths[toolName] || toolName;
}

// Input sanitization utility functions
const sanitizeInput = {
  target: (input) => {
    if (!/^[0-9a-zA-Z\.\-_\/\:]+$/.test(input)) {
      throw new Error('Royal Guard: Invalid target format!');
    }
    return input;
  },
  
  ipAddress: (input) => {
    if (!/^[0-9.\/]+$/.test(input)) {
      throw new Error('Royal Guard: Invalid IP address format!');
    }
    return input;
  },
  
  command: (input, allowedCommands) => {
    if (!allowedCommands.includes(input)) {
      throw new Error(`Royal Guard: Command not allowed! Permitted: ${allowedCommands.join(', ')}`);
    }
    return input;
  },
  
  numeric: (input) => {
    if (!/^\d+$/.test(input)) {
      throw new Error('Royal Guard: Input must be numeric!');
    }
    return input;
  }
};

// Authentication middleware with token blacklist check
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Check if token is in blacklist
    if (redisClient) {
      // Use Redis for blacklist checking
      redisClient.get(`blacklist:${token}`)
        .then(result => {
          if (result) {
            return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
          }
          
          // Verify the token
          const decoded = jwt.verify(token, config.adminToken, {
            jwtid: uuidv4() // Add JTI for blacklisting
          });
          req.user = decoded;
          next();
        })
        .catch(err => {
          logger.error('Redis blacklist check error:', err);
          return res.status(500).json({ error: 'Internal server error during authentication' });
        });
    } else {
      // Use in-memory blacklist
      if (tokenBlacklist.has(token)) {
        return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
      }
      
      // Verify the token
      const decoded = jwt.verify(token, config.adminToken);
      req.user = decoded;
      next();
    }
  } catch (error) {
    logger.warn('Authentication error:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Authentication endpoints
app.post('/v1/api/auth', (req, res) => {
  const { token } = req.body;
  
  // Check if the provided token matches the configured admin token
  if (token === config.adminToken) {
    // Create a JWT token with a JTI
    const jti = uuidv4();
    const jwtToken = jwt.sign(
      { role: 'admin', jti },
      config.adminToken,
      { 
        expiresIn: config.securitySettings.tokenExpiration || '24h',
        jwtid: jti
      }
    );
    
    logger.info('Successful authentication');
    res.json({ 
      success: true, 
      token: jwtToken,
      message: 'Authentication successful' 
    });
  } else {
    logger.warn('Failed authentication attempt');
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
});

// Logout endpoint - blacklist the token
app.post('/v1/api/logout', authenticate, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const jti = req.user.jti;
  
  try {
    if (redisClient) {
      // Add to Redis blacklist with expiry
      await redisClient.set(
        `blacklist:${token}`, 
        '1',
        { EX: config.securitySettings.tokenBlacklistExpiry || 86400 }
      );
    } else {
      // Add to in-memory blacklist
      tokenBlacklist.add(token);
    }
    
    logger.info(`Token blacklisted: ${jti}`);
    res.json({ message: 'Scepter withdrawn' });
  } catch (error) {
    logger.error('Error blacklisting token:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Basic status endpoint with Imperial branding (non-authenticated)
app.get('/v1/status', (req, res) => {
  res.json({
    realm: "Imperial Surveillance Network",
    motto: "Sic Parvis Magna",
    version: "Reign of Edward VII",
    provinces: ["Optical", "Network", "Social"],
    heraldry: "🦅⚔️📜",
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes (authenticated)
app.get('/v1/api/status', authenticate, (req, res) => {
  res.json({
    realm: "Imperial Surveillance Network",
    status: 'operational',
    version: "Reign of Edward VII",
    securityLevel,
    timestamp: new Date().toISOString(),
    availableTools: Object.keys(toolPaths)
  });
});

// Create media directories if they don't exist
const mediaRoot = config.mediaServerSettings?.mediaRoot || './media';
if (!fs.existsSync(mediaRoot)) {
  fs.mkdirSync(mediaRoot, { recursive: true });
  fs.mkdirSync(path.join(mediaRoot, 'streams'), { recursive: true });
  fs.mkdirSync(path.join(mediaRoot, 'recordings'), { recursive: true });
}

// OSINT Tools API
app.post('/v1/api/osint/:tool', authenticate, async (req, res) => {
  const { tool } = req.params;
  const params = req.body;
  
  try {
    // Sanitize input based on tool type
    if (tool === 'cameradar') {
      params.target = sanitizeInput.ipAddress(params.target);
    } else if (tool.includes('ipcam')) {
      params.subnet = sanitizeInput.ipAddress(params.subnet);
    } else if (['webcheck', 'sherlock', 'twint'].includes(tool)) {
      params.target = sanitizeInput.target(params.target);
    }
    
    logger.info(`Executing OSINT tool: ${tool}`, { params });
    
    // Dispatch to the appropriate OSINT tool based on the tool name
    executeOsintTool(tool, params)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        logger.error(`Error executing ${tool}:`, error);
        res.status(500).json({ error: `Failed to execute ${tool}: ${error.message}` });
      });
  } catch (error) {
    logger.error(`Error in OSINT API:`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
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
    'twint': executeTwint,
    'ffmpeg': executeFFmpeg
    // Add more tools as needed
  };
  
  if (!toolExecutors[toolName]) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  return toolExecutors[toolName](params);
}

// Implementation of Cameradar execution with input sanitization
async function executeCameradar(params) {
  const { target, scanType } = params;
  
  // Use the sanitization utility
  const sanitizedTarget = sanitizeInput.ipAddress(target);
  
  return new Promise((resolve, reject) => {
    // Build command for cameradar
    const args = ['-t', sanitizedTarget];
    if (scanType) args.push('-s', scanType);
    
    const toolPath = getToolPath('cameradar');
    logger.info(`Executing ${toolPath} ${args.join(' ')}`);
    
    // Use appropriate method to run the command (spawn for long-running processes)
    const process = spawn(toolPath, args);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      logger.debug(`Cameradar output: ${dataStr}`);
    });
    
    process.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
      logger.error(`Cameradar error: ${dataStr}`);
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

// Implementation of IP Camera Search execution
async function executeIpCamSearch(params) {
  const { subnet, protocols } = params;
  
  // Sanitize subnet
  const sanitizedSubnet = sanitizeInput.ipAddress(subnet);
  
  return new Promise((resolve, reject) => {
    // Build command for ipcam_search
    const args = ['-s', sanitizedSubnet];
    if (protocols && protocols.length > 0) {
      protocols.forEach(protocol => {
        args.push('-p', protocol);
      });
    }
    
    const toolPath = getToolPath('ipcam_search');
    logger.info(`Executing ${toolPath} ${args.join(' ')}`);
    
    const process = spawn(toolPath, args);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      logger.debug(`IP Cam Search output: ${dataStr}`);
    });
    
    process.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
      logger.error(`IP Cam Search error: ${dataStr}`);
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

// Implementation of Sherlock execution
async function executeSherlock(params) {
  const { username } = params;
  
  // Sanitize username
  const sanitizedUsername = sanitizeInput.target(username);
  
  return new Promise((resolve, reject) => {
    // Build command for sherlock
    const toolPath = getToolPath('sherlock');
    const cmdParts = toolPath.split(' ');
    const command = cmdParts[0];
    const commandArgs = [...cmdParts.slice(1), sanitizedUsername];
    
    logger.info(`Executing ${toolPath} ${sanitizedUsername}`);
    
    const process = spawn(command, commandArgs);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      logger.debug(`Sherlock output: ${dataStr}`);
    });
    
    process.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
      logger.error(`Sherlock error: ${dataStr}`);
    });
    
    process.on('close', (code) => {
      if (code === 0 || code === null) {
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
                url: found ? `https://${site.toLowerCase()}.com/${sanitizedUsername}` : undefined
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
          logger.error('Error parsing Sherlock output:', error);
          reject(error);
        }
      } else {
        reject(new Error(`sherlock exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// Implementation of Web Check execution
async function executeWebCheck(params) {
  const { domain } = params;
  
  // Sanitize domain
  const sanitizedDomain = sanitizeInput.target(domain);
  
  return new Promise((resolve, reject) => {
    // Use the web-check tool from GitHub
    const toolPath = getToolPath('webcheck');
    logger.info(`Executing ${toolPath} ${sanitizedDomain}`);
    
    exec(`${toolPath} ${sanitizedDomain}`, (error, stdout, stderr) => {
      if (error && !stdout) {
        logger.error(`Web Check error: ${stderr || error.message}`);
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
          logger.warn('Could not parse Web Check output as JSON, using raw output');
        }
        
        resolve({
          success: true,
          data
        });
      } catch (parseError) {
        logger.error('Error processing Web Check output:', parseError);
        reject(parseError);
      }
    });
  });
}

// Implementation of Twint execution
async function executeTwint(params) {
  const { username, search, limit } = params;
  
  // Sanitize inputs
  const sanitizedUsername = username ? sanitizeInput.target(username) : null;
  const sanitizedSearch = search ? sanitizeInput.target(search) : null;
  const sanitizedLimit = limit ? sanitizeInput.numeric(limit.toString()) : null;
  
  return new Promise((resolve, reject) => {
    // Build command for twint
    const args = [];
    if (sanitizedUsername) args.push('-u', sanitizedUsername);
    if (sanitizedSearch) args.push('-s', sanitizedSearch);
    if (sanitizedLimit) args.push('-l', sanitizedLimit);
    args.push('--json'); // Output in JSON format
    
    const toolPath = getToolPath('twint');
    const cmdParts = toolPath.split(' ');
    const command = cmdParts[0];
    const commandArgs = [...cmdParts.slice(1), ...args];
    
    logger.info(`Executing ${toolPath} ${args.join(' ')}`);
    
    const process = spawn(command, commandArgs);
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      logger.debug(`Twint output: ${dataStr}`);
    });
    
    process.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
      logger.error(`Twint error: ${dataStr}`);
    });
    
    process.on('close', (code) => {
      if (code === 0 || code === null) {
        try {
          // Parse output as JSON
          const tweets = output.split('\n')
            .filter(line => line.trim())
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean);
          
          resolve({
            success: true,
            data: {
              username: sanitizedUsername,
              search: sanitizedSearch,
              tweets,
              total: tweets.length
            }
          });
        } catch (error) {
          logger.error('Error parsing Twint output:', error);
          reject(error);
        }
      } else {
        reject(new Error(`twint exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// Implementation of FFmpeg execution
async function executeFFmpeg(params) {
  const { input, output, videoCodec, audioCodec, options } = params;
  
  // Sanitize input
  const sanitizedInput = sanitizeInput.target(input);
  
  return new Promise((resolve, reject) => {
    if (!sanitizedInput) {
      reject(new Error('Input parameter is required'));
      return;
    }
    
    const outputPath = output || `${mediaRoot}/output_${Date.now()}.mp4`;
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    logger.info(`Starting FFmpeg: ${sanitizedInput} -> ${outputPath}`);
    
    const ffmpegCommand = ffmpeg(sanitizedInput);
    
    if (videoCodec) ffmpegCommand.videoCodec(videoCodec);
    if (audioCodec) ffmpegCommand.audioCodec(audioCodec);
    
    // Add additional options if provided
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        ffmpegCommand.addOption(`-${key}`, value);
      });
    }
    
    ffmpegCommand
      .output(outputPath)
      .on('start', (commandLine) => {
        logger.info(`FFmpeg started with command: ${commandLine}`);
      })
      .on('progress', (progress) => {
        logger.debug(`FFmpeg progress: ${JSON.stringify(progress)}`);
      })
      .on('end', () => {
        logger.info('FFmpeg processing finished');
        resolve({
          success: true,
          data: {
            outputPath,
            command: 'FFmpeg',
            output: 'Processing completed successfully'
          }
        });
      })
      .on('error', (err, stdout, stderr) => {
        logger.error(`FFmpeg error: ${err.message}`);
        logger.error(`FFmpeg stderr: ${stderr}`);
        reject(new Error(`FFmpeg failed: ${err.message}`));
      })
      .run();
  });
}

// Helper function to parse command output based on tool
function parseCommandOutput(output, tool) {
  switch (tool) {
    case 'cameradar':
      try {
        // Try to parse as JSON first
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
  
  try {
    if (!rtspUrl) {
      return res.status(400).json({ error: 'RTSP URL is required' });
    }
    
    // Sanitize RTSP URL
    const sanitizedRtspUrl = sanitizeInput.target(rtspUrl);
    
    // Generate a unique output path if none provided
    const streamId = Date.now().toString();
    const uniqueOutputDir = path.join(mediaRoot, 'streams', streamId);
    const uniqueOutputPath = outputPath || path.join(uniqueOutputDir, 'stream.m3u8');
    
    // Ensure output directory exists
    if (!fs.existsSync(uniqueOutputDir)) {
      fs.mkdirSync(uniqueOutputDir, { recursive: true });
    }
    
    // Setup FFmpeg conversion
    logger.info(`Starting RTSP to HLS conversion: ${sanitizedRtspUrl} -> ${uniqueOutputPath}`);
    
    ffmpeg(sanitizedRtspUrl)
      .outputOptions([
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-hls_time', '4',
        '-hls_list_size', '10',
        '-hls_flags', 'delete_segments',
        '-f', 'hls'
      ])
      .output(uniqueOutputPath)
      .on('start', (commandLine) => {
        logger.info(`FFmpeg started: ${commandLine}`);
        
        // Return immediately with the output path
        res.json({
          success: true,
          streamId,
          outputPath: uniqueOutputPath,
          accessUrl: `/streams/${streamId}/stream.m3u8`
        });
      })
      .on('error', (err) => {
        logger.error(`FFmpeg error: ${err.message}`);
        // Note: Response already sent, can't send error to client
      })
      .run();
  } catch (error) {
    logger.error(`Stream conversion error:`, error);
    res.status(400).json({ error: error.message || 'Invalid request parameters' });
  }
});

// Recording endpoints
app.post('/v1/api/stream/record/start', authenticate, (req, res) => {
  const { streamUrl, duration } = req.body;
  
  try {
    if (!streamUrl) {
      return res.status(400).json({ error: 'Stream URL is required' });
    }
    
    // Sanitize stream URL
    const sanitizedStreamUrl = sanitizeInput.target(streamUrl);
    
    const recordingId = Date.now().toString();
    const outputPath = path.join(mediaRoot, 'recordings', `recording_${recordingId}.mp4`);
    
    // Ensure recordings directory exists
    const recordingsDir = path.join(mediaRoot, 'recordings');
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }
    
    // Check if we need to purge old recordings
    purgeOldRecordings();
    
    logger.info(`Starting recording: ${sanitizedStreamUrl} -> ${outputPath}`);
    
    // Start recording
    const ffmpegCmd = ffmpeg(sanitizedStreamUrl)
      .outputOptions([
        '-c:v', 'copy',
        '-c:a', 'copy'
      ]);
    
    // Add duration limit if specified
    if (duration) {
      ffmpegCmd.duration(duration);
    }
    
    ffmpegCmd
      .output(outputPath)
      .on('start', (commandLine) => {
        logger.info(`Recording started: ${commandLine}`);
        
        // Store recording process info
        activeRecordings[recordingId] = {
          streamUrl: sanitizedStreamUrl,
          outputPath,
          startTime: Date.now(),
          duration: duration || null,
          command: ffmpegCmd
        };
        
        res.json({
          success: true,
          recordingId,
          outputPath,
          message: `Recording started: ${recordingId}`
        });
      })
      .on('end', () => {
        logger.info(`Recording completed: ${recordingId}`);
        delete activeRecordings[recordingId];
      })
      .on('error', (err) => {
        logger.error(`Recording error (${recordingId}): ${err.message}`);
        delete activeRecordings[recordingId];
      })
      .run();
  } catch (error) {
    logger.error(`Recording start error:`, error);
    res.status(400).json({ error: error.message || 'Invalid request parameters' });
  }
});

// Purge old recordings to manage storage
const purgeOldRecordings = () => {
  const recordingsDir = path.join(mediaRoot, 'recordings');
  const MAX_RECORDINGS = config.mediaServerSettings?.maxRecordings || 100;
  
  try {
    if (fs.existsSync(recordingsDir)) {
      const files = fs.readdirSync(recordingsDir)
        .filter(file => file.endsWith('.mp4'))
        .map(file => {
          const filePath = path.join(recordingsDir, file);
          const stats = fs.statSync(filePath);
          return { file, path: filePath, ctime: stats.ctime.getTime() };
        })
        .sort((a, b) => b.ctime - a.ctime); // Sort by creation time, newest first
      
      // Delete files beyond the maximum limit
      if (files.length > MAX_RECORDINGS) {
        files.slice(MAX_RECORDINGS).forEach(file => {
          try {
            fs.unlinkSync(file.path);
            logger.info(`Purged old recording: ${file.file}`);
          } catch (err) {
            logger.error(`Error purging recording ${file.file}:`, err);
          }
        });
      }
    }
  } catch (error) {
    logger.error('Error purging old recordings:', error);
  }
};

// Store active recordings
const activeRecordings = {};

// Stop recording endpoint
app.post('/v1/api/stream/record/stop', authenticate, (req, res) => {
  const { recordingId } = req.body;
  
  if (!recordingId || !activeRecordings[recordingId]) {
    return res.status(404).json({ error: 'Recording not found' });
  }
  
  logger.info(`Stopping recording: ${recordingId}`);
  
  const recording = activeRecordings[recordingId];
  
  try {
    // Kill the FFmpeg process
    recording.command.kill('SIGKILL');
    
    res.json({
      success: true,
      recordingId,
      outputPath: recording.outputPath,
      duration: (Date.now() - recording.startTime) / 1000,
      message: `Recording stopped: ${recordingId}`
    });
    
    delete activeRecordings[recordingId];
  } catch (error) {
    logger.error(`Error stopping recording ${recordingId}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to stop recording: ${error.message}`
    });
  }
});

// List recordings endpoint
app.get('/v1/api/stream/recordings', authenticate, (req, res) => {
  const recordingsDir = path.join(mediaRoot, 'recordings');
  
  try {
    // List files in the recordings directory
    const files = fs.readdirSync(recordingsDir)
      .filter(file => file.endsWith('.mp4'))
      .map(file => {
        const filePath = path.join(recordingsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: filePath,
          size: stats.size,
          created: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created); // Sort by date, newest first
    
    // Add any active recordings
    const activeRecordingsList = Object.entries(activeRecordings).map(([id, recording]) => ({
      recordingId: id,
      filename: path.basename(recording.outputPath),
      path: recording.outputPath,
      streamUrl: recording.streamUrl,
      active: true,
      duration: recording.duration,
      elapsedTime: (Date.now() - recording.startTime) / 1000
    }));
    
    res.json({
      success: true,
      activeRecordings: activeRecordingsList,
      completedRecordings: files,
      total: activeRecordingsList.length + files.length
    });
  } catch (error) {
    logger.error('Error listing recordings:', error);
    res.status(500).json({
      success: false,
      error: `Failed to list recordings: ${error.message}`
    });
  }
});

// Serve static files from the media directory
app.use('/media', express.static(mediaRoot));

// Media Server for HLS streaming
const mediaServerConfig = {
  rtmp: {
    port: config.mediaServerSettings?.rtmpPort || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: config.mediaServerSettings?.httpPort || 8000,
    allow_origin: '*',
    mediaroot: mediaRoot
  },
  trans: {
    ffmpeg: config.mediaServerSettings?.ffmpegPath || 'ffmpeg',
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
    
    // Close Redis connection if it exists
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
    
    // Stop all active recordings
    Object.values(activeRecordings).forEach(recording => {
      try {
        recording.command.kill('SIGKILL');
      } catch (error) {
        logger.error('Error stopping recording during shutdown:', error);
      }
    });
    
    // Clean up resources, close connections
    mediaServer.stop();
  },
  onShutdown: async () => {
    logger.info('Cleanup completed, server is shut down');
  }
});

// Start the server
const PORT = process.env.PORT || config.ports['5001'] || 5001;
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

// Handle Chrome extension messages
app.post('/v1/api/extension/message', (req, res) => {
  const { command, data } = req.body;
  
  logger.info(`Received extension message: ${command}`);
  
  switch (command) {
    case 'sanctify':
      // Handle authentication request from extension
      const { token } = data;
      if (token === config.adminToken) {
        res.json({
          success: true,
          message: 'Extension sanctified'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid imperial token'
        });
      }
      break;
    
    default:
      res.status(400).json({
        success: false,
        message: 'Unknown command'
      });
  }
});

// Export for testing
module.exports = app;

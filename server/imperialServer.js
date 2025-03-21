/**
 * Imperial Server – Enhanced Edition (Final)
 *
 * Features:
 * - Dynamic configuration loaded from config.json
 * - Enhanced monitoring with Prometheus (including latency and error counters)
 * - JWT-based authentication middleware for administrative endpoints
 * - Graceful degradation & auto-recovery (via cluster and robust error handling)
 * - Distributed tracing (using jaeger-client as an example)
 * - HTTPS support (loading certificates from files)
 * - API versioning (all endpoints under /v1)
 * - Administrative dashboard (React app served on port 8080)
 * - Modular design for further CI/CD integration and automated testing
 * - Python tools integration for OSINT and camera discovery
 */

const express = require('express');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const prom = require('prom-client');
const winston = require('winston');
const session = require('express-session');
const { createTerminus } = require('@godaddy/terminus');
const minimist = require('minimist');
const jwt = require('jsonwebtoken');  // For admin authentication
const fs = require('fs');
const https = require('https');
const { spawn } = require('child_process');
const cors = require('cors');  // Add CORS support for API access

// Import the Python tools integration
const pythonTools = require('./imperialPythonTools');

// Optional: Distributed tracing (using jaeger-client as an example)
const initTracer = require('jaeger-client').initTracer;

// Load dynamic configuration (config.json should be in the same directory)
const config = require('./config.json');

// COMMANDER OF FLAGS
const argv = minimist(process.argv.slice(2));
const securityLevel = argv['security-level'] || 'normal';
const encryption = argv['encryption'] || 'standard';

// Use configuration from config.json or defaults
const PORTS_TO_MANAGE = config.ports || {
  8080: 'Main web application (React app)',
  8000: 'Ticker HTML server',
  5000: 'SocketIO/ticker server',
  5001: 'Control panel API server',
  3000: 'HLS Restream Server'
};

const ROYAL_COURT_PORT = config.royalCourtPort || 7443; // Administrative endpoints
const SESSION_SECRET = crypto.randomBytes(64).toString('hex');
const CLUSTER_ENABLED = true;
const FAILURE_THRESHOLD = 3;

// Initialize the Jaeger tracer (simplified example)
function initJaegerTracer() {
  const tracerConfig = {
    serviceName: config.tracing.serviceName || 'imperial_server',
    reporter: {
      logSpans: true,
      agentHost: config.tracing.agentHost || 'localhost',
      agentPort: config.tracing.agentPort || 6831
    },
    sampler: {
      type: 'const',
      param: 1
    }
  };
  const options = { logger: console };
  return initTracer(tracerConfig, options);
}
const tracer = initJaegerTracer();

// IMPERIAL REGISTRY (Prometheus Metrics)
// Adding a histogram for request durations and a counter for errors.
const register = new prom.Registry();
register.setDefaultLabels({ app: 'imperial_core' });
const httpRequestDurationMicroseconds = new prom.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000] // ms
});
const httpErrors = new prom.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'code']
});
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpErrors);

// ROYAL GUARD (Security Config)
const securityPolicy = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://imperial-metrics.com']
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
};

if (securityLevel === 'max') {
  securityPolicy.contentSecurityPolicy.directives.scriptSrc.push('https://trusted-scripts.imperial');
}

// IMPERIAL TREASURY (Logging)
const royalLogger = winston.createLogger({
  level: 'imperial',
  levels: { imperial: 0, emergency: 1, alert: 2, critical: 3, error: 4, warning: 5, notice: 6, info: 7, debug: 8 },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'Imperial Standard Time' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'imperial-audit.log', maxSize: 104857600, zippedArchive: true }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// JWT-based authentication middleware for administrative endpoints
function adminAuth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const payload = jwt.verify(token, config.adminToken || 'default_admin_secret');
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

class ImperialServer {
  constructor() {
    this.royalCourt = express();
    this.imperialGuard = new Map(); // key: port, value: { app, instance, status, lastActivation, failureCount, role }
    this.healthStatus = 'ROYAL_HEALTH';
    this.metrics = {
      imperialRequests: new prom.Counter({
        name: 'imperial_requests_total',
        help: 'Total requests across the empire'
      }),
      legionHealth: new prom.Gauge({
        name: 'imperial_legion_health',
        help: 'Health status of imperial legions',
        labelNames: ['port']
      })
    };
    register.registerMetric(this.metrics.imperialRequests);
    register.registerMetric(this.metrics.legionHealth);

    this.initializeRoyalProtocols();
    this.raiseImperialLegions();
    this.activateAllLegions(); // Emperor calls his royal guard on start
    this.establishRoyalCourt();
  }

  initializeRoyalProtocols() {
    // Add CORS support
    this.royalCourt.use(cors());
    
    // Use helmet and rate limiting on the Imperial Court
    this.royalCourt.use(helmet(securityPolicy));
    this.royalCourt.use(rateLimit({ windowMs: 60 * 1000, max: 1000, legacyHeaders: false }));

    this.royalCourt.use(session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: config.useHttps || false }
    }));

    // Parse incoming JSON and URL-encoded payloads
    this.royalCourt.use(express.json({ limit: '10kb' }));
    this.royalCourt.use(express.urlencoded({ extended: true }));

    // Middleware to measure request durations and record tracing spans
    this.royalCourt.use((req, res, next) => {
      const end = httpRequestDurationMicroseconds.startTimer();
      const span = tracer.startSpan(`${req.method} ${req.path}`);
      res.on('finish', () => {
        end({ method: req.method, route: req.path, code: res.statusCode });
        if (res.statusCode >= 400) {
          httpErrors.inc({ method: req.method, route: req.path, code: res.statusCode });
        }
        span.setTag('http.status_code', res.statusCode);
        span.finish();
      });
      next();
    });
  }

  raiseImperialLegions() {
    Object.keys(PORTS_TO_MANAGE).forEach(portStr => {
      const port = Number(portStr);
      const legionApp = express();
      
      // Add CORS support for API legions
      legionApp.use(cors());

      // API versioning: all routes under /v1
      const router = express.Router();
      
      // Configure behavior based on port role:
      switch (port) {
        case 8080:
          // Main web application (React app)
          legionApp.use('/v1', express.static(path.join(__dirname, 'build')));
          break;
        case 8000:
          // Ticker HTML server
          legionApp.use('/v1', express.static(path.join(__dirname, 'ticker')));
          break;
        case 5000:
          // SocketIO/ticker server (placeholder response)
          router.all('*', (req, res) => {
            res.send('SocketIO/Ticker server is operational');
          });
          legionApp.use('/v1', router);
          break;
        case 5001:
          // Control panel API server - This is where we add OSINT API endpoints
          // Status endpoint
          router.get('/status', (req, res) => {
            res.json({ status: 'Control Panel API server is online' });
          });
          
          // OSINT API endpoints
          router.get('/api/osint/status', (req, res) => {
            res.json({
              status: 'operational',
              availableTools: [
                'sherlock', 'cameradar', 'ipcamsearch', 'searchcam', 'webcheck', 
                'imperial-pawn', 'imperial-oculus'
              ]
            });
          });
          
          // Sherlock - Username search across platforms
          router.post('/api/osint/sherlock', adminAuth, async (req, res) => {
            try {
              const { username } = req.body;
              if (!username) {
                return res.status(400).json({ error: 'Username parameter is required' });
              }
              
              const result = await pythonTools.runPythonTool('sherlock', { username });
              res.json(result);
            } catch (error) {
              royalLogger.error('Sherlock tool error:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
          // Cameradar - RTSP stream discovery
          router.post('/api/osint/cameradar', adminAuth, async (req, res) => {
            try {
              const { target, ports } = req.body;
              if (!target) {
                return res.status(400).json({ error: 'Target parameter is required' });
              }
              
              const result = await pythonTools.runPythonTool('cameradar', { target, ports });
              res.json(result);
            } catch (error) {
              royalLogger.error('Cameradar tool error:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
          // IPCamSearch - Camera discovery using various protocols
          router.post('/api/osint/ipcamsearch', adminAuth, async (req, res) => {
            try {
              const { subnet, protocols } = req.body;
              if (!subnet) {
                return res.status(400).json({ error: 'Subnet parameter is required' });
              }
              
              const result = await pythonTools.runPythonTool('ipcamsearch', { subnet, protocols: protocols || [] });
              res.json(result);
            } catch (error) {
              royalLogger.error('IPCamSearch tool error:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
          // WebCheck - Website security and information analysis
          router.post('/api/osint/webcheck', adminAuth, async (req, res) => {
            try {
              const { url } = req.body;
              if (!url) {
                return res.status(400).json({ error: 'URL parameter is required' });
              }
              
              const result = await pythonTools.runPythonTool('webcheck', { url });
              res.json(result);
            } catch (error) {
              royalLogger.error('WebCheck tool error:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
          // Imperial Pawn - Advanced CCTV bruteforce tool
          router.post('/api/osint/imperial-pawn', adminAuth, async (req, res) => {
            try {
              const { 
                targets, 
                usernames, 
                passwords, 
                generateLoginCombos, 
                threads, 
                timeout, 
                skipCameraCheck 
              } = req.body;
              
              if (!targets || !Array.isArray(targets) || targets.length === 0) {
                return res.status(400).json({ error: 'At least one target IP is required' });
              }
              
              const result = await pythonTools.runPythonTool('imperial-pawn', {
                targets,
                usernames,
                passwords,
                generateLoginCombos,
                threads,
                timeout,
                skipCameraCheck
              });
              
              res.json(result);
            } catch (error) {
              royalLogger.error('Imperial Pawn tool error:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
          // Imperial Oculus - Network scanner
          router.post('/api/osint/imperial-oculus', adminAuth, async (req, res) => {
            try {
              const { target, scanType, ports, timeout } = req.body;
              
              if (!target) {
                return res.status(400).json({ error: 'Target network parameter is required (e.g., 192.168.1.0/24)' });
              }
              
              // Regex to validate CIDR notation
              const cidrRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
              if (!cidrRegex.test(target)) {
                return res.status(400).json({ error: 'Invalid CIDR notation for target network' });
              }
              
              const result = await pythonTools.runPythonTool('imperial-oculus', {
                target,
                scanType: scanType || 'basic',
                ports,
                timeout: timeout || 60
              });
              
              res.json(result);
            } catch (error) {
              royalLogger.error('Imperial Oculus tool error:', error);
              res.status(500).json({ error: error.message });
            }
          });
          
          // Authorization token generation for API access
          router.post('/api/auth', async (req, res) => {
            const { token } = req.body;
            
            if (token !== config.adminToken) {
              return res.status(403).json({ success: false, message: 'Invalid token' });
            }
            
            // Create a JWT that expires in 24 hours
            const jwtToken = jwt.sign({ admin: true }, config.adminToken, { expiresIn: '24h' });
            res.json({ success: true, token: jwtToken });
          });
          
          legionApp.use('/v1', router);
          break;
        case 3000:
          // HLS Restream Server
          router.all('*', (req, res) => {
            res.send('HLS Restream Server stands ready');
          });
          legionApp.use('/v1', router);
          break;
        default:
          router.all('*', (req, res) => {
            res.send(`Imperial Legion on port ${port} stands ready`);
          });
          legionApp.use('/v1', router);
      }
      this.imperialGuard.set(port, {
        app: legionApp,
        instance: null,
        status: 'DORMANT',
        lastActivation: null,
        failureCount: 0,
        role: PORTS_TO_MANAGE[port]
      });
    });
  }

  // Activate a legion on a given port
  activateLegion(port) {
    const legion = this.imperialGuard.get(port);
    if (!legion || legion.status === 'ACTIVE') return;
    legion.instance = legion.app.listen(port, () => {
      legion.status = 'ACTIVE';
      legion.lastActivation = new Date();
      this.metrics.legionHealth.set({ port }, 1);
      royalLogger.alert(`Legion on port ${port} (${legion.role}) mobilized`);
    });
  }

  // Automatically activate all legions
  activateAllLegions() {
    Object.keys(PORTS_TO_MANAGE).forEach(portStr => {
      const port = Number(portStr);
      this.activateLegion(port);
    });
  }

  establishRoyalCourt() {
    // Login endpoint for getting JWT token
    this.royalCourt.post('/v1/auth/login', (req, res) => {
      const { token } = req.body;
      
      if (!token || token !== config.adminToken) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Sign a token with the admin role
      const jwtToken = jwt.sign(
        { role: 'admin' },
        config.adminToken,
        { expiresIn: '24h' }
      );
      
      res.json({ success: true, token: jwtToken });
    });

    // Protect administrative endpoints with JWT authentication
    const adminRouter = express.Router();
    adminRouter.use(adminAuth);

    // Administrative endpoints (API versioned under /v1)
    adminRouter.get('/status', (req, res) => res.json(this.getImperialStatus()));
    adminRouter.post('/decree/:port', (req, res) => {
      const decree = this.processRoyalDecree(req);
      res.status(decree.status).json(decree);
    });
    adminRouter.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    });
    adminRouter.get('/diagnostics', (req, res) => res.json(this.generateRoyalReport()));
    this.royalCourt.use('/v1/admin', adminRouter);

    // Optionally serve an administrative UI from a folder (e.g., 'imperial-ui')
    this.royalCourt.use('/v1/court', express.static(path.join(__dirname, 'imperial-ui')));
  }

  processRoyalDecree(req) {
    const port = Number(req.params.port);
    const { command } = req.body;
    if (!PORTS_TO_MANAGE[port]) {
      return { status: 400, decree: 'Invalid legion number' };
    }
    try {
      switch (command.toUpperCase()) {
        case 'MOBILIZE':
          this.activateLegion(port);
          return { status: 200, decree: 'Legion mobilized' };
        case 'STAND_DOWN':
          this.deactivateLegion(port);
          return { status: 200, decree: 'Legion stood down' };
        default:
          return { status: 400, decree: 'Unrecognized imperial command' };
      }
    } catch (error) {
      this.handleImperialFailure(port, error);
      return { status: 500, decree: 'Imperial failure detected' };
    }
  }

  deactivateLegion(port) {
    const legion = this.imperialGuard.get(port);
    if (!legion || legion.status === 'DORMANT') return;
    if (legion.instance && legion.instance.close) {
      legion.instance.close(() => {
        legion.status = 'DORMANT';
        this.metrics.legionHealth.set({ port }, 0);
        royalLogger.alert(`Legion on port ${port} (${legion.role}) stood down`);
      });
    }
  }

  getImperialStatus() {
    return Array.from(this.imperialGuard.entries()).reduce((acc, [port, data]) => {
      acc[port] = {
        status: data.status,
        lastActivation: data.lastActivation,
        operationalCapacity: data.status === 'ACTIVE' ? '100%' : '0%',
        role: data.role
      };
      return acc;
    }, {});
  }

  generateRoyalReport() {
    return {
      systemStatus: this.healthStatus,
      imperialResources: process.memoryUsage(),
      legionHealth: this.getImperialStatus(),
      throneRoomMetrics: register.getMetricsAsJSON()
    };
  }

  handleImperialFailure(port, error) {
    const legion = this.imperialGuard.get(port);
    legion.failureCount++;
    royalLogger.emergency(`Legion failure on port ${port} (${legion.role}):`, { error });
    if (legion.failureCount >= FAILURE_THRESHOLD) {
      royalLogger.alert(`Auto-stand down legion on port ${port}`);
      this.deactivateLegion(port);
      legion.failureCount = 0;
    }
  }
}

// IMPERIAL CLUSTER PROTOCOL
if (CLUSTER_ENABLED && cluster.isMaster) {
  royalLogger.info(`Imperial Core established on ${os.cpus().length} thrones`);
  os.cpus().forEach(() => cluster.fork());
  cluster.on('exit', (worker) => {
    royalLogger.warning(`Throne ${worker.process.pid} fell, raising new one`);
    cluster.fork();
  });
} else {
  // ROYAL ASCENSION: Start the Imperial Server and its Royal Court
  const imperialReign = new ImperialServer();

  // Use HTTPS if configured; otherwise use HTTP
  let server;
  if (config.useHttps) {
    const sslOptions = {
      key: fs.readFileSync(path.join(__dirname, config.sslOptions.keyPath)),
      cert: fs.readFileSync(path.join(__dirname, config.sslOptions.certPath))
    };
    server = https.createServer(sslOptions, imperialReign.royalCourt);
  } else {
    server = imperialReign.royalCourt;
  }

  const royalServer = config.useHttps
    ? server.listen(ROYAL_COURT_PORT)
    : imperialReign.royalCourt.listen(ROYAL_COURT_PORT, () => {});
    
  royalServer.on('listening', () => {
    royalLogger.info(`Imperial Court convened on port ${ROYAL_COURT_PORT} using ${config.useHttps ? 'HTTPS' : 'HTTP'}`);
  });

  // GRACEFUL IMPERIAL SUCCESSION (shutdown)
  createTerminus(royalServer, {
    signals: ['SIGTERM', 'SIGINT'],
    healthChecks: { '/v1/admin/health': () => imperialReign.healthStatus },
    onSignal: () => {
      royalLogger.info('Imperial succession protocol initiated');
      return Promise.all(
        Array.from(imperialReign.imperialGuard.values())
          .filter(l => l.status === 'ACTIVE' && l.instance)
          .map(l => new Promise(resolve => l.instance.close(resolve)))
      );
    },
    onShutdown: () => royalLogger.alert('Imperial reign concluded')
  });
}

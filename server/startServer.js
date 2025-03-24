
/**
 * Imperial Server Starter
 * 
 * This script starts the Imperial Server with optional command-line arguments
 * and sets up a WebSocket server for real-time communication
 */

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Available command-line options
const options = {
  '--security-level': 'normal',  // Options: normal, max
  '--encryption': 'standard',    // Options: standard, military
  '--cluster': 'enabled',        // Options: enabled, disabled
  '--websocket': 'enabled'       // Options: enabled, disabled
};

// WebSocket server instance
let wss = null;
let serverProcess = null;

// Function to set up WebSocket server
function setupWebSocketServer(port = 8080) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Imperial WebSocket Server\n');
  });
  
  wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial server status
    sendToClient(ws, 'server_status', {
      status: 'online',
      message: 'Imperial Server operational',
    });
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        handleClientMessage(ws, parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  server.listen(port, () => {
    console.log(`WebSocket server listening on port ${port}`);
  });
  
  return server;
}

// Function to handle client messages
function handleClientMessage(ws, message) {
  console.log('Received message from client:', message);
  
  // Handle different message types
  switch (message.type) {
    case 'scan_progress':
      // Example: Handle scan start request
      if (message.data && message.data.command === 'start_scan') {
        console.log('Client requested scan start with options:', message.data.options);
        // Mock response for now
        setTimeout(() => {
          broadcastToAll('scan_progress', {
            status: 'running',
            targetsTotal: 100,
            targetsScanned: 0,
            camerasFound: 0
          });
          
          // Mock scan progress updates
          let scanned = 0;
          let camerasFound = 0;
          const interval = setInterval(() => {
            scanned += 5;
            if (Math.random() > 0.7) {
              camerasFound++;
              // Send camera discovery notification
              broadcastToAll('camera_status', {
                id: `cam-${camerasFound}`,
                ip: `192.168.1.${100 + camerasFound}`,
                brand: ['Hikvision', 'Dahua', 'Axis', 'Bosch'][Math.floor(Math.random() * 4)],
                model: `Model-${Math.floor(Math.random() * 1000)}`,
                status: 'online',
                vulnerabilities: []
              });
            }
            
            broadcastToAll('scan_progress', {
              status: 'running',
              targetsTotal: 100,
              targetsScanned: scanned,
              camerasFound
            });
            
            if (scanned >= 100) {
              clearInterval(interval);
              broadcastToAll('scan_progress', {
                status: 'completed',
                targetsTotal: 100,
                targetsScanned: 100,
                camerasFound
              });
              
              // Send completion notification
              broadcastToAll('notification', {
                title: 'Scan Completed',
                message: `Scan finished. Found ${camerasFound} cameras.`,
                level: 'success'
              });
            }
          }, 1000);
        }, 500);
      }
      break;
      
    case 'camera_status':
      // Handle camera status update request
      if (message.data && message.data.command === 'update_status') {
        console.log(`Updating camera ${message.data.cameraId} status to ${message.data.status}`);
        // Mock response
        broadcastToAll('camera_status', {
          id: message.data.cameraId,
          status: message.data.status,
          lastUpdated: new Date().toISOString()
        });
      }
      break;
      
    default:
      console.log(`Unhandled message type: ${message.type}`);
  }
}

// Function to send message to a specific client
function sendToClient(ws, type, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type,
      data,
      timestamp: Date.now()
    }));
  }
}

// Function to broadcast to all connected clients
function broadcastToAll(type, data) {
  if (!wss) return;
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendToClient(client, type, data);
    }
  });
}

// Function to start the server with specified arguments
function startImperialServer(customArgs = []) {
  // Parse any command-line arguments
  const args = customArgs.length ? customArgs : process.argv.slice(2);
  const serverArgs = [];
  let enableWebSocket = true;

  // Format proper arguments for the server
  args.forEach(arg => {
    const [option, value] = arg.split('=');
    if (options[option]) {
      serverArgs.push(option);
      serverArgs.push(value || options[option]);
      
      // Check if WebSocket should be disabled
      if (option === '--websocket' && value === 'disabled') {
        enableWebSocket = false;
      }
    }
  });

  console.log('Starting Imperial Server with options:', serverArgs.join(' ') || 'default');

  // Start the server with the specified arguments
  serverProcess = spawn('node', [path.join(__dirname, 'imperialServer.js'), ...serverArgs], {
    stdio: 'inherit',
    cwd: __dirname
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start Imperial Server:', error);
    if (wss) {
      broadcastToAll('server_status', {
        status: 'error',
        message: `Failed to start server: ${error.message}`
      });
    }
  });
  
  // Set up cleanup handlers
  process.on('SIGINT', () => {
    console.log('Shutting down Imperial Server...');
    if (serverProcess) serverProcess.kill('SIGINT');
    if (wss) {
      broadcastToAll('server_status', {
        status: 'offline',
        message: 'Server shutting down'
      });
    }
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Terminating Imperial Server...');
    if (serverProcess) serverProcess.kill('SIGTERM');
    if (wss) {
      broadcastToAll('server_status', {
        status: 'offline',
        message: 'Server terminating'
      });
    }
    process.exit(0);
  });
  
  // Start WebSocket server if enabled
  if (enableWebSocket) {
    setupWebSocketServer();
    
    // Periodically send server health updates
    setInterval(() => {
      if (wss && wss.clients.size > 0) {
        broadcastToAll('server_status', {
          status: 'online',
          message: `Server running with ${wss.clients.size} connected clients`,
          metrics: {
            uptime: process.uptime(),
            memory: process.memoryUsage()
          }
        });
      }
    }, 30000); // Every 30 seconds
  }

  return serverProcess;
}

// If this script is run directly, start the server
if (require.main === module) {
  startImperialServer();
}

// Export the function for use in other modules
module.exports = { startImperialServer };

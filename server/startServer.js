
/**
 * Imperial Server Starter
 * 
 * This script starts the Imperial Server with optional command-line arguments
 */

const { spawn } = require('child_process');
const path = require('path');

// Available command-line options
const options = {
  '--security-level': 'normal',  // Options: normal, max
  '--encryption': 'standard',    // Options: standard, military
  '--cluster': 'enabled'         // Options: enabled, disabled
};

// Function to start the server with specified arguments
function startImperialServer(customArgs = []) {
  // Parse any command-line arguments
  const args = customArgs.length ? customArgs : process.argv.slice(2);
  const serverArgs = [];

  // Format proper arguments for the server
  args.forEach(arg => {
    const [option, value] = arg.split('=');
    if (options[option]) {
      serverArgs.push(option);
      serverArgs.push(value || options[option]);
    }
  });

  console.log('Starting Imperial Server with options:', serverArgs.join(' ') || 'default');

  // Start the server with the specified arguments
  const serverProcess = spawn('node', [path.join(__dirname, 'imperialServer.js'), ...serverArgs], {
    stdio: 'inherit',
    cwd: __dirname
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start Imperial Server:', error);
  });

  process.on('SIGINT', () => {
    console.log('Shutting down Imperial Server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Terminating Imperial Server...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });

  return serverProcess;
}

// If this script is run directly, start the server
if (require.main === module) {
  startImperialServer();
}

// Export the function for use in other modules
module.exports = { startImperialServer };

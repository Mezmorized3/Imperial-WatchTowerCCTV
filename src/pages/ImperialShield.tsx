
// Create a default camera for the FirmwareAnalysis component
const defaultCamera = {
  id: 'default-camera',
  ip: '192.168.1.100',
  port: 554,
  model: 'Imperial Security Cam',
  manufacturer: 'Imperial Tech',
  status: 'online',
  firmware: {
    version: '2.0.4',
    vulnerabilities: [],
    updateAvailable: false,
    lastChecked: new Date().toISOString()
  }
};

// Then pass it to your FirmwareAnalysis component:
<FirmwareAnalysis camera={defaultCamera} />

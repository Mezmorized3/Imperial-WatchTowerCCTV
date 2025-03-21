
/**
 * Camera Protocol Search Utilities
 * Simulated implementation of various camera discovery protocols
 * Inspired by GitHub projects mentioned in requirements
 */

// Camera protocol types
export interface CameraProtocol {
  name: string;
  port: number;
  payload: Uint8Array;
  description: string;
}

// Camera discovery result
export interface DiscoveryResult {
  ip: string;
  port: number;
  protocol: string;
  manufacturer?: string;
  model?: string;
  firmware?: string;
  mac?: string;
  response?: string;
  timestamp: Date;
}

// Common camera discovery protocols
export const cameraProtocols: CameraProtocol[] = [
  {
    name: "ONVIF-Discovery",
    port: 3702,
    payload: new Uint8Array([
      0x3c, 0x3f, 0x78, 0x6d, 0x6c, 0x20, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x3d, 0x22, 0x31,
      0x2e, 0x30, 0x22, 0x20, 0x65, 0x6e, 0x63, 0x6f, 0x64, 0x69, 0x6e, 0x67, 0x3d, 0x22, 0x55, 0x54,
      0x46, 0x2d, 0x38, 0x22, 0x3f, 0x3e
    ]),
    description: "ONVIF WS-Discovery protocol for IP cameras"
  },
  {
    name: "Hikvision",
    port: 8000,
    payload: new Uint8Array([0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]),
    description: "Hikvision proprietary discovery protocol"
  },
  {
    name: "Dahua",
    port: 37810,
    payload: new Uint8Array([
      0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]),
    description: "Dahua discovery broadcast protocol"
  },
  {
    name: "RTSP",
    port: 554,
    payload: new Uint8Array([
      0x52, 0x54, 0x53, 0x50, 0x2f, 0x31, 0x2e, 0x30, 0x0d, 0x0a
    ]),
    description: "Real Time Streaming Protocol probe"
  }
];

/**
 * Simulates scanning a network for cameras using various protocols
 * @param ipRange IP range to scan (e.g. 192.168.1.0/24)
 * @param protocols Array of protocol names to use, or empty for all
 * @returns Promise that resolves to array of discovered cameras
 */
export const scanNetworkForCameras = async (
  ipRange: string,
  protocols: string[] = []
): Promise<DiscoveryResult[]> => {
  // This is a simulation - in a real app this would use UDP sockets
  // which isn't possible directly from a browser
  console.log(`[Simulation] Scanning ${ipRange} with protocols: ${protocols.length ? protocols.join(', ') : 'all'}`);
  
  // Simulate network scan delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Generate some simulated results
  const results: DiscoveryResult[] = [];
  const numResults = Math.floor(Math.random() * 5) + 1;
  
  // Parse IP range to generate realistic IPs in that range
  const baseIp = ipRange.split('/')[0].split('.');
  
  for (let i = 0; i < numResults; i++) {
    // Generate IP in the given range
    const lastOctet = parseInt(baseIp[3]) + i + 1;
    const ip = `${baseIp[0]}.${baseIp[1]}.${baseIp[2]}.${lastOctet % 255}`;
    
    // Select a protocol
    const protocolList = protocols.length > 0 
      ? cameraProtocols.filter(p => protocols.includes(p.name))
      : cameraProtocols;
    
    if (protocolList.length === 0) continue;
    
    const protocol = protocolList[Math.floor(Math.random() * protocolList.length)];
    
    // Generate manufacturer based on protocol
    let manufacturer = "Generic";
    if (protocol.name === "Hikvision") {
      manufacturer = "Hikvision";
    } else if (protocol.name === "Dahua") {
      manufacturer = "Dahua";
    } else if (Math.random() > 0.5) {
      manufacturer = ["Axis", "Bosch", "Sony", "Samsung", "Vivotek"][Math.floor(Math.random() * 5)];
    }
    
    // Create result
    results.push({
      ip,
      port: protocol.port,
      protocol: protocol.name,
      manufacturer,
      model: `${manufacturer}-${Math.floor(Math.random() * 1000)}`,
      firmware: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 50)}`,
      mac: generateRandomMAC(),
      response: "Simulated response data (binary data would appear here)",
      timestamp: new Date()
    });
  }
  
  return results;
};

/**
 * Generate a random MAC address
 */
function generateRandomMAC(): string {
  const hexDigits = "0123456789ABCDEF";
  let mac = "";
  
  for (let i = 0; i < 6; i++) {
    mac += hexDigits.charAt(Math.floor(Math.random() * 16)) + 
           hexDigits.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ":";
  }
  
  return mac;
}

/**
 * Implements a camera discovery using the ONVIF protocol
 * @param targetIp IP address to scan
 * @returns Promise resolving to discovery result
 */
export const discoverONVIFCamera = async (targetIp: string): Promise<DiscoveryResult | null> => {
  console.log(`[Simulation] Discovering ONVIF camera at ${targetIp}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 70% chance of finding a camera
  if (Math.random() > 0.3) {
    return {
      ip: targetIp,
      port: 80,
      protocol: "ONVIF",
      manufacturer: ["Hikvision", "Dahua", "Axis", "Bosch"][Math.floor(Math.random() * 4)],
      model: `IP-Camera-${Math.floor(Math.random() * 500)}`,
      firmware: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      mac: generateRandomMAC(),
      timestamp: new Date()
    };
  }
  
  return null;
};

/**
 * Attempts to connect to a camera using default credentials
 * @param ip Camera IP address
 * @param port Camera port
 * @returns Promise resolving to working credentials or null
 */
export const testCameraCredentials = async (
  ip: string,
  port: number
): Promise<{username: string, password: string} | null> => {
  console.log(`[Simulation] Testing credentials for camera at ${ip}:${port}`);
  
  // Common default credentials
  const defaultCredentials = [
    { username: "admin", password: "admin" },
    { username: "admin", password: "12345" },
    { username: "admin", password: "" },
    { username: "root", password: "pass" },
    { username: "user", password: "user" }
  ];
  
  // Simulate credential testing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 40% chance of finding working credentials
  if (Math.random() > 0.6) {
    const credIndex = Math.floor(Math.random() * defaultCredentials.length);
    return defaultCredentials[credIndex];
  }
  
  return null;
};

/**
 * A simplified (simulation) version of the Cameradar functionality
 * @param target Target IP or subnet
 * @returns Promise resolving to array of discovered RTSP URLs
 */
export const discoverRTSPStreams = async (target: string): Promise<string[]> => {
  console.log(`[Simulation] Discovering RTSP streams at ${target}`);
  
  // Simulate search process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate some sample RTSP URLs
  const results: string[] = [];
  const numResults = Math.floor(Math.random() * 4) + 1;
  
  // Common RTSP paths
  const rtspPaths = [
    "/live/ch00_0",
    "/h264/ch1/main/av_stream",
    "/cam/realmonitor?channel=1&subtype=0",
    "/live/main",
    "/videostream.asf",
    "/mpeg4",
    "/live.sdp"
  ];
  
  // Generate IP from target (assuming it's an IP address)
  const ip = target.split('/')[0];
  
  for (let i = 0; i < numResults; i++) {
    const path = rtspPaths[Math.floor(Math.random() * rtspPaths.length)];
    results.push(`rtsp://${ip}:554${path}`);
  }
  
  return results;
};

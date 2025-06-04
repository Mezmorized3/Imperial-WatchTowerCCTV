// This file contains the original mock implementations from osintTools.ts and osintImplementations.ts

import { 
  HackingToolResult, 
  EncoderDecoderParams, EncoderDecoderData, 
  ReverseShellParams, ReverseShellData,
  SqliPayloadParams, SqliPayloadData,
  XssPayloadParams, 
  PasswordCrackerParams, PasswordCrackerSuccessData,
  PasswordGeneratorParams, PasswordGeneratorSuccessData,
  IpInfoParams, IpInfoData,
  DnsLookupParams, DnsLookupData,
  PortScanParams, PortScanData,
  TracerouteParams, TracerouteData,
  SubnetScanParams, SubnetScanData,
  WhoisLookupParams, WhoisLookupData,
  HttpHeadersParams, HttpHeadersData,
  BotExploitsParams, BotExploitsData,
  CCTVHackedParams, CCTVHackedData, CCTVHackedCamera,
  CCTVScanParams, CCTVScanData, CCTVCamera,
  Vulnerability
} from '../types/osintToolTypes';
import { CameraResult } from '../types/cameraTypes';

export const executeEncoderDecoder = async (options: EncoderDecoderParams): Promise<HackingToolResult<EncoderDecoderData>> => {
  console.log("Encoder/Decoder executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  let resultText = options.text;
  if (options.action === 'encode') {
    if (options.type === 'base64') resultText = typeof btoa !== 'undefined' ? btoa(options.text) : Buffer.from(options.text).toString('base64');
    else if (options.type === 'url') resultText = encodeURIComponent(options.text);
  } else {
    if (options.type === 'base64') resultText = typeof atob !== 'undefined' ? atob(options.text) : Buffer.from(options.text, 'base64').toString('ascii');
    else if (options.type === 'url') resultText = decodeURIComponent(options.text);
  }
  return { success: true, data: { results: { encodedText: resultText }, message: "Operation successful" } };
};

export const executeReverseShellListener = async (options: ReverseShellParams): Promise<HackingToolResult<ReverseShellData>> => {
  console.log("Reverse Shell Listener executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { command: `nc -lvnp ${options.port}` }, message: "Listener started" } };
};

export const executeSqliPayloadTest = async (options: SqliPayloadParams): Promise<HackingToolResult<SqliPayloadData>> => {
  console.log("SQLi Payload Test executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  // Mock SqliPayloadData structure
  const mockSqliData: SqliPayloadData = {
    target_url: options.target_url,
    payload_used: options.payload,
    vulnerable: Math.random() > 0.5,
    response_time_ms: 50 + Math.random() * 100,
    status_code: 200,
    details: "Mock SQLi test details.",
    recommendation: "Use parameterized queries.",
    log: "Test log..."
  };
  return { success: true, data: { results: mockSqliData, message: "SQLi test complete" } };
};

export const executeXssPayloadSearch = async (options: XssPayloadParams): Promise<HackingToolResult<{ payloads: string[] }>> => {
  console.log("XSS Payload Search executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { payloads: ["<script>alert(1)</script>", `<img src=x onerror=alert('XSS')>`] }, message: "XSS search complete" } };
};

export const executePasswordCracker = async (options: PasswordCrackerParams): Promise<HackingToolResult<PasswordCrackerSuccessData>> => {
  console.log("Password Cracker executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true, data: { results: { results: ["password123", "admin"] }, message: "Password cracking complete" } };
};

export const executePasswordGenerator = async (options: PasswordGeneratorParams): Promise<HackingToolResult<PasswordGeneratorSuccessData>> => {
  console.log("Password Generator executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { results: ["P@$$wOrd!", "S3curE!"] }, message: "Passwords generated" } };
};

export const executeIpInfo = async (options: IpInfoParams): Promise<HackingToolResult<IpInfoData>> => {
  console.log("IP Info executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { ip: options.ip_address, country: "US", city: "Somewhere", ISP: "Mock ISP" }, message: "IP info retrieved" } };
};

export const executeDnsLookup = async (options: DnsLookupParams): Promise<HackingToolResult<DnsLookupData>> => {
  console.log("DNS Lookup executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { domain: options.domain, record_type: options.record_type, records: ["192.0.2.1", "example.com"] }, message: "DNS lookup complete" } };
};

export const executePortScan = async (options: PortScanParams): Promise<HackingToolResult<PortScanData>> => {
  console.log("Port Scan executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true, data: { results: { target_host: options.target_host, open_ports: [{ port: 80, service_name: "http", protocol: "tcp", state: "open" }] }, message: "Port scan complete" } };
};

export const executeTraceroute = async (options: TracerouteParams): Promise<HackingToolResult<TracerouteData>> => {
  console.log("Traceroute executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true, data: { results: { target_host: options.target_host, hops: [{ hop: 1, ip: "10.0.0.1", rtt_ms: 10 }] }, message: "Traceroute complete" } };
};

export const executeSubnetScan = async (options: SubnetScanParams): Promise<HackingToolResult<SubnetScanData>> => {
  console.log("Subnet Scan executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true, data: { results: { subnet_cidr: options.subnet_cidr, active_hosts: [{ ip: "192.168.1.101", open_ports: [80, 443] }] }, message: "Subnet scan complete" } };
};

export const executeWhoisLookup = async (options: WhoisLookupParams): Promise<HackingToolResult<WhoisLookupData>> => {
  console.log("WHOIS Lookup executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { query: options.query, raw_data: "Domain info for example.com..." }, message: "WHOIS lookup complete" } };
};

export const executeHttpHeaders = async (options: HttpHeadersParams): Promise<HackingToolResult<HttpHeadersData>> => {
  console.log("HTTP Headers executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, data: { results: { url: options.url, status_code: 200, headers: { "server": "nginx", "content-type": "text/html" } }, message: "HTTP headers retrieved" } };
};

export const executeBotExploits = async (options: BotExploitsParams): Promise<HackingToolResult<BotExploitsData>> => {
  console.log("Bot Exploits executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 200));
  const mockData: BotExploitsData = {
      tokens: [{id: 'mock-token', value: 'xyz', type: 'discord', expiration: 'never'}],
      apis: [{id: 'mock-api', endpoint: '/test', method: 'GET', authentication: false}],
      message: "Mock bot exploit data."
  };
  return { success: true, data: { results: mockData, message: "Bot exploit scan complete" } };
};

// This is the base executeCCTVScan
export const executeCCTVScan = async (options: CCTVScanParams): Promise<HackingToolResult<CCTVScanData>> => {
  console.log("Base CCTV Scan executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 300));
  const numCameras = Math.floor(Math.random() * 3) + 1;
  const cameras: CCTVCamera[] = Array.from({ length: numCameras }, (_, i) => ({
    id: `cam-scan-${i}`,
    ip: `192.168.5.${10 + i}`,
    port: 554,
    manufacturer: "ScanCam",
    model: `Model S${100 + i}`,
    status: 'online' as const,
    url: `rtsp://scanuser:scanpass@192.168.5.${10 + i}:554/stream1`,
    location: { 
      country: "US",
      latitude: 34.0522 + (Math.random()-0.5)*0.1, 
      longitude: -118.2437 + (Math.random()-0.5)*0.1 
    },
  }));
  const scanData: CCTVScanData = {
    cameras,
    totalFound: numCameras,
    scanDuration: 300
  };
  return { success: true, data: { results: scanData, message: `Found ${numCameras} cameras via base scan` } };
};

export const executeCCTVHackedScan = async (options: CCTVHackedParams): Promise<HackingToolResult<CCTVHackedData>> => {
  console.log("Base CCTV Hacked Scan executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 300));
  const vulnerabilities: Vulnerability[] = [
    { id: "vuln-1", name: "Default Credentials", severity: "critical", description: "Uses default admin/admin credentials" },
    { id: "vuln-2", name: "CVE-2023-xxxx", severity: "high", description: "Buffer overflow vulnerability" }
  ];
  const cameras: CCTVHackedCamera[] = [{
    id: "hacked-cam-base-1", 
    ip: "192.168.6.200", 
    port: 8899, 
    manufacturer: "HackedCam Co", 
    model: "XPwn", 
    status: 'vulnerable' as const,
    vulnerabilities,
    accessLevel: 'admin' as const,
    exploits: ["default_creds", "CVE-2023-xxxx"]
  }];
  const hackedData: CCTVHackedData = {
    cameras,
    totalCompromised: 1,
    scanDuration: 300
  };
  return { success: true, data: { results: hackedData, message: "CCTV hacked scan (base) complete" } };
};


// Original implementations from the user's osintImplementations.ts
export const executeCCTV = async (options: any): Promise<HackingToolResult<{ cameras: CameraResult[] }>> => {
  console.log("Original CCTV search executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  const cameras: CameraResult[] = [
    {
      id: "cam-orig-001", 
      ip: "192.168.1.150", 
      port: 554, 
      manufacturer: "Hikvision", 
      model: "DS-2CD2032-I",
      rtspUrl: "rtsp://admin:admin@192.168.1.150:554/Streaming/Channels/101",
      geolocation: { country: "United States", city: "New York", latitude: 40.7128, longitude: -74.0060 },
      status: "online", 
      accessLevel: 'limited'
    },
  ];
  return { success: true, data: { results: { cameras }, message: "Original CCTV search complete" } };
};

// The original executeHackCCTV from osintImplementations.ts used by HackCCTVTool.tsx
// This needs to be distinct from the one in hackCCTVTools.ts if they have different signatures or behaviors.
// For now, assume it's this one.
export const executeOriginalHackCCTV = async (options: any): Promise<HackingToolResult<{ cameras: CameraResult[] }>> => {
  console.log("Original Hack CCTV executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  const vulnerabilities: Vulnerability[] = [
    { id: "vuln-default", name: "Default Credentials", severity: "critical", description: "Uses default credentials" }
  ];
  const cameras: CameraResult[] = [
    {
      id: "cam-hack-orig-001", 
      ip: options.target || "192.168.1.120", 
      port: 554, 
      manufacturer: "Vivotek", 
      model: "IB8369A",
      credentials: { username: "admin", password: "admin123" },
      rtspUrl: `rtsp://admin:admin123@${options.target || "192.168.1.120"}:554/live.sdp`,
      geolocation: { country: "United States", city: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
      status: "vulnerable", 
      accessLevel: 'full',
      vulnerabilities
    }
  ];
  return { success: true, data: { results: { cameras }, message: "Original HackCCTV successful" } };
};


export const executeCamDumper = async (options: any): Promise<HackingToolResult<{ cameras: CameraResult[] }>> => {
  console.log("Original CamDumper executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
   const cameras: CameraResult[] = [
    {
      id: "cd-orig-001", 
      ip: options.target || "10.0.0.50", 
      port: 80,
      rtspUrl: `http://${options.target || "10.0.0.50"}/video.mjpg`,
      status: "online", 
      accessLevel: 'limited',
      manufacturer: "Generic", 
      model: "MJPEG Streamer"
    }
  ];
  return { success: true, data: { results: { cameras }, message: "Original CamDumper successful" } };
};

export const executeOpenCCTV = async (options: any): Promise<HackingToolResult<{ cameras: CameraResult[] }>> => {
  console.log("Original OpenCCTV executed with options:", options);
   await new Promise(resolve => setTimeout(resolve, 100));
  const cameras: CameraResult[] = [
    {
      id: "oc-orig-001", 
      ip: options.target || "192.168.2.100", 
      port: 8080,
      rtspUrl: `http://${options.target || "192.168.2.100"}:8080/video`, model: "Generic IP Camera",
      status: "online", 
      accessLevel: 'limited',
      manufacturer: "OpenSourceCam"
    }
  ];
  return { success: true, data: { results: { cameras }, message: "Original OpenCCTV successful" } };
};

export const executeEyePwn = async (options: any): Promise<HackingToolResult<{ cameras: CameraResult[] }>> => {
  console.log("Original EyePwn executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
  const vulnerabilities: Vulnerability[] = [
    { id: "vuln-firmware", name: "Firmware Exploit", severity: "high", description: "Firmware vulnerability" },
    { id: "vuln-auth", name: "Weak Digest Auth", severity: "medium", description: "Weak digest authentication" }
  ];
  const cameras: CameraResult[] = [
    {
      id: "ep-orig-001", 
      ip: options.target || "192.168.3.100", 
      port: 801,
      status: "vulnerable", 
      accessLevel: 'full',
      manufacturer: "PwnableCams", 
      model: "EyeSpy2000",
      vulnerabilities
    }
  ];
  return { success: true, data: { results: { cameras }, message: "Original EyePwn successful" } };
};

export const executeIngram = async (options: any): Promise<HackingToolResult<{ cameras: CameraResult[] }>> => {
  console.log("Original Ingram executed with options:", options);
  await new Promise(resolve => setTimeout(resolve, 100));
   const cameras: CameraResult[] = [
    {
      id: "ig-orig-001", 
      ip: options.target || "192.168.4.100", 
      port: 9000,
      status: "online", 
      accessLevel: 'admin',
      manufacturer: "Ingram Micro", 
      model: "SecureView X"
    }
  ];
  return { success: true, data: { results: { cameras }, message: "Original Ingram successful" } };
};

// Make sure executeUsernameSearch and executeTwint are also here if they were in the original osintImplementations.ts
// For now, assuming they are handled by socialTools.ts and correctly re-exported by osintImplementations/index.ts

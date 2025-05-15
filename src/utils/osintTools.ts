import {
  EncoderDecoderParams, EncoderDecoderData, HackingToolResult,
  ReverseShellParams, ReverseShellData,
  RapidPayloadParams, RapidPayloadData,
  SqliPayloadParams, SqliPayloadData,
  XssPayloadParams, XssPayloadsSuccessData, HackingToolErrorData, // Use specific success type
  PasswordCrackerParams, PasswordCrackerSuccessData, // Use specific success type
  PasswordGeneratorParams, PasswordGeneratorSuccessData, // Use specific success type
  IpInfoParams, IpInfoData,
  DnsLookupParams, DnsLookupData,
  PortScanParams, PortScanData,
  TracerouteParams, TracerouteData,
  SubnetScanParams, SubnetScanData,
  WhoisLookupParams, WhoisLookupData,
  HttpHeadersParams, HttpHeadersData,
  BotExploitsParams, BotExploitsData, BotExploitsResult,
  CCTVHackedParams, CCTVHackedData, CCTVHackedResult,
  CCTVScanParams, CCTVScanData, CCTVScanResult
} from './types/osintToolTypes';

export const executeEncoderDecoder = async (
  params: EncoderDecoderParams
): Promise<HackingToolResult<EncoderDecoderData>> => {
  console.log('Executing Encoder/Decoder with params:', params);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

  if (!params.input) {
    return { success: false, data: { message: "Input is required." } };
  }

  let output = '';
  try {
    switch (params.operation) {
      case 'encode':
        switch (params.encoding) {
          case 'base64':
            output = btoa(params.input);
            break;
          case 'url':
            output = encodeURIComponent(params.input);
            break;
          case 'hex':
            output = Array.from(params.input)
              .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
              .join('');
            break;
          default:
            return { success: false, data: { message: `Unsupported encoding: ${params.encoding}` } };
        }
        break;
      case 'decode':
        switch (params.encoding) {
          case 'base64':
            try {
              output = atob(params.input);
            } catch (e) {
              return { success: false, data: { message: "Invalid Base64 input." } };
            }
            break;
          case 'url':
            try {
              output = decodeURIComponent(params.input);
            } catch (e) {
              return { success: false, data: { message: "Invalid URL encoded input." } };
            }
            break;
          case 'hex':
            if (!/^[0-9A-Fa-f]+$/.test(params.input) || params.input.length % 2 !== 0) {
              return { success: false, data: { message: "Invalid hexadecimal input." } };
            }
            output = params.input.match(/.{1,2}/g)!
              .map(byte => String.fromCharCode(parseInt(byte, 16)))
              .join('');
            break;
          default:
            return { success: false, data: { message: `Unsupported encoding: ${params.encoding}` } };
        }
        break;
      default:
        return { success: false, data: { message: `Unsupported operation: ${params.operation}` } };
    }

    return {
      success: true,
      data: {
        results: {
          input: params.input,
          output,
          operation: params.operation,
          encoding: params.encoding
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      data: { message: error instanceof Error ? error.message : "An unknown error occurred." }
    };
  }
};

export const executeReverseShellListener = async (
  params: ReverseShellParams
): Promise<HackingToolResult<ReverseShellData>> => {
  console.log('Executing Reverse Shell Listener with params:', params);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

  if (!params.ip || !params.port) {
    return { success: false, data: { message: "IP and port are required." } };
  }

  // Simulate starting a listener
  const listenerOutput = `[*] Starting reverse shell listener on ${params.ip}:${params.port}\n` +
    `[*] Using ${params.type || 'netcat'} listener\n` +
    `[*] Waiting for connections...\n` +
    `[+] Listener started successfully`;

  return {
    success: true,
    data: {
      results: {
        ip: params.ip,
        port: params.port,
        type: params.type || 'netcat',
        status: 'listening',
        output: listenerOutput
      }
    }
  };
};

export const executeRapidPayload = async (
  params: RapidPayloadParams
): Promise<HackingToolResult<RapidPayloadData, HackingToolErrorData>> => {
  console.log('Executing Rapid Payload Generator with params:', params);
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  if (!params.platform || !params.payloadType || !params.lhost || !params.lport) {
    return { success: false, data: { message: "Platform, Payload Type, LHOST, and LPORT are required." } };
  }

  // Simulate payload generation
  const payloadContent = `[+] Generated ${params.format} payload for ${params.platform}/${params.payloadType} LHOST=${params.lhost} LPORT=${params.lport}`;
  
  return { 
    success: true, 
    data: { 
      results: { // HackingToolSuccessData expects 'results'
        payload: payloadContent, 
        filename: `payload.${params.format}`,
        size: `${Math.floor(Math.random() * 500) + 50}KB`,
        handler_script: `use exploit/multi/handler\nset PAYLOAD ${params.payloadType}\nset LHOST ${params.lhost}\nset LPORT ${params.lport}\nrun`
      } as any // Cast to any to fit generic R, or define specific RapidPayloadSuccessData
    } 
  };
};


export const executeSqliPayloadTest = async (
  params: SqliPayloadParams
): Promise<HackingToolResult<SqliPayloadData, HackingToolErrorData>> => {
  console.log('Executing SQLi Payload Test with params:', params);
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

  if (!params.target_url || !params.payload) {
    return { success: false, data: { message: "Target URL and Payload are required for SQLi test." } };
  }

  const isVulnerable = Math.random() > 0.7; // Simulate vulnerability
  
return {
    success: true,
    data: { // HackingToolSuccessData expects 'results'
      results: {
        target_url: params.target_url,
        payload_used: params.payload,
        vulnerable: isVulnerable,
        response_time_ms: Math.floor(Math.random() * 300) + 50,
        status_code: isVulnerable ? 200 : (Math.random() > 0.5 ? 403 : 500),
        details: isVulnerable ? "Potential SQL injection detected based on response." : "No clear signs of SQL injection detected with this payload.",
        recommendation: isVulnerable ? "Further manual investigation and WAF review recommended." : "Try other payloads or parameters.",
        log: `[INFO] Testing ${params.target_url} with payload: ${params.payload}\n[DEBUG] Response time: ...\n[RESULT] ${isVulnerable ? 'VULNERABLE' : 'NOT VULNERABLE'}`,
      } as any // Cast to any or define specific SqliPayloadTestSuccessData
    }
  };
};

export const executeXssPayloadSearch = async (
  params: XssPayloadParams
): Promise<HackingToolResult<string[], HackingToolErrorData>> => {
  console.log('Executing XSS Payload Search with params:', params);
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  if (!params.searchTerm) {
    return { success: false, data: { message: "Search term is required for XSS payloads." } };
  }
  const mockResults = [
    `<script>alert('${params.searchTerm}')</script>`,
    `<img src=x onerror=alert('${params.searchTerm}')>`,
    `<body onload=alert('${params.searchTerm}')>`,
    `<svg/onload=alert('${params.searchTerm}')>`
  ].filter(p => p.toLowerCase().includes(params.searchTerm.toLowerCase()));

  if (mockResults.length === 0) {
     return { success: true, data: { results: [], message: "No matching XSS payloads found for your term." } };
  }
  
  return { success: true, data: { results: mockResults } };
};

export const executePasswordCracker = async (
  params: PasswordCrackerParams
): Promise<HackingToolResult<string[], HackingToolErrorData>> => {
  console.log('Executing Password Cracker with params:', params);
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  if (!params.target) {
    return { success: false, data: { message: "Target (hash/username) is required." } };
  }

  const foundPasswords: string[] = [];
  if (params.method === 'dictionary') {
    if (params.target.includes('test') || params.target.includes('admin')) { // Simulate finding
        foundPasswords.push('password123');
        if (params.target.includes('admin')) foundPasswords.push('admin');
    }
  } else if (params.method === 'bruteforce') {
     if (params.target.length < 5) foundPasswords.push(params.target + 'BF'); // very simple simulation
  }
  
  if (foundPasswords.length > 0) {
    return { success: true, data: { results: foundPasswords } };
  } else {
    return { success: true, data: { results: [], message: "No passwords cracked with the current configuration." } };
  }
};

export const executePasswordGenerator = async (
  params: PasswordGeneratorParams
): Promise<HackingToolResult<string[], HackingToolErrorData>> => {
  console.log('Executing Password Generator with params:', params);
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  if (!params.length || params.length <= 0 || !params.count || params.count <= 0) {
    return { success: false, data: { message: "Valid length and count are required." } };
  }
  const charsetStr = params.charset === 'alphanumeric' ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' :
                     params.charset === 'numeric' ? '0123456789' :
                     params.charset === 'alphabetic' ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' :
                     'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'; // Default to complex custom
  
  const passwords = Array.from({ length: params.count }, () => 
    Array.from({ length: params.length }, () => charsetStr.charAt(Math.floor(Math.random() * charsetStr.length))).join('')
  );
  
  return { success: true, data: { results: passwords } };
};


// Network Tools
export const executeIpInfo = async (params: IpInfoParams): Promise<HackingToolResult<IpInfoData>> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!params.ip_address) return { success: false, data: { message: 'IP address is required.' } as HackingToolErrorData };
  return { success: true, data: { results: { ip: params.ip_address, country: 'US', city: 'Mountain View', ISP: 'Google LLC' } as any } };
};
export const executeDnsLookup = async (params: DnsLookupParams): Promise<HackingToolResult<DnsLookupData>> => {
   await new Promise(resolve => setTimeout(resolve, 500));
  if (!params.domain) return { success: false, data: { message: 'Domain is required.' } as HackingToolErrorData };
  return { success: true, data: { results: { domain: params.domain, record_type: params.record_type, records: ['192.0.2.1'] } as any } };
};
export const executePortScan = async (params: PortScanParams): Promise<HackingToolResult<PortScanData>> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (!params.target_host) return { success: false, data: { message: 'Target host is required.' } as HackingToolErrorData };
  const open_ports = params.ports_to_scan?.filter(() => Math.random() > 0.5).map(p => ({ port: Number(p), service_name: 'unknown', protocol: 'tcp', state: 'open' })) || [];
  return { success: true, data: { results: { target_host: params.target_host, open_ports } as any } };
};
export const executeTraceroute = async (params: TracerouteParams): Promise<HackingToolResult<TracerouteData>> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (!params.target_host) return { success: false, data: { message: 'Target host is required.' } as HackingToolErrorData };
  return { success: true, data: { results: { target_host: params.target_host, hops: [{ hop: 1, ip: '192.168.1.1', rtt_ms: 10 }] } as any } };
};
export const executeSubnetScan = async (params: SubnetScanParams): Promise<HackingToolResult<SubnetScanData>> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  if (!params.subnet_cidr) return { success: false, data: { message: 'Subnet CIDR is required.' } as HackingToolErrorData };
  return { success: true, data: { results: { subnet_cidr: params.subnet_cidr, active_hosts: [{ ip: '192.168.1.100', open_ports: [80] }] } as any } };
};
export const executeWhoisLookup = async (params: WhoisLookupParams): Promise<HackingToolResult<WhoisLookupData>> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  if (!params.query) return { success: false, data: { message: 'Query (domain/IP) is required.' } as HackingToolErrorData };
  return { success: true, data: { results: { query: params.query, raw_data: `Registrant: Example Corp...\nAdmin Email: admin@${params.query}` } as any } };
};
export const executeHttpHeaders = async (params: HttpHeadersParams): Promise<HackingToolResult<HttpHeadersData>> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  if (!params.url) return { success: false, data: { message: 'URL is required.' } as HackingToolErrorData };
  return { success: true, data: { results: { url: params.url, status_code: 200, headers: { 'Content-Type': 'text/html', 'Server': 'MockServer/1.0' } } as any } };
};


// Bot Exploits
export const executeBotExploits = async (params: BotExploitsParams): Promise<BotExploitsResult> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  if (!params.target_url) return { success: false, error: 'Target URL is required.' };
  return { 
    success: true, 
    data: { 
      message: `Scan complete for ${params.target_url}`,
      tokens: [{id: 't1', value: 'mockToken123', type: 'API_KEY', expiration: '2025-12-31'}],
      apis: [{id: 'a1', endpoint: '/sendMessage', method: 'POST', authentication: true}]
    } 
  };
};

// CCTV Hacked
export const executeCCTVHackedScan = async (params: CCTVHackedParams): Promise<CCTVHackedResult> => {
  await new Promise(resolve => setTimeout(resolve, 1800));
  return {
    success: true,
    data: {
      message: `Scan for "${params.target_query}" completed.`,
      cameras: [
        { id: 'cam1', ip: '192.168.1.101', port: 8080, manufacturer: 'Hikvision', model: 'DS-2CDFAKE', vulnerabilities: ['CVE-2021-XXXX'] }
      ]
    }
  };
};

// CCTV Scan
export const executeCCTVScan = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    data: {
      cameras: [
        { id: 'pub_cam1', ip: '203.0.113.45', port: 80, manufacturer: 'Axis', model: 'M1065-L', url: 'http://example.com/cam1', location: { latitude: 34.0522, longitude: -118.2437 } }
      ]
    }
  };
};

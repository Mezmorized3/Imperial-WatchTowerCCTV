/**
 * Utilities for search-related functions
 */
import { simulateNetworkDelay } from './networkUtils';

/**
 * Parse Google dork string into a structured query
 */
export const parseGoogleDork = (dorkString: string): Record<string, string> => {
  const results: Record<string, string> = {
    query: dorkString
  };
  
  // Extract site: operator
  const siteMatch = dorkString.match(/site:([^\s]+)/);
  if (siteMatch) {
    results.site = siteMatch[1];
  }
  
  // Extract intitle: operator
  const intitleMatch = dorkString.match(/intitle:([^\s]+)/);
  if (intitleMatch) {
    results.intitle = intitleMatch[1].replace(/"/g, '');
  }
  
  // Extract inurl: operator
  const inurlMatch = dorkString.match(/inurl:([^\s]+)/);
  if (inurlMatch) {
    results.inurl = inurlMatch[1].replace(/"/g, '');
  }
  
  // Extract intext: operator
  const intextMatch = dorkString.match(/intext:([^\s]+)/);
  if (intextMatch) {
    results.intext = intextMatch[1].replace(/"/g, '');
  }
  
  // Extract filetype: operator
  const filetypeMatch = dorkString.match(/filetype:([^\s]+)/);
  if (filetypeMatch) {
    results.filetype = filetypeMatch[1];
  }
  
  return results;
};

/**
 * Generate a Google dork string for searching for cameras
 */
export const generateCameraDork = (
  cameraType: string = 'generic',
  country: string = ''
): string => {
  const dorks: Record<string, string[]> = {
    hikvision: [
      'intitle:"Hikvision" inurl:"/doc/page/login.asp"',
      'intitle:"Hikvision" inurl:"/doc/index.asp"',
      'intitle:"Hikvision" inurl:"/doc/page"'
    ],
    dahua: [
      'intitle:"WEB SERVICE" inurl:"/index.asp?language=English"',
      'intitle:"Dahua" inurl:"/index.asp"',
      'intitle:"Dahua" inurl:"/login.asp"'
    ],
    axis: [
      'intitle:"AXIS" inurl:"/view/view.shtml"',
      'intitle:"AXIS" inurl:"/jpg/image.jpg"'
    ],
    generic: [
      'intitle:"webcamXP" inurl:":8080"',
      'intitle:"webcam 7" inurl:"/webcam.html"',
      'intitle:"Live View / - AXIS" | inurl:view/view.shtml',
      'inurl:"/view/index.shtml"',
      'inurl:"ViewerFrame?Mode="',
      'inurl:"/viewerframe?mode=motion"',
      'inurl:CgiStart?page=Single',
      'inurl:/view.shtml',
      'inurl:ViewerFrame?Mode=',
      'inurl:axis-cgi/jpg'
    ]
  };
  
  const type = cameraType.toLowerCase();
  const typeList = dorks[type] || dorks.generic;
  const dork = typeList[Math.floor(Math.random() * typeList.length)];
  
  if (country) {
    return `${dork} site:${country}`;
  }
  
  return dork;
};

/**
 * Simulate searching for open directories containing camera feeds
 */
export const searchOpenDirectories = async (
  query: string = '',
  maxResults: number = 10
): Promise<string[]> => {
  await simulateNetworkDelay(1500);
  
  // Generate a list of fake open directory URLs
  const results: string[] = [];
  const hosts = [
    'camera-feeds.example.com',
    'cctv-archive.example.org',
    'surveillance.example.net',
    'security-cams.example.io',
    'traffic-cams.example.gov'
  ];
  
  const paths = [
    '/cameras/',
    '/feeds/',
    '/archive/',
    '/public/',
    '/streams/',
    '/video/',
    '/cctv/',
    '/surveillance/'
  ];
  
  for (let i = 0; i < Math.min(maxResults, 20); i++) {
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    
    // If query is provided, filter results
    if (query) {
      if (host.includes(query) || path.includes(query)) {
        results.push(`http://${host}${path}`);
      }
    } else {
      results.push(`http://${host}${path}`);
    }
  }
  
  return results;
};

/**
 * Simulates searching for a username across various platforms
 */
export const searchUsername = async (username: string) => {
  await simulateNetworkDelay(1500);
  
  // Simulate platforms we might search
  const platforms = [
    'Twitter', 'Instagram', 'Facebook', 'LinkedIn', 'GitHub', 
    'Reddit', 'YouTube', 'TikTok', 'Pinterest', 'Tumblr',
    'Flickr', 'Twitch', 'DeviantArt', 'Spotify', 'SoundCloud'
  ];
  
  // Generate simulated results
  const results = platforms.map(platform => {
    // Randomly determine if the username exists on this platform
    const exists = Math.random() > 0.3; // 70% chance of existing
    const baseUrl = platform.toLowerCase().replace(' ', '');
    
    return {
      platform,
      url: exists ? `https://www.${baseUrl}.com/${username}` : `https://www.${baseUrl}.com`,
      exists,
      username,
      note: exists ? 
        'Profile found' : 
        `Username ${username} not found on ${platform}`
    };
  });
  
  return { 
    success: true,
    username,
    results
  };
};

/**
 * Perform a Google dork search for cameras and other web resources
 * This simulates what a real google dork search would return
 */
export const googleDorkSearch = async (query: string): Promise<{
  success: boolean;
  query: string;
  results: Array<{
    id: string;
    title: string;
    url: string;
    snippet: string;
    isCamera: boolean;
  }>;
}> => {
  await simulateNetworkDelay(1500);
  
  // Parse the dork if available
  const parsedDork = parseGoogleDork(query);
  
  // Determine if this is likely a camera search
  const isCameraSearch = query.toLowerCase().includes('camera') || 
                       query.toLowerCase().includes('webcam') || 
                       query.toLowerCase().includes('rtsp') || 
                       query.toLowerCase().includes('cctv') ||
                       query.toLowerCase().includes('viewerframe') ||
                       query.toLowerCase().includes('axis') ||
                       query.toLowerCase().includes('hikvision') ||
                       query.toLowerCase().includes('dahua');
  
  // Generate a set of plausible results
  const numResults = Math.floor(Math.random() * 8) + 3;
  const results = [];
  
  // Camera-related titles and snippets
  const cameraTitles = [
    'Live Camera Feed - Security Camera',
    'Public Webcam - Traffic Camera',
    'Hikvision IP Camera - Web Interface',
    'Dahua Technology - Web Service',
    'AXIS Network Camera',
    'WebcamXP Stream - Live Camera',
    'Security Camera Control Panel',
    'Network Video Recorder - Camera System',
    'RTSP Stream - Live Camera Feed',
    'IP Camera Viewer - Surveillance System'
  ];
  
  const cameraSnippets = [
    'Live streaming camera with 24/7 monitoring. Access the feed through the web interface.',
    'Public webcam providing real-time traffic monitoring. View the current conditions.',
    'Security camera system with motion detection. Administrator access required.',
    'Network camera with pan, tilt, and zoom capabilities. High-definition video streaming.',
    'Surveillance system with cloud storage and remote access. View your security feeds from anywhere.',
    'IP camera with night vision and infrared capabilities. Perfect for 24/7 monitoring.',
    'WebcamXP server hosting multiple camera feeds. Access requires authentication.',
    'Traffic monitoring camera installed at major intersection. Public access allowed.',
    'Security camera with facial recognition technology. Authorized personnel only.',
    'Outdoor surveillance camera with weather-resistant housing. Live feed available.'
  ];
  
  // Generic web titles and snippets
  const webTitles = [
    'Home Network Setup - Router Configuration',
    'Network Security Blog - Best Practices',
    'System Administration - Server Setup',
    'IoT Device Management - Smart Home',
    'Network Monitoring Tools - IT Solutions',
    'Cybersecurity Forum - Discussion',
    'Web Server Configuration - Apache',
    'Remote Access Solutions - VPN Setup',
    'Network Diagnostic Tools - Troubleshooting',
    'IT Infrastructure Management'
  ];
  
  const webSnippets = [
    'Learn how to configure your home network for optimal security and performance.',
    'Best practices for securing your network against common threats and vulnerabilities.',
    'Step-by-step guide to setting up and managing servers in a business environment.',
    'Managing your Internet of Things devices with advanced security protocols.',
    'Tools and techniques for monitoring network traffic and detecting anomalies.',
    'Discussion forum for cybersecurity professionals to share insights and experiences.',
    'Configuration tips for Apache web server to enhance performance and security.',
    'Setting up secure remote access to your network using VPN technology.',
    'Diagnostic tools to help identify and resolve network connectivity issues.',
    'Comprehensive guide to managing IT infrastructure in enterprise environments.'
  ];
  
  for (let i = 0; i < numResults; i++) {
    const isCameraResult = isCameraSearch ? (Math.random() > 0.3) : (Math.random() > 0.8);
    
    const titles = isCameraResult ? cameraTitles : webTitles;
    const snippets = isCameraResult ? cameraSnippets : webSnippets;
    
    const titleIndex = Math.floor(Math.random() * titles.length);
    const snippetIndex = Math.floor(Math.random() * snippets.length);
    
    // Generate a plausible URL
    const domains = ['example.com', 'camera-server.net', 'security-system.org', 'webcam-stream.io', 'surveillance.tech'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const paths = ['/stream', '/view', '/camera', '/live', '/feed', '/webservice', '/interface', '/monitor'];
    const path = paths[Math.floor(Math.random() * paths.length)];
    const port = Math.random() > 0.5 ? `:${8000 + Math.floor(Math.random() * 2000)}` : '';
    const url = `http://${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}${port}${path}`;
    
    results.push({
      id: `result-${Date.now()}-${i}`,
      title: titles[titleIndex],
      url: url,
      snippet: snippets[snippetIndex],
      isCamera: isCameraResult
    });
  }
  
  return {
    success: true,
    query: query,
    results: results
  };
};

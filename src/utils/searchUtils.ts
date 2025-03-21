
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

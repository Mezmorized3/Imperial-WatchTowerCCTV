import { CameraResult } from '@/types/scanner';

// This function will handle opening an RTSP stream
export const openRtspStream = (camera: CameraResult): string => {
  // Return a properly formatted URL for our viewer
  const rtspUrl = camera.url || `rtsp://${camera.ip}:${camera.port || 554}/Streaming/Channels/101`;
  
  // Construct a URL to our viewer page with the camera info
  const viewerUrl = `/viewer?url=${encodeURIComponent(rtspUrl)}&name=${encodeURIComponent(camera.brand || '')} ${encodeURIComponent(camera.model || '')}`;
  
  // Open the viewer in a new window or tab
  window.open(viewerUrl, '_blank');
  
  return rtspUrl;
};

// Expose regions data for the UI
export const REGIONS = [
  { code: 'us', name: 'United States' },
  { code: 'eu', name: 'Europe' },
  { code: 'asia', name: 'Asia' },
  { code: 'sa', name: 'South America' },
  { code: 'af', name: 'Africa' },
  { code: 'ru', name: 'Russia' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'cn', name: 'China' },
  { code: 'pl', name: 'Poland' },
  { code: 'ro', name: 'Romania' },
  { code: 'ge', name: 'Georgia' },
  { code: 'il', name: 'Israel' },
  { code: 'ps', name: 'Palestine' },
  { code: 'lb', name: 'Lebanon' },
  { code: 'eg', name: 'Egypt' },
  { code: 'sy', name: 'Syria' },
  { code: 'ir', name: 'Iran' },
  { code: 'jo', name: 'Jordan' }
];

// Add more detailed country IP ranges based on research
export const DETAILED_COUNTRY_IP_RANGES = {
  ge: [ // Georgia
    { 
      range: "5.152.0.0/17", 
      description: "32,768 IPs, JSC 'Silknet'", 
      assignDate: "2012-07-18" 
    },
    { 
      range: "31.146.0.0/16", 
      description: "65,536 IPs, JSC 'Silknet'", 
      assignDate: "2011-02-10" 
    },
    { 
      range: "37.110.160.0/19", 
      description: "8,192 IPs, JSC 'Silknet'", 
      assignDate: "2012-02-08" 
    },
  ],
  ro: [ // Romania
    { 
      range: "5.2.128.0/17", 
      description: "32,768 IPs, RCS & RDS SA", 
      assignDate: "2012-04-27" 
    },
    { 
      range: "5.12.0.0/14", 
      description: "262,144 IPs, RCS & RDS SA", 
      assignDate: "2012-04-27" 
    },
    { 
      range: "31.5.0.0/16", 
      description: "65,536 IPs, Vodafone Romania S.A.", 
      assignDate: "2011-04-08" 
    },
  ],
  ua: [ // Ukraine
    { 
      range: "5.1.0.0/19", 
      description: "8,192 IPs, PRIVATE JOINT STOCK COMPANY 'DATAGROUP'", 
      assignDate: "2012-04-24" 
    },
    { 
      range: "5.58.0.0/16", 
      description: "65,536 IPs, Lanet Network Ltd", 
      assignDate: "2012-06-01" 
    },
    { 
      range: "5.105.0.0/16", 
      description: "65,536 IPs, TRINITY TELECOM LLC", 
      assignDate: "2012-06-28" 
    },
  ],
  ru: [ // Russia (sample - would be expanded in real implementation)
    { 
      range: "5.3.0.0/16", 
      description: "65,536 IPs, JSC Rostelecom", 
      assignDate: "2012-04-30" 
    },
    { 
      range: "5.8.0.0/14", 
      description: "262,144 IPs, PJSC MegaFon", 
      assignDate: "2012-04-26" 
    },
    { 
      range: "5.16.0.0/14", 
      description: "262,144 IPs, PJSC MTS", 
      assignDate: "2012-04-27" 
    },
  ],
};

// Real IP ranges by country
export const COUNTRY_IP_RANGES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US East Coast', value: '23.10.0.0/16' },
    { label: 'US West Coast', value: '40.12.0.0/16' },
    { label: 'US Government', value: '161.203.0.0/16' }
  ],
  ru: [
    { label: 'Moscow Region', value: '95.174.0.0/16' },
    { label: 'St. Petersburg', value: '178.176.0.0/16' },
    { label: 'Russian Federation ISPs', value: '5.18.0.0/16' },
    { label: 'Rostelecom', value: '213.87.0.0/16' },
    { label: 'Moscow Government', value: '87.245.0.0/16' },
    { label: 'Ural Region', value: '91.210.0.0/16' }
  ],
  cn: [
    { label: 'Beijing', value: '180.149.0.0/16' },
    { label: 'Shanghai', value: '116.224.0.0/16' }
  ],
  ua: [
    { label: 'Kiev', value: '176.38.0.0/16' },
    { label: 'Lviv', value: '77.121.0.0/16' },
    { label: 'Odessa', value: '195.138.0.0/16' },
    { label: 'Kharkiv', value: '46.98.0.0/16' },
    { label: 'Kyiv ISPs', value: '91.207.0.0/16' },
    { label: 'Ukrainian Government', value: '194.44.0.0/16' },
    { label: 'Dnipro', value: '193.151.0.0/16' },
    { label: 'Eastern Ukraine', value: '46.211.0.0/16' }
  ],
  pl: [
    { label: 'Warsaw', value: '5.184.0.0/16' },
    { label: 'Krakow', value: '5.173.0.0/16' },
    { label: 'Government Networks', value: '149.156.0.0/16' }
  ],
  ro: [
    { label: 'Bucharest', value: '79.112.0.0/16' },
    { label: 'Cluj', value: '188.26.0.0/16' },
    { label: 'Timisoara', value: '109.163.0.0/16' },
    { label: 'Government Infrastructure', value: '193.226.0.0/16' },
    { label: 'Telecom Romania', value: '81.196.0.0/16' },
    { label: 'Academic Networks', value: '141.85.0.0/16' }
  ],
  ge: [
    { label: 'Tbilisi', value: '31.146.0.0/16' },
    { label: 'Batumi', value: '85.114.0.0/16' },
    { label: 'Government', value: '91.151.0.0/16' }
  ],
  il: [
    { label: 'Tel Aviv', value: '62.219.0.0/16' },
    { label: 'Jerusalem', value: '82.80.0.0/16' },
    { label: 'Haifa', value: '31.154.0.0/16' },
    { label: 'Northern Border', value: '212.179.0.0/16' },
    { label: 'Gaza Border', value: '212.235.0.0/16' },
    { label: 'Lebanon Border', value: '77.124.0.0/16' },
    { label: 'Beersheba', value: '79.176.0.0/16' },
    { label: 'West Bank Border', value: '2.55.0.0/16' },
    { label: 'Eilat', value: '31.168.0.0/16' }
  ],
  ps: [
    { label: 'Gaza City', value: '188.161.0.0/16' },
    { label: 'Khan Yunis', value: '188.225.0.0/16' },
    { label: 'Ramallah', value: '213.6.0.0/16' },
    { label: 'Hebron', value: '188.225.0.0/16' },
    { label: 'Nablus', value: '188.161.0.0/16' },
    { label: 'Bethlehem', value: '212.106.0.0/16' },
    { label: 'Jericho', value: '46.32.0.0/16' }
  ],
  lb: [
    { label: 'Beirut', value: '85.112.0.0/16' },
    { label: 'Tripoli', value: '46.227.0.0/16' },
    { label: 'Sidon', value: '178.135.0.0/16' },
    { label: 'Tyre', value: '94.187.0.0/16' },
    { label: 'Southern Border', value: '77.42.0.0/16' },
    { label: 'Eastern Border', value: '185.98.0.0/16' },
    { label: 'Northern Border', value: '195.112.0.0/16' }
  ],
  eg: [
    { label: 'Cairo', value: '41.33.0.0/16' },
    { label: 'Alexandria', value: '41.47.0.0/16' },
    { label: 'Sinai Peninsula', value: '196.218.0.0/16' },
    { label: 'Gaza Border', value: '197.199.0.0/16' },
    { label: 'Rafah', value: '156.199.0.0/16' },
    { label: 'Port Said', value: '41.129.0.0/16' },
    { label: 'Suez', value: '41.32.0.0/16' }
  ],
  sy: [
    { label: 'Damascus', value: '31.9.0.0/16' },
    { label: 'Aleppo', value: '46.53.0.0/16' },
    { label: 'Homs', value: '77.44.0.0/16' },
    { label: 'Lebanon Border', value: '5.154.0.0/16' },
    { label: 'Iraq Border', value: '5.0.0.0/16' },
    { label: 'Turkey Border', value: '37.48.0.0/16' },
    { label: 'Jordan Border', value: '31.14.0.0/16' },
    { label: 'Golan Heights', value: '188.133.0.0/16' }
  ],
  ir: [
    { label: 'Tehran', value: '2.144.0.0/16' },
    { label: 'Mashhad', value: '5.134.0.0/16' },
    { label: 'Isfahan', value: '37.255.0.0/16' },
    { label: 'Tabriz', value: '83.147.0.0/16' },
    { label: 'Iraq Border', value: '91.98.0.0/16' },
    { label: 'Turkish Border', value: '94.74.0.0/16' },
    { label: 'Pakistani Border', value: '178.131.0.0/16' },
    { label: 'Persian Gulf', value: '185.51.0.0/16' }
  ],
  jo: [
    { label: 'Amman', value: '46.32.0.0/16' },
    { label: 'Irbid', value: '77.246.0.0/16' },
    { label: 'Zarqa', value: '91.186.0.0/16' },
    { label: 'Aqaba', value: '212.34.0.0/16' },
    { label: 'West Bank Border', value: '213.139.0.0/16' },
    { label: 'Syria Border', value: '92.242.0.0/16' },
    { label: 'Iraq Border', value: '188.247.0.0/16' },
    { label: 'Saudi Border', value: '109.109.0.0/16' }
  ]
};

// Real Shodan queries by country
export const COUNTRY_SHODAN_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US Public Cameras', value: 'webcamxp country:US port:80,8080' },
    { label: 'US Hikvision', value: 'product:hikvision country:US' }
  ],
  ru: [
    { label: 'Russian Cameras', value: 'webcam country:RU' },
    { label: 'Moscow CCTV', value: 'webcamxp city:Moscow' },
    { label: 'Russian Traffic Cams', value: 'product:axis country:RU has_screenshot:true' }
  ],
  cn: [
    { label: 'China IP Cameras', value: 'has_screenshot:true product:hikvision country:CN' },
    { label: 'Beijing Cameras', value: 'webcam city:Beijing has_screenshot:true' }
  ],
  ua: [
    { label: 'Ukraine Public Cameras', value: 'country:UA has_screenshot:true webcam' },
    { label: 'Kiev Traffic Cams', value: 'city:Kiev country:UA port:80,8080 webcam' },
    { label: 'Ukraine Border Cams', value: 'country:UA product:dahua has_screenshot:true' },
    { label: 'Odessa Harbor Cams', value: 'city:Odessa country:UA port:554 has_screenshot:true' }
  ],
  pl: [
    { label: 'Poland Traffic Cams', value: 'country:PL webcam has_screenshot:true' },
    { label: 'Warsaw Public Areas', value: 'city:Warsaw country:PL port:80,8080,554 product:hikvision' },
    { label: 'Polish Border Surveillance', value: 'country:PL product:dahua has_screenshot:true' }
  ],
  ro: [
    { label: 'Romania Public Cameras', value: 'country:RO has_screenshot:true webcam' },
    { label: 'Bucharest CCTV', value: 'city:Bucharest country:RO product:hikvision' },
    { label: 'Romanian Highway Cams', value: 'country:RO port:554 product:axis has_screenshot:true' }
  ],
  ge: [
    { label: 'Georgia Public Cameras', value: 'country:GE has_screenshot:true webcam' },
    { label: 'Tbilisi Street Cams', value: 'city:Tbilisi country:GE product:hikvision' },
    { label: 'Georgia Border Surveillance', value: 'country:GE port:554 has_screenshot:true' }
  ],
  il: [
    { label: 'Israel CCTV', value: 'webcam country:IL has_screenshot:true' },
    { label: 'Tel Aviv Traffic Cams', value: 'webcamxp city:"Tel Aviv" country:IL' },
    { label: 'Border Surveillance', value: 'product:hikvision country:IL has_screenshot:true' },
    { label: 'Jerusalem Security Cameras', value: 'camera city:Jerusalem country:IL port:80,8080' }
  ],
  ps: [
    { label: 'Palestine Public Cameras', value: 'webcam country:PS has_screenshot:true' },
    { label: 'Gaza Security', value: 'webcamxp city:Gaza country:PS' },
    { label: 'West Bank Surveillance', value: 'product:dahua country:PS has_screenshot:true' },
    { label: 'Ramallah Cameras', value: 'camera city:Ramallah country:PS port:80,8080' }
  ],
  lb: [
    { label: 'Lebanon Public Cameras', value: 'webcam country:LB has_screenshot:true' },
    { label: 'Beirut CCTV', value: 'webcamxp city:Beirut country:LB' },
    { label: 'South Lebanon Surveillance', value: 'product:hikvision country:LB has_screenshot:true' },
    { label: 'Border Monitoring', value: 'camera country:LB product:axis has_screenshot:true' }
  ],
  eg: [
    { label: 'Egypt CCTV Systems', value: 'webcam country:EG has_screenshot:true' },
    { label: 'Cairo Traffic', value: 'webcamxp city:Cairo country:EG port:80,8080' },
    { label: 'Sinai Security', value: 'product:dahua country:EG location:"Sinai" has_screenshot:true' },
    { label: 'Border Surveillance', value: 'camera country:EG product:hikvision port:554' }
  ],
  sy: [
    { label: 'Syria Public Cameras', value: 'webcam country:SY has_screenshot:true' },
    { label: 'Damascus Surveillance', value: 'webcamxp city:Damascus country:SY' },
    { label: 'Border Monitoring', value: 'product:hikvision country:SY has_screenshot:true' },
    { label: 'Urban CCTV', value: 'camera country:SY product:dahua port:80,8080' }
  ],
  ir: [
    { label: 'Iran CCTV Networks', value: 'webcam country:IR has_screenshot:true' },
    { label: 'Tehran Monitoring', value: 'webcamxp city:Tehran country:IR port:80,8080' },
    { label: 'Border Surveillance', value: 'product:hikvision country:IR has_screenshot:true' },
    { label: 'Critical Infrastructure', value: 'camera country:IR product:dahua port:554' }
  ],
  jo: [
    { label: 'Jordan Public Cameras', value: 'webcam country:JO has_screenshot:true' },
    { label: 'Amman Traffic Monitoring', value: 'webcamxp city:Amman country:JO port:80,8080' },
    { label: 'Border Security', value: 'product:hikvision country:JO has_screenshot:true' },
    { label: 'Urban Surveillance', value: 'camera country:JO product:dahua port:554' }
  ]
};

// Real ZoomEye queries by country
export const COUNTRY_ZOOMEYE_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US IP Cameras', value: 'app:"IP Camera" country:US' },
    { label: 'US Hikvision Cameras', value: 'app:"hikvision" country:US' },
    { label: 'US Dahua Devices', value: 'app:"dahua" country:US' }
  ],
  ru: [
    { label: 'Russian CCTV', value: 'app:"webcam" country:RU' },
    { label: 'Moscow IP Cameras', value: 'app:"IP Camera" city:Moscow' },
    { label: 'Russian Surveillance', value: 'app:"surveillance" country:RU' }
  ],
  cn: [
    { label: 'China Surveillance', value: 'app:"hikvision" country:CN' },
    { label: 'Beijing Cameras', value: 'app:"webcam" city:Beijing' }
  ],
  ua: [
    { label: 'Ukraine Cameras', value: 'app:"webcam" country:UA' },
    { label: 'Kiev IP Cameras', value: 'app:"IP Camera" city:Kiev' },
    { label: 'Ukraine Hikvision', value: 'app:"hikvision" country:UA' }
  ],
  pl: [
    { label: 'Poland Surveillance', value: 'app:"surveillance" country:PL' },
    { label: 'Warsaw Cameras', value: 'app:"webcam" city:Warsaw' }
  ],
  ro: [
    { label: 'Romania CCTV', value: 'app:"webcam" country:RO' },
    { label: 'Bucharest Cameras', value: 'app:"IP Camera" city:Bucharest' }
  ],
  ge: [
    { label: 'Georgia Surveillance', value: 'app:"surveillance" country:GE' },
    { label: 'Tbilisi Cameras', value: 'app:"webcam" city:Tbilisi' }
  ],
  il: [
    { label: 'Israel Surveillance', value: 'app:"webcam" country:IL' },
    { label: 'Tel Aviv IP Cameras', value: 'app:"IP Camera" city:"Tel Aviv"' },
    { label: 'Border Security Systems', value: 'app:"hikvision" country:IL' },
    { label: 'Urban Monitoring', value: 'app:"dahua" country:IL' }
  ],
  ps: [
    { label: 'Palestine Cameras', value: 'app:"webcam" country:PS' },
    { label: 'Gaza Surveillance', value: 'app:"IP Camera" city:Gaza' },
    { label: 'West Bank Monitoring', value: 'app:"hikvision" country:PS' },
    { label: 'Urban Security', value: 'app:"dahua" country:PS' }
  ],
  lb: [
    { label: 'Lebanon Cameras', value: 'app:"webcam" country:LB' },
    { label: 'Beirut Surveillance', value: 'app:"IP Camera" city:Beirut' },
    { label: 'Border Monitoring', value: 'app:"hikvision" country:LB' },
    { label: 'Security Systems', value: 'app:"dahua" country:LB' }
  ],
  eg: [
    { label: 'Egypt CCTV', value: 'app:"webcam" country:EG' },
    { label: 'Cairo IP Cameras', value: 'app:"IP Camera" city:Cairo' },
    { label: 'Border Surveillance', value: 'app:"hikvision" country:EG' },
    { label: 'Urban Security', value: 'app:"dahua" country:EG' }
  ],
  sy: [
    { label: 'Syria Cameras', value: 'app:"webcam" country:SY' },
    { label: 'Damascus Surveillance', value: 'app:"IP Camera" city:Damascus' },
    { label: 'Border Monitoring', value: 'app:"hikvision" country:SY' },
    { label: 'Security Systems', value: 'app:"dahua" country:SY' }
  ],
  ir: [
    { label: 'Iran CCTV', value: 'app:"webcam" country:IR' },
    { label: 'Tehran IP Cameras', value: 'app:"IP Camera" city:Tehran' },
    { label: 'Border Surveillance', value: 'app:"hikvision" country:IR' },
    { label: 'Critical Infrastructure', value: 'app:"dahua" country:IR' }
  ],
  jo: [
    { label: 'Jordan Cameras', value: 'app:"webcam" country:JO' },
    { label: 'Amman Surveillance', value: 'app:"IP Camera" city:Amman' },
    { label: 'Border Monitoring', value: 'app:"hikvision" country:JO' },
    { label: 'Urban Security', value: 'app:"dahua" country:JO' }
  ]
};

// Real Censys queries by country
export const COUNTRY_CENSYS_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US RTSP Cameras', value: 'services.port=554 and location.country.name="United States"' },
    { label: 'US Security DVRs', value: 'services.port=80 and services.http.response.html_title:"DVR" and location.country.name="United States"' }
  ],
  ru: [
    { label: 'Russian RTSP Streams', value: 'services.port=554 and location.country.name="Russia"' },
    { label: 'Moscow Webcams', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Russia" and location.city="Moscow"' }
  ],
  cn: [
    { label: 'China IP Cameras', value: 'services.port=80 and services.http.response.html_title:"ipcamera" and location.country.name="China"' },
    { label: 'China RTSP Streams', value: 'services.port=554 and location.country.name="China"' }
  ],
  ua: [
    { label: 'Ukraine Cameras', value: 'services.port=554 and location.country.name="Ukraine"' },
    { label: 'Kiev Surveillance', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Ukraine" and location.city="Kiev"' }
  ],
  pl: [
    { label: 'Poland Network Cameras', value: 'services.port=554 and location.country.name="Poland"' },
    { label: 'Warsaw CCTV', value: 'services.port=80 and services.http.response.html_title:"CCTV" and location.country.name="Poland" and location.city="Warsaw"' }
  ],
  ro: [
    { label: 'Romania Surveillance', value: 'services.port=554 and location.country.name="Romania"' },
    { label: 'Bucharest IP Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Romania" and location.city="Bucharest"' }
  ],
  ge: [
    { label: 'Georgia RTSP Streams', value: 'services.port=554 and location.country.name="Georgia"' },
    { label: 'Tbilisi Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Georgia" and location.city="Tbilisi"' }
  ],
  il: [
    { label: 'Israel RTSP Streams', value: 'services.port=554 and location.country.name="Israel"' },
    { label: 'Tel Aviv Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Israel" and location.city="Tel Aviv"' },
    { label: 'Border Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Israel"' },
    { label: 'Jerusalem CCTV', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Israel" and location.city="Jerusalem"' }
  ],
  ps: [
    { label: 'Palestine RTSP', value: 'services.port=554 and location.country.name="Palestine"' },
    { label: 'Gaza Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Palestine" and location.city="Gaza"' },
    { label: 'West Bank Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Palestine"' },
    { label: 'Ramallah CCTV', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Palestine" and location.city="Ramallah"' }
  ],
  lb: [
    { label: 'Lebanon RTSP', value: 'services.port=554 and location.country.name="Lebanon"' },
    { label: 'Beirut Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Lebanon" and location.city="Beirut"' },
    { label: 'Border Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Lebanon"' },
    { label: 'Southern Border Monitoring', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Lebanon" and location.city="Tyre"' }
  ],
  eg: [
    { label: 'Egypt RTSP', value: 'services.port=554 and location.country.name="Egypt"' },
    { label: 'Cairo Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Egypt" and location.city="Cairo"' },
    { label: 'Sinai Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Egypt" and location.city="Sinai"' },
    { label: 'Border Monitoring', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Egypt" and location.city="Rafah"' }
  ],
  sy: [
    { label: 'Syria RTSP', value: 'services.port=554 and location.country.name="Syria"' },
    { label: 'Damascus Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Syria" and location.city="Damascus"' },
    { label: 'Border Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Syria"' },
    { label: 'Northern Border Monitoring', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Syria" and location.city="Aleppo"' }
  ],
  ir: [
    { label: 'Iran RTSP', value: 'services.port=554 and location.country.name="Iran"' },
    { label: 'Tehran Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Iran" and location.city="Tehran"' },
    { label: 'Border Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Iran"' },
    { label: 'Critical Infrastructure', value: 'services.port=80 and services.http.response.html_title:"dahua" and location.country.name="Iran"' }
  ],
  jo: [
    { label: 'Jordan RTSP', value: 'services.port=554 and location.country.name="Jordan"' },
    { label: 'Amman Cameras', value: 'services.port=80 and services.http.response.html_title:"camera" and location.country.name="Jordan" and location.city="Amman"' },
    { label: 'Border Surveillance', value: 'services.port=80 and services.http.response.html_title:"hikvision" and location.country.name="Jordan"' },
    { label: 'Western Border Monitoring', value: 'services.port=80 and services.http.response.html_title:"webcam" and location.country.name="Jordan" and location.city="Irbid"' }
  ]
};

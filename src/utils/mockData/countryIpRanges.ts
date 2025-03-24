
/**
 * Mock data for country IP ranges, focusing on Ukraine, Russia, Georgia, and Romania
 */

// These IP ranges are mock data for educational purposes only
export const COUNTRY_IP_RANGES = {
  // Georgia IP ranges
  ge: [
    { label: 'Georgia - Tbilisi ISP', value: '5.152.0.0/16' },
    { label: 'Georgia - Batumi Network', value: '31.146.0.0/16' },
    { label: 'Georgia - Caucasus Online', value: '37.110.16.0/21' },
    { label: 'Georgia - Kutaisi Municipal', value: '46.49.0.0/17' },
    { label: 'Georgia - GTelecom', value: '95.137.240.0/21' }
  ],
  
  // Romania IP ranges
  ro: [
    { label: 'Romania - Bucharest ISP', value: '5.2.0.0/16' },
    { label: 'Romania - Cluj Network', value: '5.12.0.0/16' },
    { label: 'Romania - Timisoara Grid', value: '31.5.0.0/16' },
    { label: 'Romania - RCS & RDS', value: '79.112.0.0/13' },
    { label: 'Romania - Iasi Metro', value: '109.163.224.0/19' }
  ],
  
  // Ukraine IP ranges
  ua: [
    { label: 'Ukraine - Kyiv ISP', value: '5.58.0.0/16' },
    { label: 'Ukraine - Lviv Network', value: '5.105.0.0/16' },
    { label: 'Ukraine - Odesa Metro', value: '31.43.0.0/16' },
    { label: 'Ukraine - Kharkiv Grid', value: '37.52.0.0/16' },
    { label: 'Ukraine - Ukrtelecom', value: '91.197.0.0/16' }
  ],
  
  // Russia IP ranges
  ru: [
    { label: 'Russia - Moscow ISP', value: '5.3.0.0/16' },
    { label: 'Russia - Saint Petersburg Net', value: '5.8.0.0/16' },
    { label: 'Russia - Kazan Grid', value: '5.16.0.0/16' },
    { label: 'Russia - Novosibirsk Metro', value: '37.9.0.0/16' },
    { label: 'Russia - Rostelecom', value: '91.232.0.0/16' }
  ]
};

// More detailed information for each IP range
export const DETAILED_COUNTRY_IP_RANGES = {
  ge: [
    { range: '5.152.0.0/16', description: 'Tbilisi ISP Network', assignDate: '2015-03-14' },
    { range: '31.146.0.0/16', description: 'Batumi Coastal Network', assignDate: '2012-08-22' },
    { range: '37.110.16.0/21', description: 'Caucasus Online', assignDate: '2011-11-04' },
    { range: '46.49.0.0/17', description: 'Kutaisi Municipal Network', assignDate: '2013-07-17' },
    { range: '95.137.240.0/21', description: 'GTelecom Service Provider', assignDate: '2010-01-28' }
  ],
  
  ro: [
    { range: '5.2.0.0/16', description: 'Bucharest Central ISP', assignDate: '2014-09-11' },
    { range: '5.12.0.0/16', description: 'Cluj-Napoca Metropolitan', assignDate: '2012-04-29' },
    { range: '31.5.0.0/16', description: 'Timisoara Regional Grid', assignDate: '2011-02-16' },
    { range: '79.112.0.0/13', description: 'RCS & RDS Backbone', assignDate: '2008-11-08' },
    { range: '109.163.224.0/19', description: 'Iasi Academic Network', assignDate: '2009-07-20' }
  ],
  
  ua: [
    { range: '5.58.0.0/16', description: 'Kyiv Central Network', assignDate: '2013-12-03' },
    { range: '5.105.0.0/16', description: 'Lviv Western Provider', assignDate: '2012-06-18' },
    { range: '31.43.0.0/16', description: 'Odesa Southern Grid', assignDate: '2011-09-25' },
    { range: '37.52.0.0/16', description: 'Kharkiv Eastern Network', assignDate: '2010-04-12' },
    { range: '91.197.0.0/16', description: 'Ukrtelecom National ISP', assignDate: '2007-08-30' }
  ],
  
  ru: [
    { range: '5.3.0.0/16', description: 'Moscow Central Network', assignDate: '2014-02-17' },
    { range: '5.8.0.0/16', description: 'Saint Petersburg Northwest', assignDate: '2012-11-09' },
    { range: '5.16.0.0/16', description: 'Kazan Volga Region', assignDate: '2011-05-22' },
    { range: '37.9.0.0/16', description: 'Novosibirsk Siberian Grid', assignDate: '2010-08-14' },
    { range: '91.232.0.0/16', description: 'Rostelecom Federal Backbone', assignDate: '2007-03-06' }
  ]
};

// Create search queries for different platforms
export const COUNTRY_SHODAN_QUERIES = {
  ge: [
    { label: 'Georgia - Security Cameras', value: 'country:GE port:554 has_screenshot:true' },
    { label: 'Georgia - Web Cameras', value: 'country:GE product:webcam' },
    { label: 'Georgia - Hikvision DVRs', value: 'country:GE product:hikvision' },
    { label: 'Georgia - Dahua Devices', value: 'country:GE product:"dahua dvr"' }
  ],
  
  ro: [
    { label: 'Romania - CCTV Systems', value: 'country:RO port:554 has_screenshot:true' },
    { label: 'Romania - IP Cameras', value: 'country:RO product:"IP Camera"' },
    { label: 'Romania - Hikvision', value: 'country:RO product:hikvision' },
    { label: 'Romania - Public Cameras', value: 'country:RO category:cameras' }
  ],
  
  ua: [
    { label: 'Ukraine - RTSP Streams', value: 'country:UA port:554' },
    { label: 'Ukraine - Traffic Cameras', value: 'country:UA "traffic camera"' },
    { label: 'Ukraine - DVR Systems', value: 'country:UA product:dvr' },
    { label: 'Ukraine - Public Webcams', value: 'country:UA webcam city:Kyiv' }
  ],
  
  ru: [
    { label: 'Russia - Security Cameras', value: 'country:RU port:554 has_screenshot:true' },
    { label: 'Russia - Urban CCTV', value: 'country:RU product:"cctv" city:Moscow' },
    { label: 'Russia - Highway Cameras', value: 'country:RU "highway camera"' },
    { label: 'Russia - Network DVRs', value: 'country:RU product:"network dvr"' }
  ]
};

export const COUNTRY_ZOOMEYE_QUERIES = {
  ge: [
    { label: 'Georgia - RTSP Cameras', value: 'country:GE app:"rtsp"' },
    { label: 'Georgia - Hikvision', value: 'country:GE app:"hikvision cameras"' },
    { label: 'Georgia - ONVIF', value: 'country:GE app:"onvif"' }
  ],
  
  ro: [
    { label: 'Romania - Camera Streams', value: 'country:RO app:"streaming cameras"' },
    { label: 'Romania - Dahua', value: 'country:RO app:"dahua cameras"' },
    { label: 'Romania - CCTV', value: 'country:RO app:"cctv"' }
  ],
  
  ua: [
    { label: 'Ukraine - RTSP Servers', value: 'country:UA app:"rtsp server"' },
    { label: 'Ukraine - Webcams', value: 'country:UA app:"webcam"' },
    { label: 'Ukraine - DVR', value: 'country:UA app:"dvr"' }
  ],
  
  ru: [
    { label: 'Russia - Security Cameras', value: 'country:RU app:"security camera"' },
    { label: 'Russia - CCTV Systems', value: 'country:RU app:"cctv system"' },
    { label: 'Russia - IP Cameras', value: 'country:RU app:"ip camera"' }
  ]
};

export const COUNTRY_CENSYS_QUERIES = {
  ge: [
    { label: 'Georgia - RTSP Services', value: 'services.port=554 and services.service_name="rtsp" and location.country=GE' },
    { label: 'Georgia - Camera HTTP', value: 'services.service_name="http" and location.country=GE and services.http.response.headers.server:"(camera|webcam)"' }
  ],
  
  ro: [
    { label: 'Romania - Streaming Ports', value: 'services.port=554 and services.service_name="rtsp" and location.country=RO' },
    { label: 'Romania - DVR Systems', value: 'services.service_name="http" and location.country=RO and services.http.response.headers.server:"dvr"' }
  ],
  
  ua: [
    { label: 'Ukraine - RTSP Cameras', value: 'services.port=554 and services.service_name="rtsp" and location.country=UA' },
    { label: 'Ukraine - HTTP Cameras', value: 'services.service_name="http" and location.country=UA and services.http.response.body:"camera"' }
  ],
  
  ru: [
    { label: 'Russia - RTSP Services', value: 'services.port=554 and services.service_name="rtsp" and location.country=RU' },
    { label: 'Russia - Security Systems', value: 'services.service_name="http" and location.country=RU and services.http.response.body:"cctv"' }
  ]
};

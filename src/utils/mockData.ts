import { CameraResult } from "@/types/scanner";

export const MOCK_CAMERA_RESULTS: CameraResult[] = [
  {
    id: "1",
    ip: "192.168.1.100",
    port: 80,
    brand: "Hikvision",
    model: "DS-2CD2142FWD-I",
    url: "http://192.168.1.100",
    snapshotUrl: "/onvif-http/snapshot",
    status: "vulnerable",
    credentials: {
      username: "admin",
      password: "12345"
    },
    vulnerabilities: [
      {
        name: "CVE-2017-7921",
        severity: "critical",
        description: "Authentication bypass vulnerability in Hikvision IP cameras"
      }
    ],
    location: {
      country: "Romania",
      city: "Bucharest",
      latitude: 44.4268,
      longitude: 26.1025
    },
    lastSeen: "2023-10-15T14:30:00Z",
    accessLevel: "admin",
    responseTime: 230
  },
  {
    id: "2",
    ip: "192.168.1.101",
    port: 8080,
    brand: "Dahua",
    model: "IPC-HDBW2231R-ZS",
    url: "http://192.168.1.101:8080",
    snapshotUrl: "/cgi-bin/snapshot.cgi",
    status: "online",
    credentials: null,
    location: {
      country: "Ukraine",
      city: "Kyiv",
      latitude: 50.4501,
      longitude: 30.5234
    },
    lastSeen: "2023-10-15T14:35:00Z",
    accessLevel: "view",
    responseTime: 150
  },
  {
    id: "3",
    ip: "192.168.1.102",
    port: 554,
    brand: "EZVIZ",
    model: "C3W",
    url: "http://192.168.1.102",
    snapshotUrl: "/ISAPI/Streaming/channels/101/picture",
    status: "authenticated",
    credentials: {
      username: "admin",
      password: "admin"
    },
    location: {
      country: "Georgia",
      city: "Tbilisi",
      latitude: 41.7151,
      longitude: 44.8271
    },
    lastSeen: "2023-10-15T14:40:00Z",
    accessLevel: "admin",
    responseTime: 180
  },
  {
    id: "4",
    ip: "192.168.1.103",
    port: 80,
    brand: "Axis",
    model: "P1448-LE",
    url: "http://192.168.1.103",
    snapshotUrl: "/axis-cgi/jpg/image.cgi",
    status: "online",
    location: {
      country: "Russia",
      city: "Moscow",
      latitude: 55.7558,
      longitude: 37.6173
    },
    lastSeen: "2023-10-15T14:45:00Z",
    accessLevel: "view",
    responseTime: 200
  },
  {
    id: "5",
    ip: "192.168.1.104",
    port: 80,
    brand: "Unknown",
    url: "http://192.168.1.104",
    status: "offline",
    location: {
      country: "Romania",
      city: "Cluj-Napoca"
    },
    lastSeen: "2023-10-15T13:00:00Z",
    accessLevel: "none"
  }
];

export const REGIONS = [
  { code: "RO", name: "Romania" },
  { code: "UA", name: "Ukraine" },
  { code: "GE", name: "Georgia" },
  { code: "RU", name: "Russia" },
  { code: "MD", name: "Moldova" },
  { code: "BY", name: "Belarus" },
  { code: "BG", name: "Bulgaria" },
  { code: "HU", name: "Hungary" },
  { code: "PL", name: "Poland" },
  { code: "SK", name: "Slovakia" }
];

export const DEFAULT_CREDENTIALS = {
  hikvision: [
    { username: "admin", password: "12345" },
    { username: "admin", password: "admin" }
  ],
  dahua: [
    { username: "admin", password: "admin" },
    { username: "888888", password: "888888" }
  ],
  ezviz: [
    { username: "admin", password: "admin" },
    { username: "admin", password: "12345" },
    { username: "admin", password: "" },
    { username: "user", password: "user" },
    { username: "guest", password: "guest" }
  ],
  axis: [
    { username: "root", password: "pass" },
    { username: "admin", password: "admin" }
  ]
};

export const COUNTRY_IP_RANGES = {
  RO: [
    { label: "Romania - Bucharest (RCS & RDS)", value: "5.2.128.0/18" },
    { label: "Romania - Cluj (UPC Romania)", value: "77.81.128.0/18" },
    { label: "Romania - Timisoara (Telekom)", value: "79.112.0.0/13" },
    { label: "Romania - Iasi (Orange)", value: "86.120.0.0/13" },
    { label: "Romania - General", value: "109.99.0.0/16" }
  ],
  UA: [
    { label: "Ukraine - Kyiv (Ukrtelecom)", value: "31.43.0.0/16" },
    { label: "Ukraine - Odessa (Vega)", value: "46.211.0.0/17" },
    { label: "Ukraine - Lviv (UARNet)", value: "77.88.0.0/17" },
    { label: "Ukraine - Kharkiv (Triolan)", value: "176.36.0.0/15" },
    { label: "Ukraine - General", value: "178.136.0.0/15" }
  ],
  RU: [
    { label: "Russia - Moscow (Rostelecom)", value: "37.144.0.0/14" },
    { label: "Russia - St. Petersburg (MTS)", value: "46.188.0.0/15" },
    { label: "Russia - Kazan (ER-Telecom)", value: "85.26.0.0/17" },
    { label: "Russia - Novosibirsk (SibNet)", value: "90.188.0.0/15" },
    { label: "Russia - General", value: "188.168.0.0/14" }
  ]
};

export const COUNTRY_SHODAN_QUERIES = {
  RO: [
    { label: "Romania - Hikvision Cameras", value: "country:RO product:Hikvision port:80,8080,443" },
    { label: "Romania - Dahua Cameras", value: "country:RO product:Dahua port:80,8080,37777" },
    { label: "Romania - IP Cameras (General)", value: "country:RO webcam has_screenshot:true" },
    { label: "Romania - DVR/NVR Systems", value: "country:RO html:'DVR' has_screenshot:true" }
  ],
  UA: [
    { label: "Ukraine - Hikvision Cameras", value: "country:UA product:Hikvision port:80,8080,443" },
    { label: "Ukraine - Dahua Cameras", value: "country:UA product:Dahua port:80,8080,37777" },
    { label: "Ukraine - IP Cameras (General)", value: "country:UA webcam has_screenshot:true" },
    { label: "Ukraine - DVR/NVR Systems", value: "country:UA html:'DVR' has_screenshot:true" }
  ],
  RU: [
    { label: "Russia - Hikvision Cameras", value: "country:RU product:Hikvision port:80,8080,443" },
    { label: "Russia - Dahua Cameras", value: "country:RU product:Dahua port:80,8080,37777" },
    { label: "Russia - IP Cameras (General)", value: "country:RU webcam has_screenshot:true" },
    { label: "Russia - DVR/NVR Systems", value: "country:RU html:'DVR' has_screenshot:true" }
  ]
};

export const startMockScan = (
  onProgress: (progress: number, found: number) => void,
  onComplete: (results: CameraResult[]) => void,
  duration: number = 5000
) => {
  const steps = 10;
  const interval = duration / steps;
  let progress = 0;
  let found = 0;
  
  const timer = setInterval(() => {
    progress += 100 / steps;
    
    if (progress >= 40 && found === 0) {
      found = 1;
    } else if (progress >= 60 && found === 1) {
      found = 3;
    } else if (progress >= 90 && found === 3) {
      found = 5;
    }
    
    onProgress(progress, found);
    
    if (progress >= 100) {
      clearInterval(timer);
      onComplete(MOCK_CAMERA_RESULTS);
    }
  }, interval);
  
  return () => clearInterval(timer);
};

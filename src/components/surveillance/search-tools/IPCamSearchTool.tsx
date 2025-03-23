
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DETAILED_COUNTRY_IP_RANGES } from '@/utils/mockData';
import { calculateIpsInRange, getRandomIpInRange } from '@/utils/ipRangeUtils';
import { Label } from '@/components/ui/label';
import { Camera, Globe } from 'lucide-react';

interface SearchResult {
  id: string;
  type: string;
  source: string;
  content: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export const IPCamSearchTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSelectedRange("");
  };

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    setQuery(range);
  };

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter an IP range or specific IP",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    // Get more detailed scan information
    let scanInfo = `Scanning IP range: ${query}`;
    if (selectedCountry) {
      const countryNames: Record<string, string> = {
        ge: "Georgia",
        ro: "Romania",
        ua: "Ukraine",
        ru: "Russia"
      };
      
      scanInfo += ` (${countryNames[selectedCountry] || selectedCountry.toUpperCase()})`;
      
      if (selectedRange) {
        const countryRanges = DETAILED_COUNTRY_IP_RANGES[selectedCountry as keyof typeof DETAILED_COUNTRY_IP_RANGES] || [];
        const rangeInfo = countryRanges.find(r => r.range === selectedRange);
        
        if (rangeInfo) {
          const ipCount = calculateIpsInRange(selectedRange);
          scanInfo += ` - ${rangeInfo.description} (${ipCount.toLocaleString()} IPs)`;
        }
      }
    }

    // Simulate search process
    toast({
      title: "Search Started",
      description: scanInfo,
    });

    // Create a progress indicator
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setSearchProgress(Math.min(progress, 95));
      if (progress >= 95) clearInterval(progressInterval);
    }, 200);

    // Simulate search delay and results
    setTimeout(() => {
      const mockResults = generateMockResults(query);
      setResults(mockResults);
      setIsSearching(false);
      clearInterval(progressInterval);
      setSearchProgress(100);

      toast({
        title: "Search Complete",
        description: `Found ${mockResults.length} devices`,
      });

      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }, 2500);
  };

  // Generate mock results enhanced with country-specific details
  const generateMockResults = (ipRange: string): SearchResult[] => {
    const results: SearchResult[] = [];
    
    // Generate more results for known ranges
    const count = selectedCountry ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 5) + 1;
    
    // Get ISP information based on country
    let isps: string[] = ['Unknown ISP'];
    let models: string[] = ['Generic IP Camera'];
    
    switch (selectedCountry) {
      case 'ge': // Georgia
        isps = ['JSC Silknet', 'Magticom Ltd.', 'Caucasus Online'];
        models = ['Hikvision DS-2CD2xx5', 'Dahua IPC-HDW4433C-A', 'Generic Silknet Camera'];
        break;
      case 'ro': // Romania
        isps = ['RCS & RDS SA', 'Vodafone Romania S.A.', 'Telekom Romania'];
        models = ['Bosch DINION IP', 'Axis M2025-LE', 'UVR Pro Romanian Model'];
        break;
      case 'ua': // Ukraine
        isps = ['DATAGROUP', 'Lanet Network Ltd', 'TRINITY TELECOM LLC', 'Kyivstar'];
        models = ['Hikvision DS-2CD2xx3G2', 'Dahua PTZ 44225-IRE-N', 'ZNV Ukrainian Model'];
        break;
      case 'ru': // Russia
        isps = ['JSC Rostelecom', 'PJSC MegaFon', 'PJSC MTS', 'VimpelCom'];
        models = ['Hikvision DS-2CD2xx3', 'SOVA-N3215', 'Beward BD3570', 'Astra Nova RC'];
        break;
      default:
        isps = ['Local ISP', 'Regional Telecom', 'Internet Services Ltd.'];
        models = ['Hikvision DS-2CD2xx5', 'Dahua IPC-HDW4631', 'Axis M2025-LE', 'Bosch DINION IP'];
    }

    for (let i = 0; i < count; i++) {
      let ip;
      
      if (selectedRange && selectedRange.includes('/')) {
        // Generate IP from the CIDR range
        ip = getRandomIpInRange(selectedRange);
      } else if (ipRange.includes('/')) {
        // Generate IP from the provided CIDR range
        ip = getRandomIpInRange(ipRange);
      } else {
        // Fall back to modifying the provided IP or creating one
        const ipBase = ipRange.split('/')[0].split('.');
        const lastOctet = Math.floor(Math.random() * 255);
        ip = `${ipBase[0] || '192'}.${ipBase[1] || '168'}.${ipBase[2] || '1'}.${lastOctet}`;
      }
      
      // Select random ISP and model based on country
      const isp = isps[Math.floor(Math.random() * isps.length)];
      const model = models[Math.floor(Math.random() * models.length)];
      const ports = [80, 8080, 554, 443, 8000, 37777, 37778, 9000];
      const port = ports[Math.floor(Math.random() * ports.length)];
      
      results.push({
        id: `ipcam-${Date.now()}-${i}`,
        type: 'ipcamsearch',
        source: 'IPCam Protocol',
        content: `${ip}:${port}`,
        timestamp: new Date().toISOString(),
        meta: {
          protocol: ['ONVIF', 'RTSP', 'HTTP'][Math.floor(Math.random() * 3)],
          manufacturer: model.split(' ')[0],
          model: model,
          isp: isp,
          country: selectedCountry ? {
            'ge': 'Georgia',
            'ro': 'Romania',
            'ua': 'Ukraine',
            'ru': 'Russia'
          }[selectedCountry] : 'Unknown'
        }
      });
    }

    return results;
  };

  const countryCodes = Object.keys(DETAILED_COUNTRY_IP_RANGES);
  const countryNames: Record<string, string> = {
    ge: "Georgia",
    ro: "Romania",
    ua: "Ukraine",
    ru: "Russia"
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            placeholder="IP range (e.g., 192.168.1.0/24) or specific IP"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-scanner-dark border-gray-700 text-white"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
        >
          {isSearching ? "Scanning..." : "Scan"}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-300 text-sm mb-1 block">Country</Label>
          <Select value={selectedCountry} onValueChange={handleCountrySelect}>
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="">Any Country</SelectItem>
              {countryCodes.map(code => (
                <SelectItem key={code} value={code}>{countryNames[code] || code.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-gray-300 text-sm mb-1 block">IP Range</Label>
          <Select 
            value={selectedRange} 
            onValueChange={handleRangeSelect}
            disabled={!selectedCountry}
          >
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder={selectedCountry ? "Select range" : "Select country first"} />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              {selectedCountry && DETAILED_COUNTRY_IP_RANGES[selectedCountry as keyof typeof DETAILED_COUNTRY_IP_RANGES]?.map(range => (
                <SelectItem key={range.range} value={range.range}>
                  {range.range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-scanner-primary" />
            Devices Found ({results.length})
          </h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {results.map(result => (
              <div 
                key={result.id} 
                className="p-3 bg-scanner-dark rounded-md border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.source}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-blue-400 break-all">{result.content}</p>
                
                {result.meta && Object.keys(result.meta).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(result.meta).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-400">{key}: </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IPCamSearchTool;

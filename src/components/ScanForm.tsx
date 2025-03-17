
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, Search, Globe, FileText, AlertTriangle, Zap, MapPin, Database, Bell } from 'lucide-react';
import { ScanSettings, ScanTarget } from '@/types/scanner';
import { validateScanInput } from '@/utils/validation';
import { 
  REGIONS, 
  COUNTRY_IP_RANGES, 
  COUNTRY_SHODAN_QUERIES,
  COUNTRY_ZOOMEYE_QUERIES,
  COUNTRY_CENSYS_QUERIES
} from '@/utils/mockData';

interface ScanFormProps {
  onStartScan: (target: ScanTarget, settings: ScanSettings) => void;
  isScanning: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, isScanning }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scanType, setScanType] = useState<'ip' | 'range' | 'file' | 'shodan' | 'zoomeye' | 'censys'>('ip');
  const [scanValue, setScanValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  
  const [settings, setSettings] = useState<ScanSettings>({
    aggressive: false,
    testCredentials: true,
    checkVulnerabilities: true,
    saveSnapshots: false,
    regionFilter: [],
    threadsCount: 10,
    timeout: 3000,
    enableRealTimeMonitoring: false,
    alertThreshold: 'medium'
  });

  const handleInputChange = (value: string) => {
    setScanValue(value);
    if (value && !validateScanInput(value, scanType)) {
      if (scanType === 'ip') {
        setInputError('Invalid IP address format');
      } else if (scanType === 'range') {
        setInputError('Invalid CIDR format (e.g., 192.168.1.0/24)');
      } else if (['shodan', 'zoomeye', 'censys'].includes(scanType) && value.trim() === '') {
        setInputError(`Please enter a valid ${scanType} query`);
      } else {
        setInputError('');
      }
    } else {
      setInputError('');
    }
  };

  const handleStartScan = () => {
    if (!scanValue) {
      setInputError('Please enter a scan target');
      return;
    }
    
    if (!validateScanInput(scanValue, scanType)) {
      return;
    }
    
    onStartScan({ type: scanType, value: scanValue }, settings);
  };

  const updateSettings = (key: keyof ScanSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleRegionFilterChange = (regionCode: string) => {
    setSelectedCountry(regionCode);
    
    if (regionCode && regionCode !== 'all') {
      updateSettings('regionFilter', [regionCode]);
      setShowPresets(true);
    } else {
      updateSettings('regionFilter', []);
      setShowPresets(false);
      setSelectedCountry(null);
    }
  };

  const handlePresetSelection = (value: string) => {
    setScanValue(value);
    setInputError('');
  };

  const scanPlaceholder = {
    ip: '192.168.1.100',
    range: '192.168.1.0/24',
    file: 'Select a file with IP addresses',
    shodan: 'country:ua port:80,8080 product:hikvision',
    zoomeye: 'app:"hikvision cameras" country:jp',
    censys: 'services.port=554 and services.service_name="rtsp" country=CA'
  };

  const getPresetOptions = () => {
    if (!selectedCountry || (selectedCountry === 'all')) return null;
    
    if (scanType === 'range' && COUNTRY_IP_RANGES[selectedCountry as keyof typeof COUNTRY_IP_RANGES]) {
      return (
        <div className="mt-2">
          <Label className="text-gray-300 mb-1 block">Predefined IP Ranges</Label>
          <Select onValueChange={handlePresetSelection}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select IP Range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {COUNTRY_IP_RANGES[selectedCountry as keyof typeof COUNTRY_IP_RANGES].map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    if (scanType === 'shodan' && COUNTRY_SHODAN_QUERIES[selectedCountry as keyof typeof COUNTRY_SHODAN_QUERIES]) {
      return (
        <div className="mt-2">
          <Label className="text-gray-300 mb-1 block">Predefined Shodan Queries</Label>
          <Select onValueChange={handlePresetSelection}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select Shodan Query" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {COUNTRY_SHODAN_QUERIES[selectedCountry as keyof typeof COUNTRY_SHODAN_QUERIES].map((query) => (
                <SelectItem key={query.value} value={query.value}>
                  {query.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    if (scanType === 'zoomeye' && COUNTRY_ZOOMEYE_QUERIES[selectedCountry as keyof typeof COUNTRY_ZOOMEYE_QUERIES]) {
      return (
        <div className="mt-2">
          <Label className="text-gray-300 mb-1 block">Predefined ZoomEye Queries</Label>
          <Select onValueChange={handlePresetSelection}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select ZoomEye Query" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {COUNTRY_ZOOMEYE_QUERIES[selectedCountry as keyof typeof COUNTRY_ZOOMEYE_QUERIES].map((query) => (
                <SelectItem key={query.value} value={query.value}>
                  {query.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    if (scanType === 'censys' && COUNTRY_CENSYS_QUERIES[selectedCountry as keyof typeof COUNTRY_CENSYS_QUERIES]) {
      return (
        <div className="mt-2">
          <Label className="text-gray-300 mb-1 block">Predefined Censys Queries</Label>
          <Select onValueChange={handlePresetSelection}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select Censys Query" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {COUNTRY_CENSYS_QUERIES[selectedCountry as keyof typeof COUNTRY_CENSYS_QUERIES].map((query) => (
                <SelectItem key={query.value} value={query.value}>
                  {query.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Search className="w-5 h-5 text-scanner-primary" />
          <span>Scanner Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-800">
            <TabsTrigger value="basic">Basic Scan</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Scan Target Type</Label>
                <RadioGroup 
                  defaultValue="ip" 
                  className="flex flex-wrap gap-4"
                  onValueChange={(value) => {
                    setScanType(value as any);
                    setScanValue('');
                    setInputError('');
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ip" id="option-ip" />
                    <Label htmlFor="option-ip" className="flex items-center space-x-1 cursor-pointer">
                      <Globe className="h-4 w-4" />
                      <span>Single IP</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="range" id="option-range" />
                    <Label htmlFor="option-range" className="flex items-center space-x-1 cursor-pointer">
                      <ChevronDown className="h-4 w-4" />
                      <ChevronUp className="h-4 w-4 -ml-3" />
                      <span>IP Range (CIDR)</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="option-file" />
                    <Label htmlFor="option-file" className="flex items-center space-x-1 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      <span>From File</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shodan" id="option-shodan" />
                    <Label htmlFor="option-shodan" className="flex items-center space-x-1 cursor-pointer">
                      <Search className="h-4 w-4" />
                      <span>Shodan Query</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zoomeye" id="option-zoomeye" />
                    <Label htmlFor="option-zoomeye" className="flex items-center space-x-1 cursor-pointer">
                      <Database className="h-4 w-4" />
                      <span>ZoomEye Query</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="censys" id="option-censys" />
                    <Label htmlFor="option-censys" className="flex items-center space-x-1 cursor-pointer">
                      <Globe className="h-4 w-4" />
                      <span>Censys Query</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {scanType === 'ip' ? 'IP Address' : 
                   scanType === 'range' ? 'CIDR Range' : 
                   scanType === 'file' ? 'IP List File' : 
                   `${scanType.charAt(0).toUpperCase() + scanType.slice(1)} Query`}
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={scanPlaceholder[scanType]}
                    value={scanValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`bg-gray-800 border-gray-700 ${inputError ? 'border-red-400' : ''}`}
                  />
                  {scanType === 'file' && (
                    <Button variant="outline" className="shrink-0">
                      Browse
                    </Button>
                  )}
                </div>
                {inputError && <p className="text-red-400 text-sm">{inputError}</p>}
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Region Filter</Label>
                <Select onValueChange={handleRegionFilterChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Regions</SelectItem>
                    {REGIONS.map(region => (
                      <SelectItem key={region.code} value={region.code}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {showPresets && getPresetOptions()}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="aggressive" 
                    checked={settings.aggressive}
                    onCheckedChange={value => updateSettings('aggressive', value)}
                  />
                  <Label htmlFor="aggressive" className="flex items-center space-x-1 cursor-pointer">
                    <Zap className="h-4 w-4 text-scanner-warning" />
                    <span>Aggressive Scan</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="vulnerabilities" 
                    checked={settings.checkVulnerabilities}
                    onCheckedChange={value => updateSettings('checkVulnerabilities', value)}
                  />
                  <Label htmlFor="vulnerabilities" className="flex items-center space-x-1 cursor-pointer">
                    <AlertTriangle className="h-4 w-4 text-scanner-danger" />
                    <span>Check Vulnerabilities</span>
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Threads</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      defaultValue={[10]} 
                      max={50} 
                      step={1}
                      value={[settings.threadsCount]}
                      onValueChange={value => updateSettings('threadsCount', value[0])}
                    />
                    <span className="w-10 text-center text-gray-300">{settings.threadsCount}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Timeout (ms)</Label>
                  <div className="flex items-center gap-2">
                    <Slider 
                      defaultValue={[3000]} 
                      min={500}
                      max={10000} 
                      step={500}
                      value={[settings.timeout]}
                      onValueChange={value => updateSettings('timeout', value[0])}
                    />
                    <span className="w-16 text-center text-gray-300">{settings.timeout}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">Additional Settings</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="test-credentials" 
                      checked={settings.testCredentials}
                      onCheckedChange={value => updateSettings('testCredentials', value)}
                    />
                    <Label htmlFor="test-credentials">Test Default Credentials</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="save-snapshots" 
                      checked={settings.saveSnapshots}
                      onCheckedChange={value => updateSettings('saveSnapshots', value)}
                    />
                    <Label htmlFor="save-snapshots">Save Camera Snapshots</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="realtime-monitoring" 
                      checked={settings.enableRealTimeMonitoring || false}
                      onCheckedChange={value => updateSettings('enableRealTimeMonitoring', value)}
                    />
                    <Label htmlFor="realtime-monitoring" className="flex items-center gap-1">
                      <Bell className="h-4 w-4 text-scanner-info" />
                      <span>Enable Real-Time Monitoring</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="map-visualization" 
                      checked={true}
                      disabled
                    />
                    <Label htmlFor="map-visualization" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-scanner-primary" />
                      <span>Map Visualization</span>
                    </Label>
                  </div>
                </div>
              </div>
              
              {settings.enableRealTimeMonitoring && (
                <div className="space-y-2 p-3 border border-gray-800 rounded-md">
                  <Label className="text-gray-300">Alert Threshold</Label>
                  <Select 
                    value={settings.alertThreshold || 'medium'}
                    onValueChange={(value) => updateSettings('alertThreshold', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select alert threshold" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="low">Low (All alerts)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400 mt-1">
                    Only alerts at or above this severity level will trigger notifications.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 pt-4">
        <Button 
          className="w-full bg-scanner-primary hover:bg-blue-600 text-white"
          onClick={handleStartScan}
          disabled={isScanning}
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScanForm;

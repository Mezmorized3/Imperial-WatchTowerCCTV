
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

// Mock data for country information
const REGIONS = [
  { code: 'all', name: 'All Regions' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'ru', name: 'Russia' },
  { code: 'ge', name: 'Georgia' },
  { code: 'ro', name: 'Romania' },
  { code: 'us', name: 'United States' },
  { code: 'jp', name: 'Japan' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'cn', name: 'China' }
];

// Mock data for country IP ranges
const COUNTRY_IP_RANGES: Record<string, string[]> = {
  ua: ['176.36.0.0/16', '194.44.0.0/16', '77.47.128.0/17'],
  ru: ['5.61.0.0/16', '95.24.0.0/13', '176.226.0.0/16'],
  ge: ['46.49.0.0/17', '77.92.224.0/19', '5.152.0.0/17'],
  ro: ['37.120.0.0/17', '79.112.0.0/13', '213.163.64.0/18'],
  us: ['3.0.0.0/8', '4.0.0.0/8', '8.0.0.0/8'],
  jp: ['27.80.0.0/12', '61.115.0.0/16', '133.0.0.0/8'],
  de: ['77.0.0.0/9', '78.0.0.0/10', '134.0.0.0/10'],
  fr: ['5.48.0.0/15', '5.135.0.0/16', '80.8.0.0/13'],
  uk: ['2.16.0.0/13', '2.24.0.0/13', '2.32.0.0/13'],
  cn: ['14.204.0.0/16', '27.0.0.0/8', '36.0.0.0/8']
};

// Mock data for Shodan queries
const COUNTRY_SHODAN_QUERIES: Record<string, string[]> = {
  ua: ['country:ua port:80,8080 product:hikvision', 'country:ua product:"ip camera"', 'country:ua port:554 has_screenshot:true'],
  ru: ['country:ru port:80,8080 product:hikvision', 'country:ru product:"ip camera"', 'country:ru port:554 has_screenshot:true'],
  ge: ['country:ge port:80,8080 product:hikvision', 'country:ge product:"ip camera"', 'country:ge port:554 has_screenshot:true'],
  ro: ['country:ro port:80,8080 product:hikvision', 'country:ro product:"ip camera"', 'country:ro port:554 has_screenshot:true'],
  us: ['country:us port:80,8080 product:hikvision', 'country:us product:"ip camera"', 'country:us port:554 has_screenshot:true'],
  jp: ['country:jp port:80,8080 product:hikvision', 'country:jp product:"ip camera"', 'country:jp port:554 has_screenshot:true'],
  de: ['country:de port:80,8080 product:hikvision', 'country:de product:"ip camera"', 'country:de port:554 has_screenshot:true'],
  fr: ['country:fr port:80,8080 product:hikvision', 'country:fr product:"ip camera"', 'country:fr port:554 has_screenshot:true'],
  uk: ['country:uk port:80,8080 product:hikvision', 'country:uk product:"ip camera"', 'country:uk port:554 has_screenshot:true'],
  cn: ['country:cn port:80,8080 product:hikvision', 'country:cn product:"ip camera"', 'country:cn port:554 has_screenshot:true']
};

// Mock data for ZoomEye queries
const COUNTRY_ZOOMEYE_QUERIES: Record<string, string[]> = {
  ua: ['app:"hikvision cameras" country:ua', 'app:"rtsp server" country:ua', 'app:"dahua dvr" country:ua'],
  ru: ['app:"hikvision cameras" country:ru', 'app:"rtsp server" country:ru', 'app:"dahua dvr" country:ru'],
  ge: ['app:"hikvision cameras" country:ge', 'app:"rtsp server" country:ge', 'app:"dahua dvr" country:ge'],
  ro: ['app:"hikvision cameras" country:ro', 'app:"rtsp server" country:ro', 'app:"dahua dvr" country:ro'],
  us: ['app:"hikvision cameras" country:us', 'app:"rtsp server" country:us', 'app:"dahua dvr" country:us'],
  jp: ['app:"hikvision cameras" country:jp', 'app:"rtsp server" country:jp', 'app:"dahua dvr" country:jp'],
  de: ['app:"hikvision cameras" country:de', 'app:"rtsp server" country:de', 'app:"dahua dvr" country:de'],
  fr: ['app:"hikvision cameras" country:fr', 'app:"rtsp server" country:fr', 'app:"dahua dvr" country:fr'],
  uk: ['app:"hikvision cameras" country:uk', 'app:"rtsp server" country:uk', 'app:"dahua dvr" country:uk'],
  cn: ['app:"hikvision cameras" country:cn', 'app:"rtsp server" country:cn', 'app:"dahua dvr" country:cn']
};

// Mock data for Censys queries
const COUNTRY_CENSYS_QUERIES: Record<string, string[]> = {
  ua: ['services.port=554 and services.service_name="rtsp" and location.country_code="UA"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="UA"'],
  ru: ['services.port=554 and services.service_name="rtsp" and location.country_code="RU"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="RU"'],
  ge: ['services.port=554 and services.service_name="rtsp" and location.country_code="GE"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="GE"'],
  ro: ['services.port=554 and services.service_name="rtsp" and location.country_code="RO"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="RO"'],
  us: ['services.port=554 and services.service_name="rtsp" and location.country_code="US"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="US"'],
  jp: ['services.port=554 and services.service_name="rtsp" and location.country_code="JP"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="JP"'],
  de: ['services.port=554 and services.service_name="rtsp" and location.country_code="DE"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="DE"'],
  fr: ['services.port=554 and services.service_name="rtsp" and location.country_code="FR"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="FR"'],
  uk: ['services.port=554 and services.service_name="rtsp" and location.country_code="GB"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="GB"'],
  cn: ['services.port=554 and services.service_name="rtsp" and location.country_code="CN"', 'services.port=80 or services.port=443 and services.http.response.html_title="Hikvision" and location.country_code="CN"']
};

interface ScanFormProps {
  onStartScan: (target: ScanTarget, settings: ScanSettings) => void;
  isScanning: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, isScanning }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scanType, setScanType] = useState<'ip' | 'range' | 'file' | 'shodan' | 'zoomeye' | 'censys'>('ip');
  const [scanValue, setScanValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>('all');
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
      setSelectedCountry('all');
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
    
    if (scanType === 'range' && COUNTRY_IP_RANGES[selectedCountry]) {
      return COUNTRY_IP_RANGES[selectedCountry];
    } else if (scanType === 'shodan' && COUNTRY_SHODAN_QUERIES[selectedCountry]) {
      return COUNTRY_SHODAN_QUERIES[selectedCountry];
    } else if (scanType === 'zoomeye' && COUNTRY_ZOOMEYE_QUERIES[selectedCountry]) {
      return COUNTRY_ZOOMEYE_QUERIES[selectedCountry];
    } else if (scanType === 'censys' && COUNTRY_CENSYS_QUERIES[selectedCountry]) {
      return COUNTRY_CENSYS_QUERIES[selectedCountry];
    }
    
    return null;
  };

  const presetOptions = getPresetOptions();

  return (
    <Card className="bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-scanner-primary">Scan Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="scan-type" className="text-gray-300">Scan Target Type</Label>
            <RadioGroup
              id="scan-type"
              value={scanType}
              onValueChange={(value) => setScanType(value as any)}
              className="grid grid-cols-2 gap-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ip" id="ip" />
                <Label htmlFor="ip" className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  IP Address
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range" className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  CIDR Range
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  From File
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shodan" id="shodan" />
                <Label htmlFor="shodan" className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Shodan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zoomeye" id="zoomeye" />
                <Label htmlFor="zoomeye" className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  ZoomEye
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="censys" id="censys" />
                <Label htmlFor="censys" className="flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Censys
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="region-filter" className="text-gray-300">Region Filter</Label>
            <Select value={selectedCountry || 'all'} onValueChange={handleRegionFilterChange}>
              <SelectTrigger id="region-filter" className="bg-scanner-dark-alt mt-2">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark-alt">
                {REGIONS.map((region) => (
                  <SelectItem key={region.code} value={region.code}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="scan-target" className="text-gray-300">
                {scanType === 'ip' ? 'IP Address' : 
                 scanType === 'range' ? 'CIDR Range' : 
                 scanType === 'file' ? 'File Path' : 
                 `${scanType.charAt(0).toUpperCase() + scanType.slice(1)} Query`}
              </Label>
              {showPresets && presetOptions && (
                <Button 
                  variant="link" 
                  className="text-xs text-scanner-primary p-0 h-auto"
                  onClick={() => setShowPresets(!showPresets)}
                >
                  {showPresets ? 'Hide Presets' : 'Show Presets'} 
                  {showPresets ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>
              )}
            </div>
            <Input
              id="scan-target"
              placeholder={scanPlaceholder[scanType]}
              value={scanValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="bg-scanner-dark-alt mt-2"
            />
            {inputError && (
              <p className="text-red-500 text-xs mt-1">{inputError}</p>
            )}
          </div>
          
          {showPresets && presetOptions && presetOptions.length > 0 && (
            <div className="p-3 border border-gray-700 rounded-md bg-scanner-dark-alt/50">
              <p className="text-xs text-gray-400 mb-2">Presets for {REGIONS.find(r => r.code === selectedCountry)?.name}</p>
              <div className="flex flex-wrap gap-2">
                {presetOptions.map((preset, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="bg-scanner-dark text-xs"
                    onClick={() => handlePresetSelection(preset)}
                  >
                    {preset.length > 30 ? `${preset.substring(0, 30)}...` : preset}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="aggressive-scan"
                checked={settings.aggressive}
                onCheckedChange={(checked) => updateSettings('aggressive', checked)}
              />
              <Label htmlFor="aggressive-scan" className="text-sm text-gray-300 cursor-pointer">
                <Zap className="w-4 h-4 inline-block mr-1 text-scanner-warning" />
                Aggressive Scan
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="check-vulnerabilities"
                checked={settings.checkVulnerabilities}
                onCheckedChange={(checked) => updateSettings('checkVulnerabilities', checked)}
              />
              <Label htmlFor="check-vulnerabilities" className="text-sm text-gray-300 cursor-pointer">
                <AlertTriangle className="w-4 h-4 inline-block mr-1 text-scanner-warning" />
                Check Vulnerabilities
              </Label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="px-0 text-gray-400 text-sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
              {showAdvanced ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
            </Button>
          </div>
          
          {showAdvanced && (
            <div className="p-3 border border-gray-700 rounded-md space-y-4 bg-scanner-dark-alt/50">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="threads-count" className="text-gray-300 text-sm">Threads</Label>
                  <span className="text-xs text-gray-400">{settings.threadsCount}</span>
                </div>
                <Slider
                  id="threads-count"
                  min={1}
                  max={50}
                  step={1}
                  value={[settings.threadsCount]}
                  onValueChange={(values) => updateSettings('threadsCount', values[0])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="timeout" className="text-gray-300 text-sm">Timeout (ms)</Label>
                  <span className="text-xs text-gray-400">{settings.timeout}</span>
                </div>
                <Slider
                  id="timeout"
                  min={500}
                  max={10000}
                  step={100}
                  value={[settings.timeout]}
                  onValueChange={(values) => updateSettings('timeout', values[0])}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="test-credentials"
                    checked={settings.testCredentials}
                    onCheckedChange={(checked) => updateSettings('testCredentials', checked)}
                  />
                  <Label htmlFor="test-credentials" className="text-sm text-gray-300">Test Credentials</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="save-snapshots"
                    checked={settings.saveSnapshots}
                    onCheckedChange={(checked) => updateSettings('saveSnapshots', checked)}
                  />
                  <Label htmlFor="save-snapshots" className="text-sm text-gray-300">Save Snapshots</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-monitoring"
                    checked={settings.enableRealTimeMonitoring}
                    onCheckedChange={(checked) => updateSettings('enableRealTimeMonitoring', checked)}
                  />
                  <Label htmlFor="enable-monitoring" className="text-sm text-gray-300">
                    <Bell className="w-4 h-4 inline-block mr-1" />
                    Real-time Monitoring
                  </Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="alert-threshold" className="text-gray-300 text-sm">Alert Threshold</Label>
                <Select 
                  id="alert-threshold"
                  value={settings.alertThreshold} 
                  onValueChange={(value) => updateSettings('alertThreshold', value)}
                  disabled={!settings.enableRealTimeMonitoring}
                >
                  <SelectTrigger className="bg-scanner-dark-alt mt-2">
                    <SelectValue placeholder="Select alert threshold" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark-alt">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStartScan}
          disabled={isScanning || scanValue.trim() === '' || !!inputError}
          className="w-full bg-scanner-primary"
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
          {!isScanning && <Search className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScanForm;

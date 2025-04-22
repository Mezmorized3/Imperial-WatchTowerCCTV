
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe, FileText, Database, Zap, AlertTriangle } from 'lucide-react';
import { ScanTarget, ScanSettings } from '@/types/scanner';

interface ScannerConfigurationProps {
  onStartScan: (target: ScanTarget, settings: ScanSettings) => void;
  isScanning: boolean;
}

export const ScannerConfiguration: React.FC<ScannerConfigurationProps> = ({ onStartScan, isScanning }) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [scanType, setScanType] = useState<'ip' | 'range' | 'file' | 'shodan' | 'zoomeye' | 'censys'>('range');
  const [targetValue, setTargetValue] = useState<string>('192.168.1.0/24');
  const [regionFilter, setRegionFilter] = useState<string>('all_regions');
  const [aggressiveScan, setAggressiveScan] = useState<boolean>(false);
  const [checkVulnerabilities, setCheckVulnerabilities] = useState<boolean>(true);
  
  // Advanced settings
  const [testCredentials, setTestCredentials] = useState<boolean>(true);
  const [saveSnapshots, setSaveSnapshots] = useState<boolean>(false);
  const [threadsCount, setThreadsCount] = useState<number>(10);
  const [timeout, setTimeout] = useState<number>(3000);
  const [enableMonitoring, setEnableMonitoring] = useState<boolean>(false);
  const [alertThreshold, setAlertThreshold] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [checkThreatIntel, setCheckThreatIntel] = useState<boolean>(true);

  const handleStartScan = () => {
    if (!targetValue.trim()) {
      return;
    }

    const target: ScanTarget = {
      type: scanType,
      value: targetValue
    };

    const settings: ScanSettings = {
      aggressive: aggressiveScan,
      testCredentials,
      checkVulnerabilities,
      saveSnapshots,
      regionFilter: regionFilter && regionFilter !== 'all_regions' ? [regionFilter] : [],
      threadsCount,
      timeout,
      enableRealTimeMonitoring: enableMonitoring,
      alertThreshold,
      checkThreatIntel
    };

    onStartScan(target, settings);
  };

  return (
    <Card className="bg-scanner-dark shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-scanner-primary" />
          <h2 className="text-xl font-bold text-white">Scanner Configuration</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="bg-scanner-dark-alt mb-4">
            <TabsTrigger value="basic" className="data-[state=active]:bg-scanner-primary/20">
              Basic Scan
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-scanner-primary/20">
              Advanced Options
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-300">Scan Target Type</h3>
            <RadioGroup
              value={scanType}
              onValueChange={(value) => setScanType(value as any)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ip" id="single-ip" />
                <Label htmlFor="single-ip" className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Single IP
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="ip-range" />
                <Label htmlFor="ip-range" className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  IP Range (CIDR)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file" className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  From File
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shodan" id="shodan" />
                <Label htmlFor="shodan" className="flex items-center">
                  <Search className="w-4 h-4 mr-1" />
                  Shodan Query
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zoomeye" id="zoomeye" />
                <Label htmlFor="zoomeye" className="flex items-center">
                  <Search className="w-4 h-4 mr-1" />
                  ZoomEye Query
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="censys" id="censys" />
                <Label htmlFor="censys" className="flex items-center">
                  <Database className="w-4 h-4 mr-1" />
                  Censys Query
                </Label>
              </div>
            </RadioGroup>
          </div>

          {scanType === 'range' && (
            <div>
              <Label htmlFor="cidr-range" className="text-sm font-medium text-gray-300">CIDR Range</Label>
              <Input
                id="cidr-range"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="192.168.1.0/24"
                className="bg-scanner-dark-alt border-gray-700 mt-1"
              />
            </div>
          )}

          {scanType !== 'range' && (
            <div>
              <Label htmlFor="scan-target" className="text-sm font-medium text-gray-300">
                {scanType === 'ip' ? 'IP Address' : 
                 scanType === 'file' ? 'File Path' : 
                 `${scanType.charAt(0).toUpperCase() + scanType.slice(1)} Query`}
              </Label>
              <Input
                id="scan-target"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={
                  scanType === 'ip' ? '192.168.1.100' : 
                  scanType === 'file' ? 'Path to IP list file' : 
                  scanType === 'shodan' ? 'country:ua port:80,8080 product:hikvision' :
                  scanType === 'zoomeye' ? 'app:"hikvision cameras" country:jp' :
                  'services.port=554 and services.service_name="rtsp" country=CA'
                }
                className="bg-scanner-dark-alt border-gray-700 mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="region-filter" className="text-sm font-medium text-gray-300">Region Filter</Label>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger id="region-filter" className="bg-scanner-dark-alt border-gray-700 mt-1">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark-alt border-gray-700">
                <SelectItem value="all_regions">All Regions</SelectItem>
                <SelectItem value="ua">Ukraine</SelectItem>
                <SelectItem value="ru">Russia</SelectItem>
                <SelectItem value="ge">Georgia</SelectItem>
                <SelectItem value="ro">Romania</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="cn">China</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="aggressive-scan"
                checked={aggressiveScan}
                onCheckedChange={setAggressiveScan}
              />
              <Label htmlFor="aggressive-scan" className="flex items-center cursor-pointer">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="text-sm">Aggressive Scan</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="check-vulnerabilities"
                checked={checkVulnerabilities}
                onCheckedChange={setCheckVulnerabilities}
              />
              <Label htmlFor="check-vulnerabilities" className="flex items-center cursor-pointer">
                <AlertTriangle className="w-4 h-4 mr-1 text-scanner-warning" />
                <span className="text-sm">Check Vulnerabilities</span>
              </Label>
            </div>
          </div>

          <Button
            onClick={handleStartScan}
            disabled={isScanning || !targetValue.trim()}
            className="w-full bg-scanner-primary hover:bg-scanner-primary/80 text-white font-bold py-2 rounded-md"
          >
            {isScanning ? "Scan In Progress..." : "Start Scan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannerConfiguration;

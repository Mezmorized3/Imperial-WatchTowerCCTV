
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Radio, Scan, Terminal, Wifi } from 'lucide-react';
import { executeScapy, executeZMap } from '@/utils/osintUtilsConnector';

interface AdvancedNetworkToolsProps {
  onScanComplete?: (results: any) => void;
}

const AdvancedNetworkTools: React.FC<AdvancedNetworkToolsProps> = ({ 
  onScanComplete 
}) => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('80');
  const [scanType, setScanType] = useState('tcp');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleScan = async () => {
    if (!target) {
      setError('Please enter a target');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    setError(null);
    
    try {
      const result = await executeZMap({
        target,
        port: parseInt(port),
        scanType
      });
      
      if (result.success) {
        setScanResults(result);
        if (onScanComplete) {
          onScanComplete(result);
        }
      } else {
        setError(result.error || 'Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsScanning(false);
    }
  };
  
  const handlePacketCapture = async () => {
    if (!target) {
      setError('Please enter a target');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    setError(null);
    
    try {
      const result = await executeScapy({
        target,
        filter: `port ${port}`,
        count: 10
      });
      
      if (result.success) {
        setScanResults(result);
        if (onScanComplete) {
          onScanComplete(result);
        }
      } else {
        setError(result.error || 'Packet capture failed');
      }
    } catch (error) {
      console.error('Capture error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Network className="h-5 w-5 text-scanner-success mr-2" />
          Advanced Network Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-scanner-dark-alt">
            <TabsTrigger value="scanner">
              <Scan className="h-4 w-4 mr-2" />
              Port Scanner
            </TabsTrigger>
            <TabsTrigger value="packet">
              <Terminal className="h-4 w-4 mr-2" />
              Packet Capture
            </TabsTrigger>
            <TabsTrigger value="wifi">
              <Wifi className="h-4 w-4 mr-2" />
              Wifi Analysis
            </TabsTrigger>
            <TabsTrigger value="radio">
              <Radio className="h-4 w-4 mr-2" />
              RF Scanner
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  placeholder="IP address, hostname, or network range"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                  disabled={isScanning}
                />
              </div>
              
              {(activeTab === 'scanner' || activeTab === 'packet') && (
                <div>
                  <Label htmlFor="port">Port(s)</Label>
                  <Input
                    id="port"
                    placeholder="80,443,8080 or range 1-1024"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="bg-scanner-dark-alt border-gray-700"
                    disabled={isScanning}
                  />
                </div>
              )}
              
              {activeTab === 'scanner' && (
                <div>
                  <Label htmlFor="scan-type">Scan Type</Label>
                  <Select
                    value={scanType}
                    onValueChange={setScanType}
                    disabled={isScanning}
                  >
                    <SelectTrigger id="scan-type" className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent className="bg-scanner-dark border-gray-700">
                      <SelectItem value="tcp">TCP Connect</SelectItem>
                      <SelectItem value="syn">SYN Scan</SelectItem>
                      <SelectItem value="fin">FIN Scan</SelectItem>
                      <SelectItem value="udp">UDP Scan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button
                onClick={activeTab === 'packet' ? handlePacketCapture : handleScan}
                disabled={isScanning}
                className="w-full"
              >
                {isScanning ? (
                  "Scanning..."
                ) : activeTab === 'packet' ? (
                  "Start Packet Capture"
                ) : activeTab === 'wifi' ? (
                  "Scan Wifi Networks"
                ) : activeTab === 'radio' ? (
                  "Scan RF Spectrum"
                ) : (
                  "Start Port Scan"
                )}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-300">
                {error}
              </div>
            )}
            
            {scanResults && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Scan Results:</h3>
                
                {scanResults.data && (
                  <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md overflow-auto max-h-60">
                    <p>Status: {scanResults.data.status}</p>
                    <p>Found: {scanResults.data.found}</p>
                    
                    {scanResults.data.details && (
                      <pre className="text-xs mt-2 whitespace-pre-wrap">
                        {JSON.stringify(scanResults.data.details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedNetworkTools;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Network, Search, Server, Radio, Code, Globe, Shield } from 'lucide-react';
import { 
  executeZMap, 
  executeMetasploit, 
  executeOrebroONVIFScanner, 
  executeNodeONVIF,
  executePyONVIF,
  executePythonWSDiscovery,
  executeScapy,
  executeMitmProxy
} from '@/utils/osintImplementations';

const AdvancedNetworkTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('zmap');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // ZMap state
  const [zmapTarget, setZmapTarget] = useState('192.168.1.0/24');
  const [zmapPort, setZmapPort] = useState('80,443,554,8000,8080');

  // Metasploit state
  const [metasploitTarget, setMetasploitTarget] = useState('192.168.1.100');
  const [metasploitModule, setMetasploitModule] = useState('auxiliary/scanner/onvif/onvif_login');

  // ONVIF Scanner state
  const [onvifSubnet, setOnvifSubnet] = useState('192.168.1.0/24');
  const [onvifDeepScan, setOnvifDeepScan] = useState(false);
  const [onvifUsername, setOnvifUsername] = useState('admin');
  const [onvifPassword, setOnvifPassword] = useState('admin');

  // Scapy state
  const [scapyTarget, setScapyTarget] = useState('192.168.1.1');
  const [scapyPacketType, setScapyPacketType] = useState('tcp');
  const [scapyCount, setScapyCount] = useState('5');
  
  // mitmproxy state
  const [mitmPort, setMitmPort] = useState('8080');
  const [mitmTargetHost, setMitmTargetHost] = useState('');
  const [mitmDumpTraffic, setMitmDumpTraffic] = useState(true);

  const handleExecute = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch (activeTab) {
        case 'zmap':
          // Parse ports as array of numbers
          const ports = zmapPort.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
          result = await executeZMap({
            target: zmapTarget,
            port: ports,
            saveResults: true
          });
          break;
          
        case 'metasploit':
          result = await executeMetasploit({
            target: metasploitTarget,
            module: metasploitModule
          });
          break;
          
        case 'onvifscanner':
          result = await executeOrebroONVIFScanner({
            subnet: onvifSubnet,
            deepScan: onvifDeepScan,
            username: onvifUsername,
            password: onvifPassword,
            scanMode: 'deep'
          });
          break;
          
        case 'wsdiscovery':
          result = await executePythonWSDiscovery({
            timeout: 5,
            saveResults: true,
            types: ['NetworkVideoTransmitter']
          });
          break;
          
        case 'nodeonvif':
          result = await executeNodeONVIF({
            target: scapyTarget, // Reuse the target from scapy
            operation: 'getDeviceInformation',
            username: onvifUsername,
            password: onvifPassword
          });
          break;
          
        case 'pyonvif':
          result = await executePyONVIF({
            target: scapyTarget, // Reuse the target from scapy
            operation: 'getStreamUri',
            username: onvifUsername,
            password: onvifPassword
          });
          break;
          
        case 'scapy':
          result = await executeScapy({
            target: scapyTarget,
            packetType: scapyPacketType as any,
            count: parseInt(scapyCount),
            saveResults: true
          });
          break;
          
        case 'mitmproxy':
          result = await executeMitmProxy({
            listenPort: parseInt(mitmPort),
            targetHost: mitmTargetHost || undefined,
            dumpTraffic: mitmDumpTraffic,
            mode: 'regular'
          });
          break;
      }
      
      if (result && result.success) {
        setResults(result.data);
        toast.success('Tool executed successfully');
      } else {
        toast.error('Error executing tool');
      }
    } catch (error) {
      console.error('Error executing tool:', error);
      toast.error('Error executing tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Advanced Network Tools</CardTitle>
        <CardDescription>
          Comprehensive toolkit for network scanning, ONVIF discovery and protocol analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
            <TabsTrigger value="zmap">
              <Network className="h-4 w-4 mr-2" />
              ZMap
            </TabsTrigger>
            <TabsTrigger value="metasploit">
              <Shield className="h-4 w-4 mr-2" />
              Metasploit
            </TabsTrigger>
            <TabsTrigger value="onvifscanner">
              <Search className="h-4 w-4 mr-2" />
              ONVIF Scanner
            </TabsTrigger>
            <TabsTrigger value="wsdiscovery">
              <Globe className="h-4 w-4 mr-2" />
              WS-Discovery
            </TabsTrigger>
            <TabsTrigger value="nodeonvif">
              <Server className="h-4 w-4 mr-2" />
              Node ONVIF
            </TabsTrigger>
            <TabsTrigger value="pyonvif">
              <Code className="h-4 w-4 mr-2" />
              PyONVIF
            </TabsTrigger>
            <TabsTrigger value="scapy">
              <Radio className="h-4 w-4 mr-2" />
              Scapy
            </TabsTrigger>
            <TabsTrigger value="mitmproxy">
              <Server className="h-4 w-4 mr-2" />
              mitmproxy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="zmap">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zmapTarget">Target Network (CIDR)</Label>
                  <Input
                    id="zmapTarget"
                    placeholder="192.168.1.0/24"
                    value={zmapTarget}
                    onChange={(e) => setZmapTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zmapPort">Ports (comma separated)</Label>
                  <Input
                    id="zmapPort"
                    placeholder="80,443,554,8000,8080"
                    value={zmapPort}
                    onChange={(e) => setZmapPort(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Scanning...' : 'Start ZMap Scan'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="metasploit">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metasploitTarget">Target IP</Label>
                  <Input
                    id="metasploitTarget"
                    placeholder="192.168.1.100"
                    value={metasploitTarget}
                    onChange={(e) => setMetasploitTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metasploitModule">Metasploit Module</Label>
                  <Select value={metasploitModule} onValueChange={setMetasploitModule}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auxiliary/scanner/onvif/onvif_login">ONVIF Login Scanner</SelectItem>
                      <SelectItem value="auxiliary/scanner/onvif/device_info">ONVIF Device Info</SelectItem>
                      <SelectItem value="exploit/linux/misc/hikvision_onvif_rce">Hikvision ONVIF RCE</SelectItem>
                      <SelectItem value="exploit/linux/misc/dahua_dvr_auth_bypass">Dahua DVR Auth Bypass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} variant="destructive" className="w-full">
                {loading ? 'Executing...' : 'Execute Metasploit'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="onvifscanner">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="onvifSubnet">Target Subnet (CIDR)</Label>
                  <Input
                    id="onvifSubnet"
                    placeholder="192.168.1.0/24"
                    value={onvifSubnet}
                    onChange={(e) => setOnvifSubnet(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="onvifDeepScan">Deep Scan</Label>
                    <Switch
                      id="onvifDeepScan"
                      checked={onvifDeepScan}
                      onCheckedChange={setOnvifDeepScan}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="onvifUsername">Username</Label>
                  <Input
                    id="onvifUsername"
                    placeholder="admin"
                    value={onvifUsername}
                    onChange={(e) => setOnvifUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onvifPassword">Password</Label>
                  <Input
                    id="onvifPassword"
                    type="password"
                    placeholder="admin"
                    value={onvifPassword}
                    onChange={(e) => setOnvifPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Scanning...' : 'Start ONVIF Scan'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="wsdiscovery">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Web Services Discovery (WS-Discovery) is a multicast discovery protocol used by ONVIF cameras and other network devices. 
                    This tool will scan your local network for any ONVIF-compatible devices.
                  </p>
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Discovering...' : 'Start WS-Discovery'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="nodeonvif">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nodeonvifTarget">Camera IP</Label>
                  <Input
                    id="nodeonvifTarget"
                    placeholder="192.168.1.100"
                    value={scapyTarget}
                    onChange={(e) => setScapyTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nodeonvifOperation">Operation</Label>
                  <Select defaultValue="getDeviceInformation">
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="getDeviceInformation">Get Device Info</SelectItem>
                      <SelectItem value="getProfiles">Get Media Profiles</SelectItem>
                      <SelectItem value="getStreamUri">Get Stream URI</SelectItem>
                      <SelectItem value="getCapabilities">Get Capabilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nodeonvifUsername">Username</Label>
                  <Input
                    id="nodeonvifUsername"
                    placeholder="admin"
                    value={onvifUsername}
                    onChange={(e) => setOnvifUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nodeonvifPassword">Password</Label>
                  <Input
                    id="nodeonvifPassword"
                    type="password"
                    placeholder="admin"
                    value={onvifPassword}
                    onChange={(e) => setOnvifPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Executing...' : 'Execute Node ONVIF Command'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="pyonvif">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pyonvifTarget">Camera IP</Label>
                  <Input
                    id="pyonvifTarget"
                    placeholder="192.168.1.100"
                    value={scapyTarget}
                    onChange={(e) => setScapyTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pyonvifOperation">Operation</Label>
                  <Select defaultValue="getStreamUri">
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="getDeviceInformation">Get Device Info</SelectItem>
                      <SelectItem value="getStreamUri">Get Stream URI</SelectItem>
                      <SelectItem value="getSnapshot">Get Snapshot</SelectItem>
                      <SelectItem value="getPtzPosition">Get PTZ Position</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pyonvifUsername">Username</Label>
                  <Input
                    id="pyonvifUsername"
                    placeholder="admin"
                    value={onvifUsername}
                    onChange={(e) => setOnvifUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pyonvifPassword">Password</Label>
                  <Input
                    id="pyonvifPassword"
                    type="password"
                    placeholder="admin"
                    value={onvifPassword}
                    onChange={(e) => setOnvifPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Executing...' : 'Execute PyONVIF Command'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="scapy">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scapyTarget">Target IP</Label>
                  <Input
                    id="scapyTarget"
                    placeholder="192.168.1.1"
                    value={scapyTarget}
                    onChange={(e) => setScapyTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scapyPacketType">Packet Type</Label>
                  <Select value={scapyPacketType} onValueChange={setScapyPacketType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select packet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="icmp">ICMP</SelectItem>
                      <SelectItem value="arp">ARP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scapyCount">Packet Count</Label>
                <Input
                  id="scapyCount"
                  placeholder="5"
                  value={scapyCount}
                  onChange={(e) => setScapyCount(e.target.value)}
                />
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Sending packets...' : 'Send Packets'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="mitmproxy">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mitmPort">Listen Port</Label>
                  <Input
                    id="mitmPort"
                    placeholder="8080"
                    value={mitmPort}
                    onChange={(e) => setMitmPort(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mitmTargetHost">Target Host (optional)</Label>
                  <Input
                    id="mitmTargetHost"
                    placeholder="192.168.1.100"
                    value={mitmTargetHost}
                    onChange={(e) => setMitmTargetHost(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="mitmDumpTraffic"
                  checked={mitmDumpTraffic}
                  onCheckedChange={setMitmDumpTraffic}
                />
                <Label htmlFor="mitmDumpTraffic">Dump Traffic</Label>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Starting proxy...' : 'Start MITM Proxy'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <pre className="text-xs overflow-auto max-h-96 p-2 bg-white dark:bg-gray-900 rounded">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedNetworkTools;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Database, FileSearch, Network, Router, Server, Terminal, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SurveillanceToolkit: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rtsp');
  const [targetInput, setTargetInput] = useState('');
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const toolCategories = [
    {
      id: 'rtsp',
      label: 'RTSP Tools',
      icon: <Wifi className="h-4 w-4 mr-2" />,
      tools: [
        { id: 'gsoap', name: 'gSOAP', description: 'C/C++ toolkit for SOAP/XML web services' },
        { id: 'gst-rtsp-server', name: 'gst-rtsp-server', description: 'RTSP server based on GStreamer' },
        { id: 'gortsplib', name: 'gortsplib', description: 'Go RTSP library for servers and clients' },
        { id: 'agent-dvr', name: 'Agent DVR (iSpy)', description: 'Open source security camera software' },
        { id: 'rtsp-simple-server', name: 'rtsp-simple-server', description: 'Simple and efficient RTSP server' },
        { id: 'sensecam-discovery', name: 'SenseCam-Discovery', description: 'Tool for discovering network cameras' }
      ]
    },
    {
      id: 'onvif',
      label: 'ONVIF Tools',
      icon: <Router className="h-4 w-4 mr-2" />,
      tools: [
        { id: 'orebro-scanner', name: 'Orebro ONVIF Scanner', description: 'Scanner for ONVIF devices' },
        { id: 'onvif-cli', name: 'onvif-cli', description: 'Command line interface for ONVIF devices' },
        { id: 'node-onvif', name: 'node-onvif', description: 'Node.js module for ONVIF devices' },
        { id: 'pyonvif', name: 'pyonvif', description: 'Python module for ONVIF devices' },
        { id: 'python-onvif-zeep', name: 'python-onvif-zeep', description: 'Python ONVIF client using Zeep' },
        { id: 'onvif-scout', name: 'ONVIF Scout', description: 'Tool for scanning and configuring ONVIF devices' },
        { id: 'python-ws-discovery', name: 'python-ws-discovery', description: 'Python implementation of WS-Discovery' },
        { id: 'valkka-onvif', name: 'Valkka-ONVIF', description: 'ONVIF package for the Valkka library' }
      ]
    },
    {
      id: 'network',
      label: 'Network Tools',
      icon: <Network className="h-4 w-4 mr-2" />,
      tools: [
        { id: 'zmap', name: 'ZMap', description: 'Fast network scanner' },
        { id: 'easysnmp', name: 'EasySNMP', description: 'Easy to use SNMP library for Python' },
        { id: 'scapy', name: 'Scapy', description: 'Packet manipulation program' },
        { id: 'mitmproxy', name: 'mitmproxy', description: 'Interactive HTTPS proxy' }
      ]
    },
    {
      id: 'security',
      label: 'Security Tools',
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
      tools: [
        { id: 'foscam-exploit', name: 'Foscam-Exploit-Toolkit', description: 'Toolkit for exploiting Foscam cameras' },
        { id: 'metasploit', name: 'Metasploit Framework', description: 'Penetration testing framework with ONVIF modules' }
      ]
    }
  ];

  const [selectedTool, setSelectedTool] = useState(toolCategories[0].tools[0].id);
  const [toolConfig, setToolConfig] = useState<Record<string, any>>({});

  // Get the current tool details
  const getCurrentTool = () => {
    for (const category of toolCategories) {
      const tool = category.tools.find(t => t.id === selectedTool);
      if (tool) return tool;
    }
    return null;
  };

  const handleRunTool = () => {
    if (!targetInput) {
      toast({
        title: "Error",
        description: "Please enter a target IP or subnet",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setResults(null);

    // Simulate tool execution
    setTimeout(() => {
      const tool = getCurrentTool();
      
      // Generate sample results based on the selected tool
      const sampleResults = {
        timestamp: new Date().toISOString(),
        tool: tool?.name,
        target: targetInput,
        configuration: toolConfig,
        status: "completed",
        findings: generateSampleFindings(selectedTool),
      };
      
      setResults(sampleResults);
      setIsRunning(false);
      
      toast({
        title: "Scan Complete",
        description: `${tool?.name} scan completed successfully.`,
      });
    }, 3000);
  };

  const generateSampleFindings = (toolId: string) => {
    // Return different sample findings based on the tool type
    switch (toolId) {
      case 'zmap':
        return {
          hosts_scanned: 254,
          hosts_up: Math.floor(Math.random() * 30) + 5,
          scan_time: `${(Math.random() * 10).toFixed(2)}s`,
          open_ports: [80, 443, 554, 8000, 8080].slice(0, Math.floor(Math.random() * 5) + 1)
        };
      case 'agent-dvr':
        return {
          cameras_found: Math.floor(Math.random() * 5) + 1,
          cameras: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
            id: `cam-${i+1}`,
            ip: `192.168.1.${100 + i}`,
            type: ['ONVIF', 'RTSP', 'HTTP'][Math.floor(Math.random() * 3)],
            status: ['online', 'offline', 'authorized', 'unauthorized'][Math.floor(Math.random() * 4)]
          }))
        };
      case 'onvif-scout':
      case 'node-onvif':
      case 'pyonvif':
        return {
          devices_found: Math.floor(Math.random() * 5) + 1,
          devices: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
            id: `device-${i+1}`,
            ip: `192.168.1.${100 + i}`,
            manufacturer: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Sony'][Math.floor(Math.random() * 5)],
            model: `Model-${Math.floor(Math.random() * 1000)}`,
            firmware: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
            services: ['device', 'media', 'ptz', 'analytics'].slice(0, Math.floor(Math.random() * 4) + 1)
          }))
        };
      case 'metasploit':
        return {
          vulnerabilities: Math.floor(Math.random() * 3),
          exploits: [`onvif_${Math.floor(Math.random() * 1000)}`, `rtsp_${Math.floor(Math.random() * 1000)}`],
          risk_level: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          details: "See console output for detailed information."
        };
      default:
        return {
          scan_complete: true,
          details: "Tool executed successfully. See logs for details."
        };
    }
  };

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    setToolConfig({});
    setResults(null);
  };

  const renderToolConfiguration = () => {
    const tool = getCurrentTool();
    if (!tool) return null;
    
    // Different configuration options based on tool type
    switch (selectedTool) {
      case 'zmap':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target">Target subnet (CIDR notation)</Label>
              <Input
                id="target"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="192.168.1.0/24"
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={toolConfig.port || ''}
                onChange={(e) => setToolConfig({ ...toolConfig, port: e.target.value })}
                placeholder="554"
              />
            </div>
            <div>
              <Label htmlFor="bandwidth">Bandwidth (Mbps)</Label>
              <Input
                id="bandwidth"
                value={toolConfig.bandwidth || ''}
                onChange={(e) => setToolConfig({ ...toolConfig, bandwidth: e.target.value })}
                placeholder="10"
              />
            </div>
          </div>
        );
      
      case 'agent-dvr':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action">Action</Label>
              <Select 
                value={toolConfig.action || 'discover'} 
                onValueChange={(value) => setToolConfig({ ...toolConfig, action: value })}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discover">Discover Cameras</SelectItem>
                  <SelectItem value="add">Add Camera</SelectItem>
                  <SelectItem value="remove">Remove Camera</SelectItem>
                  <SelectItem value="settings">Get Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {toolConfig.action === 'add' && (
              <>
                <div>
                  <Label htmlFor="camera-url">Camera URL</Label>
                  <Input
                    id="camera-url"
                    value={toolConfig.cameraUrl || ''}
                    onChange={(e) => setToolConfig({ ...toolConfig, cameraUrl: e.target.value })}
                    placeholder="rtsp://192.168.1.100:554/stream"
                  />
                </div>
                <div>
                  <Label htmlFor="camera-name">Camera Name</Label>
                  <Input
                    id="camera-name"
                    value={toolConfig.cameraName || ''}
                    onChange={(e) => setToolConfig({ ...toolConfig, cameraName: e.target.value })}
                    placeholder="Front Door Camera"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="motion-detection"
                    checked={toolConfig.motionDetection || false}
                    onCheckedChange={(checked) => setToolConfig({ ...toolConfig, motionDetection: checked })}
                  />
                  <Label htmlFor="motion-detection">Enable Motion Detection</Label>
                </div>
              </>
            )}
            {toolConfig.action === 'discover' && (
              <div>
                <Label htmlFor="target">IP Range</Label>
                <Input
                  id="target"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="192.168.1.0-192.168.1.255"
                />
              </div>
            )}
          </div>
        );
      
      case 'onvif-scout':
      case 'orebro-scanner':
      case 'node-onvif':
      case 'pyonvif':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target">Target IP or Subnet</Label>
              <Input
                id="target"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="192.168.1.0/24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={toolConfig.username || ''}
                  onChange={(e) => setToolConfig({ ...toolConfig, username: e.target.value })}
                  placeholder="admin"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={toolConfig.password || ''}
                  onChange={(e) => setToolConfig({ ...toolConfig, password: e.target.value })}
                  placeholder="password"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="deep-scan"
                checked={toolConfig.deepScan || false}
                onCheckedChange={(checked) => setToolConfig({ ...toolConfig, deepScan: checked })}
              />
              <Label htmlFor="deep-scan">Enable Deep Scan</Label>
            </div>
          </div>
        );
      
      case 'rtsp-simple-server':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="listen-ip">Listen IP</Label>
              <Input
                id="listen-ip"
                value={toolConfig.listenIp || ''}
                onChange={(e) => setToolConfig({ ...toolConfig, listenIp: e.target.value })}
                placeholder="0.0.0.0"
              />
            </div>
            <div>
              <Label htmlFor="listen-port">Listen Port</Label>
              <Input
                id="listen-port"
                value={toolConfig.listenPort || ''}
                onChange={(e) => setToolConfig({ ...toolConfig, listenPort: e.target.value })}
                placeholder="8554"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-tls"
                  checked={toolConfig.enableTls || false}
                  onCheckedChange={(checked) => setToolConfig({ ...toolConfig, enableTls: checked })}
                />
                <Label htmlFor="enable-tls">Enable TLS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-proxy"
                  checked={toolConfig.enableProxy || false}
                  onCheckedChange={(checked) => setToolConfig({ ...toolConfig, enableProxy: checked })}
                />
                <Label htmlFor="enable-proxy">Enable Proxy Mode</Label>
              </div>
            </div>
          </div>
        );
      
      case 'metasploit':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target">Target IP</Label>
              <Input
                id="target"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <Label htmlFor="module">Module</Label>
              <Select 
                value={toolConfig.module || 'auxiliary/scanner/onvif/onvif_auth'} 
                onValueChange={(value) => setToolConfig({ ...toolConfig, module: value })}
              >
                <SelectTrigger id="module">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auxiliary/scanner/onvif/onvif_auth">ONVIF Authentication Scanner</SelectItem>
                  <SelectItem value="auxiliary/scanner/onvif/onvif_device">ONVIF Device Scanner</SelectItem>
                  <SelectItem value="auxiliary/scanner/rtsp/rtsp_login">RTSP Login Scanner</SelectItem>
                  <SelectItem value="auxiliary/scanner/rtsp/rtsp_enumeration">RTSP Enumeration</SelectItem>
                  <SelectItem value="exploit/onvif/cve_2021_34258">ONVIF CVE-2021-34258</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="check-mode"
                checked={toolConfig.checkMode || false}
                onCheckedChange={(checked) => setToolConfig({ ...toolConfig, checkMode: checked })}
              />
              <Label htmlFor="check-mode">Check Mode (Don't Exploit)</Label>
            </div>
          </div>
        );
      
      // Default configuration for other tools
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target">Target IP/Hostname</Label>
              <Input
                id="target"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            {advancedOptions && (
              <div>
                <Label htmlFor="command-options">Advanced Options</Label>
                <Textarea
                  id="command-options"
                  value={toolConfig.options || ''}
                  onChange={(e) => setToolConfig({ ...toolConfig, options: e.target.value })}
                  placeholder="Enter additional command line options..."
                  rows={3}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-options"
                checked={advancedOptions}
                onCheckedChange={setAdvancedOptions}
              />
              <Label htmlFor="advanced-options">Show Advanced Options</Label>
            </div>
          </div>
        );
    }
  };

  const renderToolOutput = () => {
    if (!results) return null;
    
    return (
      <div className="mt-6 border rounded-md p-4 bg-black text-green-400 font-mono text-sm overflow-auto max-h-96">
        <div className="mb-4">
          <span className="text-white">Tool:</span> {results.tool} <br />
          <span className="text-white">Timestamp:</span> {results.timestamp} <br />
          <span className="text-white">Target:</span> {results.target} <br />
          <span className="text-white">Status:</span> {results.status} <br />
        </div>
        <div className="border-t border-gray-700 pt-4">
          <div className="text-white mb-2">Results:</div>
          <pre className="whitespace-pre-wrap">{JSON.stringify(results.findings, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Advanced Surveillance Toolkit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            {toolCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                {category.icon}
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {toolCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tool-select">Select Tool</Label>
                  <Select value={selectedTool} onValueChange={handleToolChange}>
                    <SelectTrigger id="tool-select">
                      <SelectValue placeholder="Select a tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {category.tools.map(tool => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getCurrentTool()?.description}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {renderToolConfiguration()}
                  </div>
                  
                  <Button 
                    onClick={handleRunTool} 
                    disabled={isRunning} 
                    className="mt-6 w-full"
                  >
                    {isRunning ? 'Running...' : `Run ${getCurrentTool()?.name}`}
                  </Button>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Terminal className="h-4 w-4" />
                    <span>Tool Output</span>
                  </div>
                  
                  {isRunning ? (
                    <div className="border rounded-md p-4 bg-black text-green-400 font-mono text-sm h-40 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-pulse">
                          Running {getCurrentTool()?.name}...
                        </div>
                        <div className="text-xs mt-2 text-gray-500">
                          Scanning target: {targetInput}
                        </div>
                      </div>
                    </div>
                  ) : results ? (
                    renderToolOutput()
                  ) : (
                    <div className="border rounded-md p-4 bg-black text-gray-400 font-mono text-sm h-40 flex items-center justify-center">
                      <div className="text-center">
                        <div>No data to display</div>
                        <div className="text-xs mt-2">
                          Run a tool to see results here
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SurveillanceToolkit;

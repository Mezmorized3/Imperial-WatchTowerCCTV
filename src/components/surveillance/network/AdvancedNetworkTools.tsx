
// @ts-nocheck // TODO: FIX TYPES
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Globe, Server, Code, Network, ScanLine, Wifi, Route, FileJson, Loader2, Settings, ChevronDown, ChevronUp, Briefcase, Users, Target, ShieldAlert, Eye, Trash2 } from 'lucide-react'; // Added missing icons
import { Switch } from '@/components/ui/switch'; // Added Switch import
import { executeHackingTool } from '@/utils/osintUtilsConnector';
import { HackingToolResult, HackingToolSuccessData, HackingToolErrorData } from '@/utils/types/osintToolTypes';
import {
  IpInfoParams, IpInfoData,
  DnsLookupParams, DnsLookupData,
  PortScanParams, PortScanData,
  TracerouteParams, TracerouteData,
  SubnetScanParams, SubnetScanData,
  // WhoisLookupParams, WhoisLookupData, // Example for future extension
  // HttpHeadersParams, HttpHeadersData, // Example for future extension
} from '@/utils/types/networkToolTypes';


type ToolName = 'ipInfo' | 'dnsLookup' | 'portScan' | 'traceroute' | 'subnetScan' | 'whois' | 'httpHeaders';

interface AdvancedNetworkToolsProps {
  // Props for the component, if any
}

const AdvancedNetworkTools: React.FC<AdvancedNetworkToolsProps> = () => {
  const [activeTool, setActiveTool] = useState<ToolName>('ipInfo');
  const [target, setTarget] = useState('');
  const [dnsRecordType, setDnsRecordType] = useState('A');
  const [ports, setPorts] = useState('80,443,22');
  const [scanType, setScanType] = useState<'TCP_CONNECT' | 'TCP_SYN' | 'UDP'>('TCP_CONNECT');
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [timeout, setTimeoutValue] = useState(5000); // milliseconds
  const [retries, setRetries] = useState(2);
  const [useRandomUserAgent, setUseRandomUserAgent] = useState(false);


  const toolConfig = {
    ipInfo: {
      icon: Globe,
      name: "IP Information",
      description: "Get detailed information about an IP address.",
      params: (): IpInfoParams => ({ ip_address: target }),
      handler: (data: IpInfoData) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
    dnsLookup: {
      icon: Server,
      name: "DNS Lookup",
      description: "Perform DNS lookups for various record types.",
      params: (): DnsLookupParams => ({ domain: target, record_type: dnsRecordType as any }),
      handler: (data: DnsLookupData) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
    portScan: {
      icon: ScanLine,
      name: "Port Scanner",
      description: "Scan for open ports on a target host.",
      params: (): PortScanParams => ({ 
        target_host: target, 
        ports_to_scan: ports.split(',').map(p => p.trim()).filter(p => p),
        scan_type: scanType,
        timeout: timeout / 1000, // Convert to seconds
        service_detection: true, // Example advanced option
      }),
      handler: (data: PortScanData) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
    traceroute: {
      icon: Route,
      name: "Traceroute",
      description: "Trace the network path to a target host.",
      params: (): TracerouteParams => ({ 
        target_host: target,
        max_hops: 30, // Example advanced option
        timeout_ms: timeout,
      }),
      handler: (data: TracerouteData) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
    subnetScan: {
      icon: Network,
      name: "Subnet Scanner",
      description: "Scan a subnet for active hosts and open ports.",
      params: (): SubnetScanParams => ({
        subnet_cidr: subnet,
        ports_to_scan: ports.split(',').map(p => p.trim()).filter(p => p).map(Number), // Ensure numbers
        scan_method: 'ping_and_tcp', // Example advanced option
        timeout_ms: timeout,
      }),
      handler: (data: SubnetScanData) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
    // Placeholder for future tools
    whois: {
      icon: Users,
      name: "WHOIS Lookup",
      description: "Retrieve WHOIS information for a domain or IP.",
      params: () => ({ query: target }),
      handler: (data: any) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
    httpHeaders: {
      icon: Code,
      name: "HTTP Headers",
      description: "Fetch HTTP headers from a URL.",
      params: () => ({ url: target, method: 'GET', user_agent: useRandomUserAgent ? 'random' : undefined }),
      handler: (data: any) => <pre>{JSON.stringify(data, null, 2)}</pre>
    },
  };


  const handleExecute = async () => {
    if (!target && !['subnetScan'].includes(activeTool)) { // Subnet scan uses its own input
      toast({ title: 'Error', description: 'Target is required.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResults(null);

    const currentTool = toolConfig[activeTool];
    const params = {
      tool: activeTool,
      ...(currentTool.params() as object), // Cast to object to satisfy executeHackingTool
      // Add advanced options universally if needed, or handle per tool
      timeout: timeout / 1000, // Assuming API expects seconds for relevant tools
      retries: retries,
    };
    
    try {
      const response = await executeHackingTool(params) as HackingToolResult<any>; // Use a more specific type if possible
      if (response && response.success) {
        const successData = response.data as HackingToolSuccessData<any>;
        setResults(successData.results || successData); // Adapt based on actual success data structure
        toast({
          title: `${currentTool.name} Complete`,
          description: successData.message || 'Operation successful.',
        });
      } else {
        const errorData = response?.data as HackingToolErrorData | undefined;
        const errorMessage = errorData?.message || response?.error || 'Unknown error occurred.';
        setResults({ error: errorMessage });
        toast({
          title: `${currentTool.name} Failed`,
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setResults({ error: errorMessage });
      toast({
        title: 'Execution Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderInputs = () => {
    switch (activeTool) {
      case 'ipInfo':
      case 'traceroute':
      case 'whois':
      case 'httpHeaders':
        return (
          <div>
            <Label htmlFor="target-input">Target (IP/Hostname/URL)</Label>
            <Input id="target-input" placeholder="e.g., 8.8.8.8 or example.com" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
          </div>
        );
      case 'dnsLookup':
        return (
          <>
            <div>
              <Label htmlFor="target-domain">Domain</Label>
              <Input id="target-domain" placeholder="e.g., example.com" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
            </div>
            <div>
              <Label htmlFor="dns-record-type">Record Type</Label>
              <Select value={dnsRecordType} onValueChange={setDnsRecordType}>
                <SelectTrigger id="dns-record-type" className="bg-scanner-dark-alt border-gray-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-600">
                  {['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'SRV', 'ANY'].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'portScan':
        return (
          <>
            <div>
              <Label htmlFor="target-host-portscan">Target Host</Label>
              <Input id="target-host-portscan" placeholder="e.g., example.com or 192.168.1.1" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
            </div>
            <div>
              <Label htmlFor="ports-to-scan">Ports (comma-separated)</Label>
              <Input id="ports-to-scan" placeholder="e.g., 80,443,21-25,8080" value={ports} onChange={(e) => setPorts(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
            </div>
            <div>
                <Label htmlFor="portscan-type">Scan Type</Label>
                <Select value={scanType} onValueChange={(value: 'TCP_CONNECT' | 'TCP_SYN' | 'UDP') => setScanType(value)}>
                    <SelectTrigger id="portscan-type" className="bg-scanner-dark-alt border-gray-600">
                    <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent className="bg-scanner-dark border-gray-600">
                    <SelectItem value="TCP_CONNECT">TCP Connect</SelectItem>
                    <SelectItem value="TCP_SYN">TCP SYN (Stealth)</SelectItem>
                    <SelectItem value="UDP">UDP Scan</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </>
        );
      case 'subnetScan':
        return (
          <>
            <div>
              <Label htmlFor="subnet-cidr">Subnet (CIDR)</Label>
              <Input id="subnet-cidr" placeholder="e.g., 192.168.1.0/24" value={subnet} onChange={(e) => setSubnet(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
            </div>
             <div>
              <Label htmlFor="ports-subnet-scan">Ports to Check (comma-separated)</Label>
              <Input id="ports-subnet-scan" placeholder="e.g., 80,443" value={ports} onChange={(e) => setPorts(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
            </div>
          </>
        );
      default:
        return <p>Tool not configured.</p>;
    }
  };

  const renderResults = () => {
    if (!results) return null;
    if (results.error) {
      return <pre className="text-red-400 whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>;
    }
    const currentTool = toolConfig[activeTool];
    return currentTool.handler(results);
  };
  
  const AdvancedOptions = () => (
    <div className="space-y-4 p-4 border-t border-gray-700 mt-4">
        <h4 className="text-md font-semibold text-gray-300">Advanced Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input 
                    id="timeout" 
                    type="number" 
                    value={timeout} 
                    onChange={(e) => setTimeoutValue(parseInt(e.target.value))} 
                    className="bg-scanner-dark-alt border-gray-600" 
                />
            </div>
            <div>
                <Label htmlFor="retries">Retries</Label>
                <Input 
                    id="retries" 
                    type="number" 
                    value={retries} 
                    onChange={(e) => setRetries(parseInt(e.target.value))} 
                    className="bg-scanner-dark-alt border-gray-600" 
                />
            </div>
        </div>
        {['httpHeaders'].includes(activeTool) && (
            <div className="flex items-center space-x-2 mt-2">
                <Switch 
                    id="random-user-agent" 
                    checked={useRandomUserAgent} 
                    onCheckedChange={setUseRandomUserAgent}
                />
                <Label htmlFor="random-user-agent">Use Random User-Agent</Label>
            </div>
        )}
        {/* Add more tool-specific advanced options here */}
    </div>
  );


  return (
    <Card className="w-full shadow-lg border-gray-700 bg-scanner-card text-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Network className="mr-3 h-6 w-6 text-blue-400" />
          Advanced Network Tools
        </CardTitle>
        <CardDescription className="text-gray-400">
          A suite of tools for network reconnaissance and diagnostics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTool} onValueChange={(value) => setActiveTool(value as ToolName)} className="w-full">
          <ScrollArea className="pb-2">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1 bg-scanner-dark-alt p-1 rounded-md">
              {Object.entries(toolConfig).map(([key, { icon: Icon, name }]) => (
                <TabsTrigger key={key} value={key} className="flex-col h-auto py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-700 transition-colors">
                  <Icon className="mb-1 h-5 w-5" />
                  <span className="text-xs">{name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          <div className="mt-6 space-y-4">
            {renderInputs()}
            
            <Button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} variant="outline" className="w-full border-gray-600 hover:bg-gray-700 text-gray-300">
                {showAdvancedOptions ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                Advanced Options
            </Button>

            {showAdvancedOptions && <AdvancedOptions />}

            <Button onClick={handleExecute} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                React.createElement(toolConfig[activeTool]?.icon || ScanLine, { className: "mr-2 h-5 w-5" })
              )}
              Execute {toolConfig[activeTool]?.name || 'Tool'}
            </Button>
          </div>
        </Tabs>

        {results && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileJson className="mr-2 h-5 w-5 text-green-400" />
              Results:
            </h3>
            <ScrollArea className="h-[300px] p-3 bg-scanner-dark-alt border border-gray-600 rounded-md">
              {renderResults()}
            </ScrollArea>
            <Button onClick={() => setResults(null)} variant="outline" className="mt-3 border-gray-600 hover:bg-gray-700">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedNetworkTools;


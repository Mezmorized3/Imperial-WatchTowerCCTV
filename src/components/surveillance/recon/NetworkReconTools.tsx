
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Globe, Search, Server, Database, Loader2, Map, AlertTriangle, Network
} from 'lucide-react';
import { 
  executeShodan,
  executeCensys, 
  executeHttpx,
  executeNuclei, 
  executeAmass
} from '@/utils/osintTools';

const NetworkReconTools: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('shodan');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Shodan state
  const [shodanQuery, setShodanQuery] = useState('');
  const [shodanFacets, setShodanFacets] = useState('');
  const [shodanLimit, setShodanLimit] = useState('10');
  const [shodanApiKey, setShodanApiKey] = useState('');
  
  // Censys state
  const [censysQuery, setCensysQuery] = useState('');
  const [censysFields, setCensysFields] = useState('');
  const [censysPage, setCensysPage] = useState('1');
  const [censysPerPage, setCensysPerPage] = useState('10');
  const [censysApiId, setCensysApiId] = useState('');
  const [censysApiSecret, setCensysApiSecret] = useState('');
  
  // Httpx state
  const [httpxTarget, setHttpxTarget] = useState('');
  const [httpxPorts, setHttpxPorts] = useState('80,443,8080,8443');
  const [httpxThreads, setHttpxThreads] = useState('10');
  const [httpxStatusCode, setHttpxStatusCode] = useState(true);
  const [httpxTitle, setHttpxTitle] = useState(true);
  const [httpxWebServer, setHttpxWebServer] = useState(true);
  const [httpxContentType, setHttpxContentType] = useState(false);
  
  // Nuclei state
  const [nucleiTarget, setNucleiTarget] = useState('');
  const [nucleiTemplates, setNucleiTemplates] = useState('');
  const [nucleiSeverity, setNucleiSeverity] = useState<string[]>(['critical', 'high']);
  const [nucleiTags, setNucleiTags] = useState('');
  const [nucleiRateLimit, setNucleiRateLimit] = useState('150');
  const [nucleiTimeout, setNucleiTimeout] = useState('5');
  
  // Amass state
  const [amassDomain, setAmassDomain] = useState('');
  const [amassMode, setAmassMode] = useState<'passive' | 'active' | 'enum' | 'intel'>('passive');
  const [amassTimeout, setAmassTimeout] = useState('30');
  const [amassResolvers, setAmassResolvers] = useState('');
  const [amassIpv4, setAmassIpv4] = useState(true);
  const [amassIpv6, setAmassIpv6] = useState(false);
  const [amassAsn, setAmassAsn] = useState('');
  
  const handleExecute = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch(activeTab) {
        case 'shodan':
          if (!shodanQuery) {
            throw new Error('Please enter a search query');
          }
          
          result = await executeShodan({
            query: shodanQuery,
            facets: shodanFacets ? shodanFacets.split(',') : undefined,
            page: 1,
            minify: false,
            limit: parseInt(shodanLimit),
            apiKey: shodanApiKey || undefined
          });
          
          if (result.success) {
            toast({
              title: "Shodan Search Complete",
              description: `Found ${result.data.matches?.length || 0} results`
            });
          }
          break;
          
        case 'censys':
          if (!censysQuery) {
            throw new Error('Please enter a search query');
          }
          
          result = await executeCensys({
            query: censysQuery,
            fields: censysFields ? censysFields.split(',') : undefined,
            page: parseInt(censysPage),
            perPage: parseInt(censysPerPage),
            apiId: censysApiId || undefined,
            apiSecret: censysApiSecret || undefined
          });
          
          if (result.success) {
            toast({
              title: "Censys Search Complete",
              description: `Found ${result.data.result?.hits?.length || 0} results`
            });
          }
          break;
          
        case 'httpx':
          if (!httpxTarget) {
            throw new Error('Please enter a target');
          }
          
          result = await executeHttpx({
            target: httpxTarget.includes(',') ? httpxTarget.split(',') : httpxTarget,
            ports: httpxPorts,
            threads: parseInt(httpxThreads),
            statusCode: httpxStatusCode,
            title: httpxTitle,
            webServer: httpxWebServer,
            contentType: httpxContentType,
            outputFormat: 'json'
          });
          
          if (result.success) {
            toast({
              title: "Httpx Scan Complete",
              description: `Scanned ${result.data.statistics?.total_requests || 0} endpoints`
            });
          }
          break;
          
        case 'nuclei':
          if (!nucleiTarget) {
            throw new Error('Please enter a target');
          }
          
          result = await executeNuclei({
            target: nucleiTarget.includes(',') ? nucleiTarget.split(',') : nucleiTarget,
            templates: nucleiTemplates ? nucleiTemplates.split(',') : undefined,
            severity: nucleiSeverity,
            tags: nucleiTags ? nucleiTags.split(',') : undefined,
            rateLimit: parseInt(nucleiRateLimit),
            timeout: parseInt(nucleiTimeout) * 60,
            outputFormat: 'json'
          });
          
          if (result.success) {
            toast({
              title: "Nuclei Scan Complete",
              description: `Found ${result.data.results?.length || 0} vulnerabilities`
            });
          }
          break;
          
        case 'amass':
          if (!amassDomain) {
            throw new Error('Please enter a domain');
          }
          
          result = await executeAmass({
            domain: amassDomain,
            mode: amassMode,
            timeout: parseInt(amassTimeout) * 60,
            resolvers: amassResolvers ? amassResolvers.split(',') : undefined,
            ipv4: amassIpv4,
            ipv6: amassIpv6,
            asn: amassAsn ? amassAsn.split(',') : undefined
          });
          
          if (result.success) {
            toast({
              title: "Amass Enumeration Complete",
              description: `Found ${result.data.domains?.length || 0} domains`
            });
          }
          break;
      }
      
      if (result && result.success) {
        setResults(result.data);
      } else if (result) {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error(`Error during ${activeTab} execution:`, error);
      toast({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Error`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderShodanForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shodan-query">Search Query</Label>
        <Input
          id="shodan-query"
          placeholder="product:hikvision country:US port:80,443"
          value={shodanQuery}
          onChange={(e) => setShodanQuery(e.target.value)}
        />
        <p className="text-xs text-gray-500">Example: webcam port:554 country:US</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shodan-facets">Facets (optional)</Label>
          <Input
            id="shodan-facets"
            placeholder="country,port,org"
            value={shodanFacets}
            onChange={(e) => setShodanFacets(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="shodan-limit">Result Limit</Label>
          <Input
            id="shodan-limit"
            type="number"
            placeholder="10"
            value={shodanLimit}
            onChange={(e) => setShodanLimit(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="shodan-api-key">Shodan API Key (optional)</Label>
        <Input
          id="shodan-api-key"
          type="password"
          placeholder="Enter your Shodan API key for full access"
          value={shodanApiKey}
          onChange={(e) => setShodanApiKey(e.target.value)}
        />
      </div>
    </div>
  );
  
  const renderCensysForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="censys-query">Search Query</Label>
        <Input
          id="censys-query"
          placeholder="service.service_name=RTSP or services.port=554"
          value={censysQuery}
          onChange={(e) => setCensysQuery(e.target.value)}
        />
        <p className="text-xs text-gray-500">Example: services.port=554 or services.port=8000</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="censys-fields">Fields (optional)</Label>
          <Input
            id="censys-fields"
            placeholder="ip,services.port,location.country"
            value={censysFields}
            onChange={(e) => setCensysFields(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="censys-per-page">Results Per Page</Label>
          <Input
            id="censys-per-page"
            type="number"
            placeholder="10"
            value={censysPerPage}
            onChange={(e) => setCensysPerPage(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="censys-page">Page Number</Label>
        <Input
          id="censys-page"
          type="number"
          placeholder="1"
          value={censysPage}
          onChange={(e) => setCensysPage(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="censys-api-id">Censys API ID (optional)</Label>
          <Input
            id="censys-api-id"
            type="password"
            placeholder="Enter your Censys API ID"
            value={censysApiId}
            onChange={(e) => setCensysApiId(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="censys-api-secret">Censys API Secret (optional)</Label>
          <Input
            id="censys-api-secret"
            type="password"
            placeholder="Enter your Censys API Secret"
            value={censysApiSecret}
            onChange={(e) => setCensysApiSecret(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
  
  const renderHttpxForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="httpx-target">Target(s)</Label>
        <Input
          id="httpx-target"
          placeholder="example.com,example2.com or 192.168.1.1/24"
          value={httpxTarget}
          onChange={(e) => setHttpxTarget(e.target.value)}
        />
        <p className="text-xs text-gray-500">Can be domains, IPs, or CIDR ranges (comma-separated)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="httpx-ports">Ports</Label>
          <Input
            id="httpx-ports"
            placeholder="80,443,8080,8443"
            value={httpxPorts}
            onChange={(e) => setHttpxPorts(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="httpx-threads">Threads</Label>
          <Input
            id="httpx-threads"
            type="number"
            placeholder="10"
            value={httpxThreads}
            onChange={(e) => setHttpxThreads(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="httpx-status-code"
            checked={httpxStatusCode}
            onCheckedChange={(checked) => setHttpxStatusCode(!!checked)}
          />
          <Label htmlFor="httpx-status-code">Status Code</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="httpx-title"
            checked={httpxTitle}
            onCheckedChange={(checked) => setHttpxTitle(!!checked)}
          />
          <Label htmlFor="httpx-title">Page Title</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="httpx-web-server"
            checked={httpxWebServer}
            onCheckedChange={(checked) => setHttpxWebServer(!!checked)}
          />
          <Label htmlFor="httpx-web-server">Web Server</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="httpx-content-type"
            checked={httpxContentType}
            onCheckedChange={(checked) => setHttpxContentType(!!checked)}
          />
          <Label htmlFor="httpx-content-type">Content Type</Label>
        </div>
      </div>
    </div>
  );
  
  const renderNucleiForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nuclei-target">Target(s)</Label>
        <Input
          id="nuclei-target"
          placeholder="example.com,example2.com or 192.168.1.1/24"
          value={nucleiTarget}
          onChange={(e) => setNucleiTarget(e.target.value)}
        />
        <p className="text-xs text-gray-500">Can be domains, IPs, or CIDR ranges (comma-separated)</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nuclei-templates">Templates (optional)</Label>
        <Input
          id="nuclei-templates"
          placeholder="camera,iot,cve,exposed-panels"
          value={nucleiTemplates}
          onChange={(e) => setNucleiTemplates(e.target.value)}
        />
        <p className="text-xs text-gray-500">Comma-separated template names or categories</p>
      </div>
      
      <div className="space-y-2">
        <Label>Severity Levels</Label>
        <div className="grid grid-cols-2 gap-2">
          {['critical', 'high', 'medium', 'low', 'info'].map((severity) => (
            <div key={severity} className="flex items-center space-x-2">
              <Checkbox
                id={`severity-${severity}`}
                checked={nucleiSeverity.includes(severity)}
                onCheckedChange={(checked) => {
                  setNucleiSeverity(checked 
                    ? [...nucleiSeverity, severity] 
                    : nucleiSeverity.filter(s => s !== severity)
                  );
                }}
              />
              <Label htmlFor={`severity-${severity}`} className="capitalize">{severity}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nuclei-tags">Tags (optional)</Label>
        <Input
          id="nuclei-tags"
          placeholder="cve,rce,lfi,camera,iot"
          value={nucleiTags}
          onChange={(e) => setNucleiTags(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nuclei-rate-limit">Rate Limit (requests/second)</Label>
          <Input
            id="nuclei-rate-limit"
            type="number"
            placeholder="150"
            value={nucleiRateLimit}
            onChange={(e) => setNucleiRateLimit(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nuclei-timeout">Timeout (minutes)</Label>
          <Input
            id="nuclei-timeout"
            type="number"
            placeholder="5"
            value={nucleiTimeout}
            onChange={(e) => setNucleiTimeout(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
  
  const renderAmassForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amass-domain">Domain</Label>
        <Input
          id="amass-domain"
          placeholder="example.com"
          value={amassDomain}
          onChange={(e) => setAmassDomain(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amass-mode">Enumeration Mode</Label>
        <Select value={amassMode} onValueChange={(value: any) => setAmassMode(value)}>
          <SelectTrigger id="amass-mode">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passive">Passive (No Direct Contact)</SelectItem>
            <SelectItem value="active">Active (DNS Queries)</SelectItem>
            <SelectItem value="enum">Full Enumeration</SelectItem>
            <SelectItem value="intel">Intelligence Gathering</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amass-timeout">Timeout (minutes)</Label>
          <Input
            id="amass-timeout"
            type="number"
            placeholder="30"
            value={amassTimeout}
            onChange={(e) => setAmassTimeout(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amass-asn">ASN (optional)</Label>
          <Input
            id="amass-asn"
            placeholder="AS15169,AS7922"
            value={amassAsn}
            onChange={(e) => setAmassAsn(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amass-resolvers">DNS Resolvers (optional)</Label>
        <Input
          id="amass-resolvers"
          placeholder="1.1.1.1,8.8.8.8"
          value={amassResolvers}
          onChange={(e) => setAmassResolvers(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="amass-ipv4"
            checked={amassIpv4}
            onCheckedChange={(checked) => setAmassIpv4(!!checked)}
          />
          <Label htmlFor="amass-ipv4">IPv4</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="amass-ipv6"
            checked={amassIpv6}
            onCheckedChange={(checked) => setAmassIpv6(!!checked)}
          />
          <Label htmlFor="amass-ipv6">IPv6</Label>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Network Reconnaissance Tools
        </CardTitle>
        <CardDescription>
          Advanced tools for discovering and analyzing camera systems across networks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-4">
            <TabsTrigger value="shodan" className="text-xs md:text-sm">
              <Database className="h-4 w-4 mr-2 hidden md:inline" />
              Shodan
            </TabsTrigger>
            <TabsTrigger value="censys" className="text-xs md:text-sm">
              <Search className="h-4 w-4 mr-2 hidden md:inline" />
              Censys
            </TabsTrigger>
            <TabsTrigger value="httpx" className="text-xs md:text-sm">
              <Server className="h-4 w-4 mr-2 hidden md:inline" />
              HttpX
            </TabsTrigger>
            <TabsTrigger value="nuclei" className="text-xs md:text-sm">
              <AlertTriangle className="h-4 w-4 mr-2 hidden md:inline" />
              Nuclei
            </TabsTrigger>
            <TabsTrigger value="amass" className="text-xs md:text-sm">
              <Map className="h-4 w-4 mr-2 hidden md:inline" />
              Amass
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shodan">
            {renderShodanForm()}
          </TabsContent>
          
          <TabsContent value="censys">
            {renderCensysForm()}
          </TabsContent>
          
          <TabsContent value="httpx">
            {renderHttpxForm()}
          </TabsContent>
          
          <TabsContent value="nuclei">
            {renderNucleiForm()}
          </TabsContent>
          
          <TabsContent value="amass">
            {renderAmassForm()}
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Results</h3>
            <Textarea
              readOnly
              value={JSON.stringify(results, null, 2)}
              className="min-h-96 font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Run {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Scan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NetworkReconTools;

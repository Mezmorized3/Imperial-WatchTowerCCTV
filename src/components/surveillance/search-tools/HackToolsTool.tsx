
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Terminal, ShieldAlert, AlertTriangle, Copy, ExternalLink } from 'lucide-react';
import { executeHackTools } from '@/utils/osintImplementations/webTools';
import { HackToolsParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const HackToolsTool: React.FC = () => {
  const [tool, setTool] = useState<string>('reverse-shell');
  const [target, setTarget] = useState<string>('10.0.0.1');
  const [customPayload, setCustomPayload] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('generate');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const tools = [
    { value: 'reverse-shell', label: 'Reverse Shell Generator' },
    { value: 'xss', label: 'XSS Payloads' },
    { value: 'sql-injection', label: 'SQL Injection' },
    { value: 'hash-cracker', label: 'Hash Cracker' },
    { value: 'jwt', label: 'JWT Token' },
    { value: 'file-upload', label: 'File Upload Bypass' }
  ];

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Payload copied to clipboard",
      });
    });
  };

  const handleGeneratePayload = async () => {
    try {
      setIsExecuting(true);
      setResults(null);
      
      const params: HackToolsParams = {
        tool,
        target,
        customPayload,
        options: {
          format: 'raw',
        }
      };
      
      const result = await executeHackTools(params);
      
      if (result.success) {
        toast({
          title: "Payload Generated",
          description: `${tool} payloads generated successfully`,
        });
        setResults(result.data);
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "An error occurred during payload generation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating payloads:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <ShieldAlert className="mr-2 h-5 w-5" />
          HackTools (LasCC/HackTools)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="generate">
              <Terminal className="h-4 w-4 mr-2" />
              Generate Payloads
            </TabsTrigger>
            <TabsTrigger value="about">
              <ExternalLink className="h-4 w-4 mr-2" />
              About HackTools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tool">Tool/Payload Type</Label>
              <Select value={tool} onValueChange={setTool}>
                <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select tool" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark text-white border-gray-700">
                  {tools.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(tool === 'reverse-shell') && (
              <div className="space-y-2">
                <Label htmlFor="target">Listener IP</Label>
                <Input
                  id="target"
                  placeholder="10.0.0.1"
                  className="bg-scanner-dark border-gray-700"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
            )}
            
            {(['xss', 'sql-injection', 'file-upload'].includes(tool)) && (
              <div className="space-y-2">
                <Label htmlFor="customPayload">Custom Payload (Optional)</Label>
                <Textarea
                  id="customPayload"
                  placeholder="Enter your custom payload"
                  className="bg-scanner-dark border-gray-700 font-mono h-20"
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                />
              </div>
            )}
            
            {(tool === 'hash-cracker') && (
              <div className="space-y-2">
                <Label htmlFor="customPayload">Hash to Crack</Label>
                <Input
                  id="customPayload"
                  placeholder="e.g., e10adc3949ba59abbe56e057f20f883e"
                  className="bg-scanner-dark border-gray-700 font-mono"
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                />
              </div>
            )}
            
            <Button
              onClick={handleGeneratePayload}
              disabled={isExecuting}
              className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Terminal className="h-4 w-4 mr-2" />
              )}
              Generate Payloads
            </Button>
            
            {results && (
              <div className="mt-4 space-y-4">
                <Label>Generated Payloads</Label>
                
                {results.payloads && (
                  <div className="space-y-2">
                    {results.payloads.map((payload: any, index: number) => (
                      <div key={index} className="bg-black p-2 rounded font-mono text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-green-400">
                            {payload.language || payload.name || `Payload ${index + 1}`}:
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => handleCopyToClipboard(payload.code || payload.payload)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap break-all">
                          {payload.code || payload.payload}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
                
                {results.result && (
                  <div className="bg-black p-2 rounded font-mono text-xs">
                    <pre>{JSON.stringify(results.result, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <div className="space-y-4">
              <p>
                HackTools is a web extension for Chrome and Firefox designed to help pentesters 
                and ethical hackers with their penetration testing engagements.
              </p>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Reverse Shell generator</li>
                  <li>XSS payload generator</li>
                  <li>SQL injection</li>
                  <li>Hash cracking tools</li>
                  <li>Encoder/Decoder</li>
                  <li>CMS tools</li>
                </ul>
              </div>
              
              <div className="bg-black/50 p-3 rounded text-sm">
                <p className="mb-2">
                  Original repository: <span className="text-blue-400">github.com/LasCC/HackTools</span>
                </p>
                <p>
                  This implementation is a simulation for demonstration purposes. For full functionality, 
                  install the HackTools browser extension from the Chrome Web Store or Firefox Add-ons.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-2 text-xs text-gray-400 flex items-start">
          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <span>
            This tool provides offensive security payloads. 
            Use only for educational purposes or on systems you own or have permission to test.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HackToolsTool;

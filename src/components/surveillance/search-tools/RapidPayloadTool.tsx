
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Terminal, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeRapidPayload } from '@/utils/osintUtilsConnector';
import { RapidPayloadParams } from '@/utils/types/osintToolTypes';

interface RapidPayloadToolProps {
  isRealmode?: boolean;
}

const RapidPayloadTool: React.FC<RapidPayloadToolProps> = ({ isRealmode = false }) => {
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [port, setPort] = useState('4444');
  const [selectedPlatform, setSelectedPlatform] = useState<RapidPayloadParams['platform']>('windows');
  const [payloadType, setPayloadType] = useState('windows/meterpreter/reverse_tcp');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  const platforms: RapidPayloadParams['platform'][] = [
    'windows', 
    'linux', 
    'macos', 
    'android', 
    'python', 
    'php', 
    'bash', 
    'powershell'
  ];
  
  const payloadTypes: Record<string, string[]> = {
    windows: ['windows/meterpreter/reverse_tcp', 'windows/shell/reverse_tcp', 'windows/x64/meterpreter/reverse_tcp'],
    linux: ['linux/x86/meterpreter/reverse_tcp', 'linux/x64/shell_reverse_tcp'],
    macos: ['osx/x64/meterpreter/reverse_tcp', 'osx/x64/shell_reverse_tcp'],
    android: ['android/meterpreter/reverse_tcp', 'android/shell/reverse_tcp'],
    python: ['python/meterpreter_reverse_tcp', 'python/shell_reverse_tcp'],
    php: ['php/meterpreter_reverse_tcp', 'php/reverse_php'],
    bash: ['cmd/unix/reverse_bash'],
    powershell: ['cmd/windows/powershell_reverse_tcp']
  };
  
  const handleGeneratePayload = async () => {
    setLoading(true);
    setOutput(null);
    
    try {
      const result = await executeRapidPayload({
        platform: selectedPlatform,
        payloadType: payloadType,
        lhost: ipAddress,
        lport: parseInt(port),
        format: 'raw',
        encode: false
      });
      
      if (result.success && result.data) {
        // Check for payload in various formats
        let payloadOutput = '';
        
        if (result.data.results && Array.isArray(result.data.results) && result.data.results.length > 0) {
          // If we have results array, get the first result's payload
          payloadOutput = result.data.results[0].payload || '';
        } else if (typeof result.data.payload === 'string') {
          // If we have a direct payload property
          payloadOutput = result.data.payload;
        } else if (typeof result.data === 'string') {
          // If the data itself is a string
          payloadOutput = result.data;
        }
        
        if (payloadOutput) {
          setOutput(payloadOutput);
          toast({
            title: "Payload Generated",
            description: "The payload has been successfully generated."
          });
        } else {
          setOutput("No payload content was returned from the service.");
          toast({
            title: "Generation Issue",
            description: "Payload was generated but no content was returned.",
            variant: "destructive"
          });
        }
      } else {
        const errorMsg = result.error || (result.data as any)?.message || "Failed to generate payload";
        setOutput(`Error: ${errorMsg}`);
        toast({
          title: "Generation Failed",
          description: errorMsg,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating payload:", error);
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
      setOutput(`Error: ${errorMsg}`);
      toast({
        title: "Generation Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast({
            title: "Copied!",
            description: "Payload copied to clipboard"
          });
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          toast({
            title: "Copy Failed",
            description: "Failed to copy to clipboard",
            variant: "destructive"
          });
        });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Terminal className="mr-2 h-5 w-5" />
            Rapid Payload Generator
          </div>
          {!isRealmode && <Badge variant="outline">Demo Mode</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">Target Platform</label>
            <Select 
              value={selectedPlatform} 
              onValueChange={(value) => {
                setSelectedPlatform(value as RapidPayloadParams['platform']);
                // Set first payload type from the selected platform
                if (payloadTypes[value] && payloadTypes[value].length > 0) {
                  setPayloadType(payloadTypes[value][0]);
                }
              }}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="payload-type" className="text-sm font-medium">Payload Type</label>
            <Select 
              value={payloadType} 
              onValueChange={setPayloadType}
            >
              <SelectTrigger id="payload-type">
                <SelectValue placeholder="Select payload type" />
              </SelectTrigger>
              <SelectContent>
                {payloadTypes[selectedPlatform]?.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="ip-address" className="text-sm font-medium">IP Address (LHOST)</label>
            <Input 
              id="ip-address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="e.g., 192.168.1.100"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="port" className="text-sm font-medium">Port (LPORT)</label>
            <Input 
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="e.g., 4444"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleGeneratePayload}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Terminal className="mr-2 h-4 w-4" />
              Generate Payload
            </>
          )}
        </Button>
        
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Payload</label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea 
              readOnly 
              value={output} 
              className="font-mono text-xs h-40"
            />
            <p className="text-xs text-muted-foreground">
              {isRealmode 
                ? "This payload can be used in a real penetration testing environment." 
                : "This is a demonstration payload and has been sanitized for safety."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RapidPayloadTool;

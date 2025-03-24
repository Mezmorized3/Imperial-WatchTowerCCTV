import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Code, AlertTriangle, Terminal } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeRapidPayload } from '@/utils/osintTools';

interface RapidPayloadToolProps {
  onPayloadGenerated?: (payload: string) => void;
}

const RapidPayloadTool: React.FC<RapidPayloadToolProps> = ({ onPayloadGenerated }) => {
  const [targetOS, setTargetOS] = useState('windows');
  const [payloadFormat, setPayloadFormat] = useState('raw');
  const [ipAddress, setIpAddress] = useState('0.0.0.0');
  const [port, setPort] = useState('4444');
  const [encodePayload, setEncodePayload] = useState(false);
  const [encryptionType, setEncryptionType] = useState('none');
  const [payloadOutput, setPayloadOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGeneratePayload = async () => {
    if (!ipAddress || !port) {
      toast({
        title: "Error",
        description: "Please enter both IP address and port",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await executeRapidPayload({
        platform: targetOS as 'windows' | 'linux' | 'macos' | 'android' | 'web', // Add platform property
        targetOS: targetOS as 'windows' | 'linux' | 'macos' | 'android' | 'web',
        payloadType: targetOS as 'windows' | 'linux' | 'macos' | 'android' | 'web',
        format: payloadFormat,
        lhost: ipAddress,
        lport: parseInt(port),
        encode: encodePayload,
        encryption: encryptionType
      });
      
      if (result && result.success) {
        setPayloadOutput(result.data?.payload || JSON.stringify(result.data, null, 2));
        toast({
          title: "Payload Generated",
          description: `${targetOS} payload created successfully`
        });
      } else {
        toast({
          title: "Generation Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during payload generation:", error);
      toast({
        title: "Generation Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 text-scanner-success mr-2" />
          Rapid Payload Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target-os">Target OS</Label>
            <Select value={targetOS} onValueChange={setTargetOS}>
              <SelectTrigger id="target-os" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select target OS" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
                <SelectItem value="macos">macOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payload-format">Payload Format</Label>
            <Select value={payloadFormat} onValueChange={setPayloadFormat}>
              <SelectTrigger id="payload-format" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select payload format" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="raw">Raw</SelectItem>
                <SelectItem value="exe">Executable (.exe)</SelectItem>
                <SelectItem value="elf">ELF</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="powershell">PowerShell</SelectItem>
                <SelectItem value="bash">Bash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ip-address">IP Address</Label>
            <Input
              id="ip-address"
              placeholder="0.0.0.0"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              placeholder="4444"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="encode-payload">Encode Payload</Label>
            <Checkbox
              id="encode-payload"
              checked={encodePayload}
              onCheckedChange={setEncodePayload}
            />
          </div>
          <div>
            <Label htmlFor="encryption-type">Encryption Type</Label>
            <Select value={encryptionType} onValueChange={setEncryptionType}>
              <SelectTrigger id="encryption-type" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select encryption" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="aes">AES</SelectItem>
                <SelectItem value="rsa">RSA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={handleGeneratePayload}
          disabled={isLoading}
          variant="default"
          className="bg-scanner-primary"
        >
          {isLoading ? (
            <>
              <Terminal className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Terminal className="h-4 w-4 mr-2" />
              Generate Payload
            </>
          )}
        </Button>
        {payloadOutput && (
          <div className="mt-4">
            <Label>Generated Payload</Label>
            <div className="relative mt-1.5">
              <Input
                readOnly
                value={payloadOutput}
                className="font-mono text-sm bg-scanner-dark-alt border-gray-700"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                onClick={() => navigator.clipboard.writeText(payloadOutput)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RapidPayloadTool;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Terminal, ArrowRight, Shield } from 'lucide-react';
import { executeRapidPayload } from '@/utils/osintTools';
import { RapidPayloadParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const RapidPayloadTool: React.FC = () => {
  const [payloadType, setPayloadType] = useState<'windows' | 'android' | 'linux' | 'macos' | 'web'>('windows');
  const [format, setFormat] = useState<string>('exe');
  const [lhost, setLhost] = useState<string>('192.168.1.100');
  const [lport, setLport] = useState<number>(4444);
  const [encode, setEncode] = useState<boolean>(true);
  const [encryption, setEncryption] = useState<string>('base64');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [results, setResults] = useState<string | null>(null);
  const { toast } = useToast();

  const formatOptions = {
    windows: ['exe', 'dll', 'ps1', 'bat', 'vbs'],
    android: ['apk', 'jar'],
    linux: ['elf', 'sh', 'py'],
    macos: ['macho', 'app', 'sh', 'py'],
    web: ['js', 'php', 'jsp', 'war']
  };

  const encryptionOptions = ['base64', 'xor', 'aes', 'hex', 'caesar', 'blowfish'];

  const handleGeneratePayload = async () => {
    try {
      setIsGenerating(true);
      setResults(null);
      
      const params: RapidPayloadParams = {
        payloadType,
        format,
        lhost,
        lport,
        encode,
        encryption,
        outputPath: `payload_${Date.now()}.${format}`
      };
      
      const result = await executeRapidPayload(params);
      
      if (result.success) {
        toast({
          title: "Payload Generated",
          description: `${payloadType} payload generated successfully`,
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "An error occurred during payload generation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating payload:", error);
      toast({
        title: "Generation Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Terminal className="mr-2 h-5 w-5" />
          RapidPayload Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payloadType">Payload Platform</Label>
            <Select 
              value={payloadType} 
              onValueChange={(value: 'windows' | 'android' | 'linux' | 'macos' | 'web') => {
                setPayloadType(value);
                // Set default format for the selected platform
                setFormat(formatOptions[value][0]);
              }}
            >
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
                <SelectItem value="macos">macOS</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Payload Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                {formatOptions[payloadType].map((fmt) => (
                  <SelectItem key={fmt} value={fmt}>{fmt.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lhost">LHOST (Listening Host)</Label>
            <Input
              id="lhost"
              placeholder="192.168.1.100"
              className="bg-scanner-dark border-gray-700"
              value={lhost}
              onChange={(e) => setLhost(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lport">LPORT (Listening Port)</Label>
            <Input
              id="lport"
              type="number"
              placeholder="4444"
              className="bg-scanner-dark border-gray-700"
              value={lport}
              onChange={(e) => setLport(parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="encode">Encode Payload</Label>
              <Switch 
                id="encode" 
                checked={encode}
                onCheckedChange={setEncode}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="encryption">Encryption Method</Label>
            <Select value={encryption} onValueChange={setEncryption} disabled={!encode}>
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select encryption" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                {encryptionOptions.map((enc) => (
                  <SelectItem key={enc} value={enc}>{enc.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={handleGeneratePayload}
          disabled={isGenerating}
          className="w-full bg-scanner-primary hover:bg-scanner-primary/90"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          Generate Payload
        </Button>
        
        {results && (
          <div className="mt-4">
            <Label>Generated Payload Info</Label>
            <div className="bg-black rounded p-2 mt-1 overflow-auto max-h-60 text-xs font-mono">
              <pre>{results}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400">
          <Shield className="h-3 w-3 inline mr-1" />
          <span>For educational purposes only. Ensure you have proper authorization before use.</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RapidPayloadTool;

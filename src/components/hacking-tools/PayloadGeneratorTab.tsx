import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check, Terminal } from 'lucide-react';
import { executeRapidPayload } from '@/utils/osintTools';

interface PayloadGeneratorTabProps {
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
}

const PayloadGeneratorTab: React.FC<PayloadGeneratorTabProps> = ({ 
  isExecuting, 
  setIsExecuting, 
  setToolOutput 
}) => {
  const [customIp, setCustomIp] = useState('0.0.0.0');
  const [customPort, setCustomPort] = useState('4444');
  const [targetOS, setTargetOS] = useState('windows');
  const [payloadType, setPayloadType] = useState('meterpreter/reverse_tcp');
  const [payloadOutput, setPayloadOutput] = useState('');
  const [payloadFormat, setPayloadFormat] = useState('raw');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: `The ${type} has been copied to your clipboard.`,
      });
    });
  };
  
  const executePayloadGenerator = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      // Execute payload generator for the selected OS and payload type
      const result = await executeRapidPayload({
        targetOS,
        platform: targetOS,
        payloadType,
        format: payloadFormat,
        options: {
          lhost: customIp,
          lport: parseInt(customPort)
        }
      });
      
      if (result.success) {
        setPayloadOutput(result.data?.payload || JSON.stringify(result.data, null, 2));
      }
      
      toast({
        title: "Payload Generated",
        description: `${targetOS} payload created successfully`,
      });
      
    } catch (error) {
      console.error('Tool execution error:', error);
      setPayloadOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
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
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="payload-type">Payload Type</Label>
          <Select value={payloadType} onValueChange={setPayloadType}>
            <SelectTrigger id="payload-type" className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select payload type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="meterpreter/reverse_tcp">Meterpreter Reverse TCP</SelectItem>
              <SelectItem value="meterpreter/reverse_https">Meterpreter Reverse HTTPS</SelectItem>
              <SelectItem value="shell/reverse_tcp">Shell Reverse TCP</SelectItem>
              <SelectItem value="powershell/reverse_tcp">PowerShell Reverse TCP</SelectItem>
              <SelectItem value="cmd/unix/reverse_bash">Bash Reverse Shell</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lhost">LHOST (Your IP)</Label>
          <Input
            id="lhost"
            value={customIp}
            onChange={(e) => setCustomIp(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div>
          <Label htmlFor="lport">LPORT (Your Port)</Label>
          <Input
            id="lport"
            value={customPort}
            onChange={(e) => setCustomPort(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="payload-format">Format</Label>
        <Select value={payloadFormat} onValueChange={setPayloadFormat}>
          <SelectTrigger id="payload-format" className="bg-scanner-dark-alt border-gray-700">
            <SelectValue placeholder="Select format" />
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
      
      <Button
        onClick={executePayloadGenerator}
        disabled={isExecuting}
        variant="default"
        className="bg-scanner-primary"
      >
        <Terminal className="h-4 w-4 mr-2" />
        {isExecuting ? "Generating..." : "Generate Payload"}
      </Button>
      
      {payloadOutput && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <Label>Generated Payload</Label>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(payloadOutput, 'payload')}
            >
              {copySuccess === 'payload' ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copy
            </Button>
          </div>
          <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4 mt-1.5">
            <pre className="text-xs overflow-auto whitespace-pre-wrap">{payloadOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayloadGeneratorTab;

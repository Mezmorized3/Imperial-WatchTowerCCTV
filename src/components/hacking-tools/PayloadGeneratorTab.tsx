
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Copy, Check, Terminal, Loader2 } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintUtilsConnector'; // Corrected: use executeHackingTool
import { RapidPayloadParams } from '@/utils/types/osintToolTypes'; // Assuming this type exists for params

interface PayloadGeneratorTabProps {
  isExecuting: boolean; // Prop isExecuting is marked as unused. For consistency, we'll manage loading state internally.
  setIsExecuting: (isExecuting: boolean) => void; // Prop setIsExecuting is marked as unused.
  setToolOutput: (output: string | null) => void; // Prop setToolOutput is marked as unused.
}

const PayloadGeneratorTab: React.FC<PayloadGeneratorTabProps> = ({ 
  // isExecuting: propIsExecuting,  // Use internal loading state
  // setIsExecuting: propSetIsExecuting, 
  // setToolOutput: propSetToolOutput
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customIp, setCustomIp] = useState('10.0.0.1'); // Default to a common private IP
  const [customPort, setCustomPort] = useState('4444');
  const [targetPlatform, setTargetPlatform] = useState<RapidPayloadParams['platform']>('windows');
  const [payloadType, setPayloadType] = useState<RapidPayloadParams['payloadType']>('windows/meterpreter/reverse_tcp');
  const [payloadOutput, setPayloadOutput] = useState('');
  const [payloadFormat, setPayloadFormat] = useState<RapidPayloadParams['format']>('raw');
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
    setIsLoading(true);
    // if (propSetIsExecuting) propSetIsExecuting(true);
    // if (propSetToolOutput) propSetToolOutput(null);
    setPayloadOutput('');
    
    const params: RapidPayloadParams & { tool: string } = {
      tool: 'rapidPayload', // Added tool name for executeHackingTool
      platform: targetPlatform,
      payloadType: payloadType,
      format: payloadFormat,
      lhost: customIp,
      lport: parseInt(customPort),
      // Defaulting encode and encryption, make them configurable if needed
      options: { 
        encoder: undefined, // e.g., 'x86/shikata_ga_nai'
        iterations: 1,
        bad_chars: '', // e.g. '\x00\x0a\x0d'
        nops: 0,
      }
    };

    try {
      const result = await executeHackingTool(params);
      
      if (result.success && result.data) {
        // Assuming result.data for rapidPayload is { payload: string, message?: string } or similar
        const data = result.data as { payload?: string; results?: { payload: string }[]; message?: string };
        const actualPayload = data.payload || (data.results && data.results[0]?.payload);

        if (actualPayload) {
          setPayloadOutput(actualPayload);
          // if (propSetToolOutput) propSetToolOutput(actualPayload);
          toast({
            title: "Payload Generated",
            description: data.message || `${targetPlatform} payload created successfully.`,
          });
        } else {
          const errorMessage = data.message || "Payload generation succeeded but no payload returned.";
          setPayloadOutput(`Error: ${errorMessage}`);
          // if (propSetToolOutput) propSetToolOutput(`Error: ${errorMessage}`);
          toast({ title: "Payload Generation Info", description: errorMessage, variant: "default" });
        }
      } else {
        const errorData = result?.data as { message: string } | undefined;
        const errorMessage = errorData?.message || result?.error || "Unknown error occurred";
        setPayloadOutput(`Error: ${errorMessage}`);
        // if (propSetToolOutput) propSetToolOutput(`Error: ${errorMessage}`);
        toast({
          title: "Execution Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during payload generation';
      setPayloadOutput(`Error: ${errorMessage}`);
      // if (propSetToolOutput) propSetToolOutput(`Error: ${errorMessage}`);
      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // if (propSetIsExecuting) propSetIsExecuting(false);
    }
  };

  const platformOptions: RapidPayloadParams['platform'][] = ['windows', 'linux', 'macos', 'android', 'python', 'php', 'bash', 'powershell'];
  const payloadTypeOptions: { [key in RapidPayloadParams['platform']]?: RapidPayloadParams['payloadType'][] } = {
    windows: ['windows/meterpreter/reverse_tcp', 'windows/shell/reverse_tcp', 'windows/x64/meterpreter/reverse_tcp', 'windows/powershell_reverse_tcp'],
    linux: ['linux/x86/meterpreter/reverse_tcp', 'linux/x64/shell_reverse_tcp', 'linux/armle/shell_reverse_tcp'],
    macos: ['osx/x64/meterpreter/reverse_tcp', 'osx/x64/shell_reverse_tcp'],
    android: ['android/meterpreter/reverse_tcp', 'android/shell/reverse_tcp'],
    python: ['python/meterpreter_reverse_tcp', 'python/shell_reverse_tcp'],
    php: ['php/meterpreter_reverse_tcp', 'php/reverse_php'],
    bash: ['cmd/unix/reverse_bash'],
    powershell: ['cmd/windows/powershell_reverse_tcp'],
  };
  const formatOptions: RapidPayloadParams['format'][] = ['raw', 'exe', 'elf', 'macho', 'apk', 'py', 'php', 'ps1', 'sh', 'c', 'java', 'ruby'];


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target-platform">Target Platform</Label>
          <Select 
            value={targetPlatform} 
            onValueChange={(value: RapidPayloadParams['platform']) => {
              setTargetPlatform(value);
              // Reset payload type if it's not compatible
              const compatiblePayloads = payloadTypeOptions[value] || [];
              if (compatiblePayloads.length > 0 && !compatiblePayloads.includes(payloadType as any)) {
                setPayloadType(compatiblePayloads[0]);
              } else if (compatiblePayloads.length === 0) {
                setPayloadType('' as any); // Or a generic default
              }
            }}
          >
            <SelectTrigger id="target-platform" className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select target platform" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              {platformOptions.map(opt => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="payload-type">Payload Type</Label>
          <Select 
            value={payloadType} 
            onValueChange={(value: RapidPayloadParams['payloadType']) => setPayloadType(value)}
            disabled={!(payloadTypeOptions[targetPlatform] && payloadTypeOptions[targetPlatform]!.length > 0)}
          >
            <SelectTrigger id="payload-type" className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select payload type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              {(payloadTypeOptions[targetPlatform] || []).map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
               {(!(payloadTypeOptions[targetPlatform] && payloadTypeOptions[targetPlatform]!.length > 0)) && <SelectItem value="" disabled>No types for platform</SelectItem>}
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
            placeholder="e.g., 192.168.0.5"
          />
        </div>
        
        <div>
          <Label htmlFor="lport">LPORT (Your Port)</Label>
          <Input
            id="lport"
            type="number"
            value={customPort}
            onChange={(e) => setCustomPort(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
            placeholder="e.g., 4444"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="payload-format">Output Format</Label>
        <Select value={payloadFormat} onValueChange={(value: RapidPayloadParams['format']) => setPayloadFormat(value)}>
          <SelectTrigger id="payload-format" className="bg-scanner-dark-alt border-gray-700">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className="bg-scanner-dark border-gray-700">
            {formatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={executePayloadGenerator}
        disabled={isLoading}
        variant="default"
        className="w-full bg-scanner-primary"
      >
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Terminal className="h-4 w-4 mr-2" />}
        {isLoading ? "Generating..." : "Generate Payload"}
      </Button>
      
      {payloadOutput && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <Label>Generated Payload</Label>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(payloadOutput, 'payload')}
            >
              {copySuccess === 'payload' ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              Copy
            </Button>
          </div>
          <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4">
            <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96">{payloadOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayloadGeneratorTab;

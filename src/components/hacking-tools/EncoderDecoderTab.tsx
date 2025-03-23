
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check } from 'lucide-react';

const EncoderDecoderTab: React.FC = () => {
  const [encodeInput, setEncodeInput] = useState('');
  const [encodeType, setEncodeType] = useState('base64');
  const [encodeOutput, setEncodeOutput] = useState('');
  
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeType, setDecodeType] = useState('base64');
  const [decodeOutput, setDecodeOutput] = useState('');
  
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  // Encode/Decode functions
  const encode = (str: string, type: string): string => {
    switch(type) {
      case 'base64':
        return btoa(str);
      case 'url':
        return encodeURIComponent(str);
      case 'html':
        return str.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      case 'hex':
        return Array.from(str)
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      default:
        return str;
    }
  };
  
  const decode = (str: string, type: string): string => {
    try {
      switch(type) {
        case 'base64':
          return atob(str);
        case 'url':
          return decodeURIComponent(str);
        case 'html':
          const txt = document.createElement('textarea');
          txt.innerHTML = str;
          return txt.value;
        case 'hex':
          if (str.length % 2 !== 0) throw new Error('Invalid hex string');
          let result = '';
          for (let i = 0; i < str.length; i += 2) {
            result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
          }
          return result;
        default:
          return str;
      }
    } catch (e) {
      return 'Invalid input for selected decode method';
    }
  };
  
  const handleEncode = () => {
    setEncodeOutput(encode(encodeInput, encodeType));
  };
  
  const handleDecode = () => {
    setDecodeOutput(decode(decodeInput, decodeType));
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Encode</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Label htmlFor="encode-input">Text to Encode</Label>
            <Textarea 
              id="encode-input"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="encode-type">Encoding</Label>
            <Select 
              value={encodeType} 
              onValueChange={setEncodeType}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="base64">Base64</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="hex">Hex</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full mt-2" 
              onClick={handleEncode}
            >
              Encode
            </Button>
          </div>
        </div>
        
        {encodeOutput && (
          <div>
            <Label>Encoded Output</Label>
            <div className="relative mt-1.5">
              <Textarea 
                readOnly 
                value={encodeOutput}
                className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                onClick={() => handleCopyToClipboard(encodeOutput, 'encoded text')}
              >
                {copySuccess === 'encoded text' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Separator className="bg-gray-700" />
      
      <div className="space-y-4">
        <h3 className="font-semibold">Decode</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Label htmlFor="decode-input">Text to Decode</Label>
            <Textarea 
              id="decode-input"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="decode-type">Decoding</Label>
            <Select 
              value={decodeType} 
              onValueChange={setDecodeType}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="base64">Base64</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="hex">Hex</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full mt-2" 
              onClick={handleDecode}
            >
              Decode
            </Button>
          </div>
        </div>
        
        {decodeOutput && (
          <div>
            <Label>Decoded Output</Label>
            <div className="relative mt-1.5">
              <Textarea 
                readOnly 
                value={decodeOutput}
                className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                onClick={() => handleCopyToClipboard(decodeOutput, 'decoded text')}
              >
                {copySuccess === 'decoded text' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncoderDecoderTab;

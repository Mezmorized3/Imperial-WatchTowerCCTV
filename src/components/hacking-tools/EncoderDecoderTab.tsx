
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Encode, Decode, Copy, Check } from 'lucide-react';

interface EncoderDecoderTabProps {
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string) => void;
  isRealmode: boolean;
}

const EncoderDecoderTab: React.FC<EncoderDecoderTabProps> = ({ 
  isExecuting, 
  setIsExecuting, 
  setToolOutput,
  isRealmode 
}) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encodeType, setEncodeType] = useState('base64');
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const encodeBase64 = (text: string) => {
    try {
      return btoa(text);
    } catch (e) {
      return 'Error: Unable to encode text';
    }
  };
  
  const decodeBase64 = (text: string) => {
    try {
      return atob(text);
    } catch (e) {
      return 'Error: Invalid Base64 string';
    }
  };
  
  const encodeURL = (text: string) => {
    try {
      return encodeURIComponent(text);
    } catch (e) {
      return 'Error: Unable to URL encode text';
    }
  };
  
  const decodeURL = (text: string) => {
    try {
      return decodeURIComponent(text);
    } catch (e) {
      return 'Error: Invalid URL encoded string';
    }
  };
  
  const encodeHex = (text: string) => {
    try {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += text.charCodeAt(i).toString(16);
      }
      return result;
    } catch (e) {
      return 'Error: Unable to encode to hex';
    }
  };
  
  const decodeHex = (text: string) => {
    try {
      let result = '';
      for (let i = 0; i < text.length; i += 2) {
        result += String.fromCharCode(parseInt(text.substr(i, 2), 16));
      }
      return result;
    } catch (e) {
      return 'Error: Invalid hex string';
    }
  };
  
  const handleExecute = () => {
    if (!inputText) {
      toast({
        title: "Input Required",
        description: "Please enter text to encode or decode",
        variant: "destructive"
      });
      return;
    }
    
    setIsExecuting(true);
    
    try {
      let result = '';
      
      if (operation === 'encode') {
        switch (encodeType) {
          case 'base64':
            result = encodeBase64(inputText);
            break;
          case 'url':
            result = encodeURL(inputText);
            break;
          case 'hex':
            result = encodeHex(inputText);
            break;
          default:
            result = 'Error: Unknown encoding type';
        }
      } else {
        switch (encodeType) {
          case 'base64':
            result = decodeBase64(inputText);
            break;
          case 'url':
            result = decodeURL(inputText);
            break;
          case 'hex':
            result = decodeHex(inputText);
            break;
          default:
            result = 'Error: Unknown decoding type';
        }
      }
      
      setOutputText(result);
      setToolOutput(result);
      
      toast({
        title: `${operation === 'encode' ? 'Encoded' : 'Decoded'} Successfully`,
        description: `Text has been ${operation === 'encode' ? 'encoded' : 'decoded'} using ${encodeType}`,
      });
    } catch (error) {
      console.error('Execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setToolOutput(`Error: ${errorMessage}`);
      
      toast({
        title: "Execution Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: `The ${type} has been copied to your clipboard.`
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Button
            variant={operation === 'encode' ? 'default' : 'outline'}
            className={operation === 'encode' ? 'bg-scanner-primary' : ''}
            onClick={() => setOperation('encode')}
          >
            <Encode className="h-4 w-4 mr-2" />
            Encode
          </Button>
          <Button
            variant={operation === 'decode' ? 'default' : 'outline'}
            className={operation === 'decode' ? 'bg-scanner-primary' : ''}
            onClick={() => setOperation('decode')}
          >
            <Decode className="h-4 w-4 mr-2" />
            Decode
          </Button>
        </div>
        
        <div>
          <Label htmlFor="encode-type">Type</Label>
          <Select value={encodeType} onValueChange={setEncodeType}>
            <SelectTrigger id="encode-type" className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select encoding type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="base64">Base64</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="hex">Hex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="input-text">Input</Label>
        <div className="relative mt-1.5">
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-24 bg-scanner-dark-alt border-gray-700"
            placeholder={`Enter text to ${operation}...`}
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
            onClick={() => handleCopyToClipboard(inputText, 'input')}
          >
            {copySuccess === 'input' ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <Button
        onClick={handleExecute}
        disabled={isExecuting || !inputText}
        className="bg-scanner-primary"
      >
        {operation === 'encode' ? (
          <Encode className="h-4 w-4 mr-2" />
        ) : (
          <Decode className="h-4 w-4 mr-2" />
        )}
        {isExecuting ? 'Processing...' : operation === 'encode' ? 'Encode' : 'Decode'}
      </Button>
      
      {outputText && (
        <div>
          <Label htmlFor="output-text">Output</Label>
          <div className="relative mt-1.5">
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              className="min-h-24 bg-scanner-dark-alt border-gray-700"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(outputText, 'output')}
            >
              {copySuccess === 'output' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncoderDecoderTab;

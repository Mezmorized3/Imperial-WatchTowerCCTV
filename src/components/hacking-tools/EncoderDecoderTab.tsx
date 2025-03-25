
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Code, Copy, Check } from 'lucide-react';

// Define any necessary interfaces
interface EncoderDecoderTabProps {
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
  isRealmode?: boolean;
}

const EncoderDecoderTab: React.FC<EncoderDecoderTabProps> = ({ 
  isExecuting, 
  setIsExecuting, 
  setToolOutput,
  isRealmode = false 
}) => {
  const [inputText, setInputText] = useState('');
  const [encoding, setEncoding] = useState('base64');
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleProcess = () => {
    if (!inputText) {
      toast({
        title: "No input provided",
        description: "Please enter text to encode or decode",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setToolOutput(null);

    try {
      let result = '';
      
      if (operation === 'encode') {
        if (encoding === 'base64') {
          result = btoa(inputText);
        } else if (encoding === 'uri') {
          result = encodeURIComponent(inputText);
        } else if (encoding === 'hex') {
          result = Array.from(inputText)
            .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
        }
      } else {
        if (encoding === 'base64') {
          try {
            result = atob(inputText);
          } catch (e) {
            result = 'Error: Invalid base64 input';
          }
        } else if (encoding === 'uri') {
          try {
            result = decodeURIComponent(inputText);
          } catch (e) {
            result = 'Error: Invalid URI component';
          }
        } else if (encoding === 'hex') {
          try {
            result = inputText.match(/.{1,2}/g)?.map(byte => 
              String.fromCharCode(parseInt(byte, 16))
            ).join('') || 'Error: Invalid hex input';
          } catch (e) {
            result = 'Error: Invalid hex input';
          }
        }
      }
      
      setToolOutput(result);
      
      toast({
        title: `${operation === 'encode' ? 'Encoded' : 'Decoded'} Successfully`,
        description: `${encoding.toUpperCase()} ${operation} completed`,
      });
    } catch (error) {
      console.error('Encoding/decoding error:', error);
      setToolOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('result');
      setTimeout(() => setCopySuccess(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: "The result has been copied to your clipboard.",
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Select 
            value={operation} 
            onValueChange={(value) => setOperation(value as 'encode' | 'decode')}
          >
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="encode">Encode</SelectItem>
              <SelectItem value="decode">Decode</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select 
            value={encoding} 
            onValueChange={setEncoding}
          >
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select encoding" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="base64">Base64</SelectItem>
              <SelectItem value="uri">URL Encoding</SelectItem>
              <SelectItem value="hex">Hex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="input-text">Input Text</Label>
        <Textarea
          id="input-text"
          placeholder={`Text to ${operation}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-32 bg-scanner-dark-alt border-gray-700"
        />
      </div>
      
      <Button
        onClick={handleProcess}
        disabled={isExecuting || !inputText}
        className="w-full bg-scanner-primary"
      >
        {operation === 'encode' ? (
          <><Code className="h-4 w-4 mr-2" /> Encode</>
        ) : (
          <><Code className="h-4 w-4 mr-2" /> Decode</>
        )}
      </Button>
      
      {setToolOutput && (
        <div>
          <div className="flex justify-between items-center">
            <Label>Result</Label>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 py-0 px-2 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(document.getElementById('result-text')?.textContent || '')}
            >
              {copySuccess === 'result' ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              Copy
            </Button>
          </div>
          <div 
            id="result-text"
            className="mt-1.5 p-4 min-h-32 bg-scanner-dark-alt rounded-md border border-gray-700 overflow-auto whitespace-pre-wrap"
          >
            {/* Result will be displayed here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncoderDecoderTab;

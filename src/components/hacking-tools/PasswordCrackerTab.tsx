
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check, Key, Unlock } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';

interface PasswordCrackerTabProps {
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  toolOutput: string | null;
  setToolOutput: (output: string | null) => void;
  executeSelectedTool: (toolType: string) => void;
  isRealmode?: boolean; // Add the optional property to fix the error
}

const PasswordCrackerTab: React.FC<PasswordCrackerTabProps> = ({ 
  isExecuting, 
  setIsExecuting, 
  toolOutput, 
  setToolOutput,
  executeSelectedTool,
  isRealmode
}) => {
  const [selectedHashType, setSelectedHashType] = useState('md5');
  const [customHash, setCustomHash] = useState('');
  const [selectedWordlist, setSelectedWordlist] = useState('rockyou');
  const [customRules, setCustomRules] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const [selectedCharset, setSelectedCharset] = useState('alphanum');
  const [customTemplate, setCustomTemplate] = useState('');
  const [customLength, setCustomLength] = useState('8');
  
  const hashTypes = {
    'md5': 'MD5',
    'sha1': 'SHA1',
    'sha256': 'SHA256',
    'ntlm': 'NTLM (Windows)',
    'bcrypt': 'bcrypt',
    'wpa': 'WPA/WPA2'
  };
  
  const wordlists = {
    'rockyou': 'RockYou (14 million)',
    'darkweb2017': 'Dark Web 2017 (10 million)',
    'crackstation': 'CrackStation (1.5 billion)',
    'custom': 'Custom Wordlist'
  };
  
  const charsets = {
    'alpha': 'Alphabetic (a-zA-Z)',
    'alphanum': 'Alphanumeric (a-zA-Z0-9)',
    'full': 'Full (a-zA-Z0-9!@#$%^&*)',
    'numeric': 'Numeric (0-9)',
    'custom': 'Custom Charset'
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
  
  const handleHashCrack = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      // Execute hash cracking tool
      const result = await executeHackingTool({
        tool: 'hashcat',
        options: {
          hashType: selectedHashType,
          hashValue: customHash,
          wordlist: selectedWordlist,
          rules: customRules,
          mode: 'crack'
        }
      });
      
      toast({
        title: "Hash Cracking Started",
        description: `Attempting to crack ${selectedHashType} hash`,
      });
      
      if (result?.data) {
        // Format and display the tool output
        const formattedOutput = typeof result.data === 'string' ? 
          result.data : 
          JSON.stringify(result.data, null, 2);
        
        setToolOutput(formattedOutput);
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
  
  const handleDictGenerate = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      // Execute wordlist generator tool
      const result = await executeHackingTool({
        tool: 'wordlist-generator',
        options: {
          template: customTemplate,
          length: customLength,
          charset: selectedCharset,
          mode: 'generate'
        }
      });
      
      toast({
        title: "Wordlist Generator Started",
        description: `Generating wordlist with template: ${customTemplate || 'default'}`,
      });
      
      if (result?.data) {
        // Format and display the tool output
        const formattedOutput = typeof result.data === 'string' ? 
          result.data : 
          JSON.stringify(result.data, null, 2);
        
        setToolOutput(formattedOutput);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="hash-type">Hash Type</Label>
            <Select 
              value={selectedHashType} 
              onValueChange={setSelectedHashType}
            >
              <SelectTrigger id="hash-type" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a hash type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(hashTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="hash-value">Hash Value</Label>
            <Textarea 
              id="hash-value" 
              placeholder="Enter hash to crack" 
              value={customHash} 
              onChange={(e) => setCustomHash(e.target.value)}
              className="min-h-24 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div>
            <Label htmlFor="wordlist">Wordlist</Label>
            <Select 
              value={selectedWordlist} 
              onValueChange={setSelectedWordlist}
            >
              <SelectTrigger id="wordlist" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a wordlist" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(wordlists).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="rules">Custom Rules (Optional)</Label>
            <Input
              id="rules"
              placeholder="e.g., -r best64.rule"
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <Button
            onClick={handleHashCrack}
            disabled={isExecuting || !customHash}
            variant="default"
            className="bg-scanner-primary"
          >
            <Key className="h-4 w-4 mr-2" />
            {isExecuting ? "Cracking..." : "Crack Hash"}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="charset">Character Set</Label>
            <Select 
              value={selectedCharset} 
              onValueChange={setSelectedCharset}
            >
              <SelectTrigger id="charset" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a character set" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(charsets).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="template">Template (Optional)</Label>
            <Input
              id="template"
              placeholder="e.g., password?d?d?d"
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
            <p className="text-gray-400 text-xs mt-1">
              Use ?l for lowercase, ?u for uppercase, ?d for digits, ?s for special
            </p>
          </div>
          
          <div>
            <Label htmlFor="length">Length</Label>
            <Input
              id="length"
              type="number"
              min="1"
              max="16"
              placeholder="8"
              value={customLength}
              onChange={(e) => setCustomLength(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <Button
            onClick={handleDictGenerate}
            disabled={isExecuting}
            variant="default"
            className="bg-scanner-primary mt-6"
          >
            <Unlock className="h-4 w-4 mr-2" />
            {isExecuting ? "Generating..." : "Generate Wordlist"}
          </Button>
        </div>
      </div>
      
      {toolOutput && (
        <div className="mt-4">
          <Label>Tool Output</Label>
          <div className="relative mt-1.5">
            <Textarea 
              readOnly 
              value={toolOutput}
              className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(toolOutput, 'tool output')}
            >
              {copySuccess === 'tool output' ? (
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

export default PasswordCrackerTab;


import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check, Lock, FileText, Play } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';

interface PasswordCrackerTabProps {
  isRealmode: boolean;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
}

const PasswordCrackerTab: React.FC<PasswordCrackerTabProps> = ({ 
  isRealmode, 
  isExecuting, 
  setIsExecuting, 
  setToolOutput 
}) => {
  const [hashType, setHashType] = useState('md5');
  const [hashValue, setHashValue] = useState('');
  const [wordlistType, setWordlistType] = useState('common');
  const [wordlistSize, setWordlistSize] = useState('medium');
  const [customWords, setCustomWords] = useState('');
  const [mode, setMode] = useState('crack'); // 'crack' or 'generate'
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const hashTypes = {
    'md5': 'MD5',
    'sha1': 'SHA1',
    'sha256': 'SHA256',
    'ntlm': 'NTLM',
    'bcrypt': 'BCrypt'
  };
  
  const wordlistTypes = {
    'common': 'Common Passwords',
    'names': 'Names',
    'digits': 'Digits & Special Characters',
    'mixed': 'Mixed Alphanumeric',
    'custom': 'Custom Pattern'
  };
  
  const wordlistSizes = {
    'small': 'Small (~1,000 words)',
    'medium': 'Medium (~10,000 words)',
    'large': 'Large (~100,000 words)'
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
  
  const executeHashCracker = async () => {
    if (!hashValue) {
      toast({
        title: "Missing Input",
        description: "Please enter a hash value to crack",
        variant: "destructive"
      });
      return;
    }
    
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      if (!isRealmode) {
        // Simulate hash cracking in demo mode
        setTimeout(() => {
          let simulatedResult;
          
          // Simple simulation logic based on hash type
          if (hashType === 'md5' && hashValue.toLowerCase() === '5f4dcc3b5aa765d61d8327deb882cf99') {
            simulatedResult = "Found password: 'password'";
          } else if (hashType === 'sha1' && hashValue.toLowerCase() === '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8') {
            simulatedResult = "Found password: 'password'";
          } else if (hashValue.length < 8) {
            simulatedResult = "Error: Invalid hash length for " + hashTypes[hashType as keyof typeof hashTypes];
          } else {
            simulatedResult = "No password found. Try a different wordlist or hash type.";
          }
          
          setToolOutput(simulatedResult);
          setIsExecuting(false);
          
          toast({
            title: "Simulation Mode",
            description: "Hash cracking simulated (demo only)",
          });
        }, 1500);
        return;
      }
      
      // Real mode execution
      const result = await executeHackingTool({
        tool: 'hashcat',
        category: 'cracking',
        options: {
          hash: hashValue,
          hashType: hashType,
          wordlist: wordlistType,
          wordlistSize: wordlistSize
        }
      });
      
      toast({
        title: "Hash Cracker Executed",
        description: `Attempted to crack ${hashTypes[hashType as keyof typeof hashTypes]} hash`,
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
  
  const generateWordlist = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      if (!isRealmode) {
        // Simulate wordlist generation in demo mode
        setTimeout(() => {
          const wordCount = wordlistSize === 'small' ? 1000 : wordlistSize === 'medium' ? 10000 : 100000;
          
          const simulatedResult = 
            `Generated ${wordlistType} wordlist with ${wordCount} entries.\n` +
            `Sample entries:\n` +
            `${wordlistType === 'common' ? 'password123\nadmin123\nqwerty\n123456' : 
              wordlistType === 'names' ? 'john\nsmith\njane\ndoe' : 
              wordlistType === 'digits' ? '1234\n9876\n!@#$\n1111' : 
              'a1b2c3\npassword123\nP@ssw0rd\nAdmin!'}\n` +
            `... (${wordCount - 4} more entries)`;
          
          setToolOutput(simulatedResult);
          setIsExecuting(false);
          
          toast({
            title: "Simulation Mode",
            description: "Wordlist generation simulated (demo only)",
          });
        }, 1500);
        return;
      }
      
      // Real mode execution
      const result = await executeHackingTool({
        tool: 'wordlist-generator',
        category: 'cracking',
        options: {
          type: wordlistType,
          size: wordlistSize,
          customPattern: customWords
        }
      });
      
      toast({
        title: "Wordlist Generator Executed",
        description: `Generated ${wordlistTypes[wordlistType as keyof typeof wordlistTypes]} wordlist`,
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
      <div className="flex space-x-2 mb-4">
        <Button
          variant={mode === 'crack' ? 'default' : 'outline'}
          className={mode === 'crack' ? 'bg-scanner-primary' : 'border-gray-700 hover:bg-scanner-dark-alt'}
          onClick={() => setMode('crack')}
        >
          <Lock className="h-4 w-4 mr-2" />
          Hash Cracker
        </Button>
        <Button
          variant={mode === 'generate' ? 'default' : 'outline'}
          className={mode === 'generate' ? 'bg-scanner-primary' : 'border-gray-700 hover:bg-scanner-dark-alt'}
          onClick={() => setMode('generate')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Wordlist Generator
        </Button>
      </div>
      
      {mode === 'crack' ? (
        <>
          <div>
            <Label htmlFor="hash-type">Hash Type</Label>
            <Select 
              value={hashType} 
              onValueChange={setHashType}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
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
            <Input 
              id="hash-value" 
              value={hashValue} 
              onChange={(e) => setHashValue(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700 font-mono"
              placeholder="Enter hash to crack (e.g., 5f4dcc3b5aa765d61d8327deb882cf99)"
            />
          </div>
          
          <div>
            <Label htmlFor="wordlist-type">Wordlist Type</Label>
            <Select 
              value={wordlistType} 
              onValueChange={setWordlistType}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a wordlist type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(wordlistTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="wordlist-size">Wordlist Size</Label>
            <Select 
              value={wordlistSize} 
              onValueChange={setWordlistSize}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a wordlist size" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(wordlistSizes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={executeHashCracker}
            disabled={isExecuting || !hashValue}
            variant="default"
            className="bg-scanner-primary"
          >
            <Play className="h-4 w-4 mr-2" />
            {isExecuting ? "Cracking..." : "Crack Hash"}
          </Button>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="wordlist-type">Wordlist Type</Label>
            <Select 
              value={wordlistType} 
              onValueChange={setWordlistType}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a wordlist type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(wordlistTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="wordlist-size">Wordlist Size</Label>
            <Select 
              value={wordlistSize} 
              onValueChange={setWordlistSize}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a wordlist size" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                {Object.entries(wordlistSizes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {wordlistType === 'custom' && (
            <div>
              <Label htmlFor="custom-pattern">Custom Pattern (one per line)</Label>
              <Textarea 
                id="custom-pattern" 
                value={customWords} 
                onChange={(e) => setCustomWords(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700 font-mono min-h-24"
                placeholder="Enter custom patterns (e.g., pass{0-9}{0-9}{0-9})"
              />
            </div>
          )}
          
          <Button
            onClick={generateWordlist}
            disabled={isExecuting || (wordlistType === 'custom' && !customWords)}
            variant="default"
            className="bg-scanner-primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isExecuting ? "Generating..." : "Generate Wordlist"}
          </Button>
        </>
      )}
    </div>
  );
};

export default PasswordCrackerTab;

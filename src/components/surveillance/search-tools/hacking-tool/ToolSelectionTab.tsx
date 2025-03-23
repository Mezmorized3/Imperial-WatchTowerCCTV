
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Target, Terminal } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { FormatSelector } from './FormatSelector';
import { ToolCategorySelector } from './ToolCategorySelector';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const toolOptions: Record<string, string[]> = {
    'Information Gathering': ['Nmap', 'Dracnmap', 'Port Scanner', 'Host To IP', 'Xerosploit', 'RED HAWK', 'Striker', 'Recondog', 'DNSMAP'],
    'Vulnerability Scanner': ['SQLiv', 'SQLmap', 'sqlscan', 'wordpresscan', 'WPScan', 'routersploit', 'Nikto', 'Nessus', 'OpenVAS'],
    'Exploitation Tools': ['Metasploit', 'RouterSploit', 'BeEF', 'setoolkit', 'fuxploider', 'slowloris', 'TheFatRat', 'Empire', 'Veil'],
    'Wireless Testing': ['aircrack-ng', 'wifite', 'Fluxion', 'WiFi-Pumpkin', 'Airgeddon', 'Reaver', 'wifiphisher', 'Wifijammer', 'Kismet'],
    'Forensics Tools': ['Autopsy', 'Bulk Extractor', 'Volatility', 'Binwalk', 'Foremost', 'Wireshark', 'exiftool', 'Tcpdump', 'Sleuth Kit'],
    'Web Hacking': ['Burp Suite', 'OWASP ZAP', 'dirb', 'Gobuster', 'wfuzz', 'XSStrike', 'Commix', 'Knockpy', 'SQLiPy'],
    'Stress Testing': ['LOIC', 'SlowLoris', 'T50', 'Siege', 'GoldenEye', 'Xerxes', 'Hammering', 'Hulk', 'Torshammer'],
    'Password Hacking': ['John the Ripper', 'Hashcat', 'Hydra', 'Crunch', 'Medusa', 'Ncrack', 'Cupp', 'Hashid', 'Ophcrack'],
    'IP Tracking': ['IP-Tracer', 'IP-Locator', 'TraceIP', 'TraceRoute', 'GeoIP', 'Whois', 'IP-Tracker', 'IP-API', 'ipinfo'],
    'Programming Languages': ['Python', 'Perl', 'Ruby', 'Go', 'JavaScript', 'Bash', 'Powershell', 'C/C++', 'Java'],
    'Payload Creation': ['MSFvenom', 'TheFatRat', 'Veil-Evasion', 'Shellter', 'Unicorn', 'Pupy', 'Koadic', 'Phantom-Evasion']
  };

  const handleExecuteTool = async () => {
    if (!toolCategory) {
      toast({
        title: "Category Required",
        description: "Please select a tool category",
        variant: "destructive",
      });
      return;
    }

    try {
      const params: HackingToolParams = {
        category: toolCategory,
        toolCategory,
        tool,
        target: target || "localhost",
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
      toast({
        title: "Execution Error",
        description: errorMessage,
        variant: "destructive",
      });
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
          <Label htmlFor="tool" className="text-white font-semibold">Specific Tool (Optional)</Label>
          <Select value={tool} onValueChange={setTool}>
            <SelectTrigger id="tool" className="w-full bg-scanner-dark border-gray-700 text-white">
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
        <Label htmlFor="target" className="text-white font-semibold">Target (IP, Domain, or File)</Label>
        <div className="flex space-x-2">
          <Input
            id="target"
            placeholder="Enter target IP, domain, or file path"
            className="bg-scanner-dark border-gray-700 text-white flex-grow placeholder:text-gray-500"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <Button 
            variant="outline" 
            className="bg-scanner-dark border-gray-700 text-white hover:bg-scanner-dark-alt"
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
        className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black font-medium"
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

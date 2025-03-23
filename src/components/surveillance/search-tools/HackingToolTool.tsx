
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Cpu, Target, AlertTriangle, Terminal, Folder } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintTools';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const HackingToolTool: React.FC = () => {
  const [toolCategory, setToolCategory] = useState<string>('Information Gathering');
  const [tool, setTool] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('tools');
  const [customCommand, setCustomCommand] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const { toast } = useToast();

  const toolCategories = [
    'Information Gathering',
    'Vulnerability Scanner',
    'Exploitation Tools',
    'Wireless Testing',
    'Forensics Tools',
    'Web Hacking',
    'Stress Testing',
    'Password Hacking',
    'IP Tracking',
    'Programming Languages'
  ];

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

  const formatOptions = ['json', 'text', 'xml', 'csv', 'yaml'];

  const handleExecuteTool = async () => {
    try {
      setIsExecuting(true);
      setResults(null);
      
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
      
      const result = await executeHackingTool(params);
      
      if (result.success) {
        toast({
          title: "Tool Executed",
          description: `${tool || toolCategory} executed successfully`,
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Execution Failed",
          description: result.error || "An error occurred during tool execution",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

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
      setIsExecuting(true);
      setResults(null);
      
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
      
      const result = await executeHackingTool(params);
      
      if (result.success) {
        toast({
          title: "Command Executed",
          description: "Custom command executed successfully",
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Execution Failed",
          description: result.error || "An error occurred during command execution",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing custom command:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Cpu className="mr-2 h-5 w-5" />
          Hacking Tool Framework
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tools">
              <Folder className="h-4 w-4 mr-2" />
              Tool Selection
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Terminal className="h-4 w-4 mr-2" />
              Custom Command
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toolCategory">Tool Category</Label>
                <Select 
                  value={toolCategory} 
                  onValueChange={(value: string) => {
                    setToolCategory(value);
                    // Reset tool selection when category changes
                    setTool('');
                  }}
                >
                  <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark text-white border-gray-700">
                    {toolCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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

            <div className="space-y-2">
              <Label htmlFor="outputFormat">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark text-white border-gray-700">
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customCommand">Custom Command</Label>
              <Input
                id="customCommand"
                placeholder="Enter custom command (e.g., nmap -sV 192.168.1.1)"
                className="bg-scanner-dark border-gray-700"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target (Optional, if not in command)</Label>
              <Input
                id="target"
                placeholder="Enter target IP, domain, or file path"
                className="bg-scanner-dark border-gray-700"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputFormat">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark text-white border-gray-700">
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleExecuteCustom}
              disabled={isExecuting || !customCommand}
              className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Terminal className="h-4 w-4 mr-2" />
              )}
              Execute Command
            </Button>
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-4">
            <Label>Execution Results</Label>
            <div className="bg-black rounded p-2 mt-1 overflow-auto max-h-60 text-xs font-mono">
              <pre>{results}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400 flex items-start">
          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <span>
            WARNING: This tool framework provides access to security testing utilities. 
            Use only on systems you own or have explicit permission to test. 
            Unauthorized access to computer systems is illegal.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HackingToolTool;

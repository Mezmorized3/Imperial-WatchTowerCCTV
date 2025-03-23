
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, AlertTriangle } from 'lucide-react';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';
import { ToolSelectionTab } from './hacking-tool/ToolSelectionTab';
import { CustomCommandTab } from './hacking-tool/CustomCommandTab';
import { ExecutionResults } from './hacking-tool/ExecutionResults';
import { HackingTabs } from './hacking-tool/HackingTabs';

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

  const handleToolExecution = (params: HackingToolParams, successMessage: string) => {
    setIsExecuting(true);
    setResults(null);
    
    return {
      onSuccess: (data: any) => {
        toast({
          title: "Tool Executed",
          description: successMessage,
        });
        setResults(JSON.stringify(data, null, 2));
        setIsExecuting(false);
      },
      onError: (error: string) => {
        toast({
          title: "Execution Failed",
          description: error || "An error occurred during execution",
          variant: "destructive",
        });
        setIsExecuting(false);
      }
    };
  };

  return (
    <Card className="border-gray-700">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Cpu className="mr-2 h-5 w-5" />
          Hacking Tool Framework
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <HackingTabs 
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          toolsTabContent={
            <ToolSelectionTab
              toolCategory={toolCategory}
              setToolCategory={setToolCategory}
              tool={tool}
              setTool={setTool}
              target={target}
              setTarget={setTarget}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              isExecuting={isExecuting}
              handleToolExecution={handleToolExecution}
            />
          }
          customTabContent={
            <CustomCommandTab
              customCommand={customCommand}
              setCustomCommand={setCustomCommand}
              target={target}
              setTarget={setTarget}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              isExecuting={isExecuting}
              handleToolExecution={handleToolExecution}
            />
          }
        />
        
        {results && <ExecutionResults results={results} />}
        
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

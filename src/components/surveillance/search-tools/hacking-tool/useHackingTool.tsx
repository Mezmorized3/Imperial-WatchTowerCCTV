
import { useState } from 'react';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

export const useHackingTool = () => {
  const [toolCategory, setToolCategory] = useState<string>('Information Gathering');
  const [tool, setTool] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('tools');
  const [customCommand, setCustomCommand] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const { toast } = useToast();

  const handleToolExecution = (params: HackingToolParams, successMessage: string) => {
    setIsExecuting(true);
    setResults('');
    
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

  return {
    toolCategory,
    setToolCategory,
    tool,
    setTool,
    target,
    setTarget,
    isExecuting,
    results,
    selectedTab,
    setSelectedTab,
    customCommand,
    setCustomCommand,
    outputFormat,
    setOutputFormat,
    handleToolExecution
  };
};

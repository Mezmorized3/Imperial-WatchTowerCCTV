
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { HackingTabs } from './HackingTabs';
import { ToolSelectionTab } from './ToolSelectionTab';
import { CustomCommandTab } from './CustomCommandTab';
import { ExecutionResults } from './ExecutionResults';
import { WarningMessage } from './WarningMessage';
import { HackingToolParams } from '@/utils/osintToolTypes';

interface HackingToolContentProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  toolCategory: string;
  setToolCategory: (category: string) => void;
  tool: string;
  setTool: (tool: string) => void;
  target: string;
  setTarget: (target: string) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  customCommand: string;
  setCustomCommand: (command: string) => void;
  isExecuting: boolean;
  results: string;
  handleToolExecution: (params: HackingToolParams, successMessage: string) => {
    onSuccess: (data: any) => void;
    onError: (error: string) => void;
  };
}

export const HackingToolContent: React.FC<HackingToolContentProps> = ({
  selectedTab,
  setSelectedTab,
  toolCategory,
  setToolCategory,
  tool,
  setTool,
  target,
  setTarget,
  outputFormat,
  setOutputFormat,
  customCommand,
  setCustomCommand,
  isExecuting,
  results,
  handleToolExecution
}) => {
  return (
    <CardContent className="space-y-4 bg-scanner-dark p-4">
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
      
      <WarningMessage />
    </CardContent>
  );
};

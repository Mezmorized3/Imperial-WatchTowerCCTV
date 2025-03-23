
import React from 'react';
import { Card } from '@/components/ui/card';
import { useHackingTool } from './hacking-tool/useHackingTool';
import { HackingToolHeader } from './hacking-tool/HackingToolHeader';
import { HackingToolContent } from './hacking-tool/HackingToolContent';

const HackingToolTool: React.FC = () => {
  const {
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
  } = useHackingTool();

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <HackingToolHeader />
      <HackingToolContent
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        toolCategory={toolCategory}
        setToolCategory={setToolCategory}
        tool={tool}
        setTool={setTool}
        target={target}
        setTarget={setTarget}
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        customCommand={customCommand}
        setCustomCommand={setCustomCommand}
        isExecuting={isExecuting}
        results={results}
        handleToolExecution={handleToolExecution}
      />
    </Card>
  );
};

export default HackingToolTool;

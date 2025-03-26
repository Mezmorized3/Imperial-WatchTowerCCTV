
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ToolOutputProps {
  toolOutput: string;
}

const ToolOutput: React.FC<ToolOutputProps> = ({ toolOutput }) => {
  return (
    <Card className="bg-scanner-card border-gray-700 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Tool Output</CardTitle>
        <CardDescription className="text-gray-400">Results and feedback from the tools</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <pre className="bg-gray-800 text-white font-mono text-sm p-4 rounded whitespace-pre-wrap">
            {toolOutput || "Tool output will appear here"}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ToolOutput;

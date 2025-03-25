
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ToolOutputProps {
  toolOutput: string;
}

const ToolOutput: React.FC<ToolOutputProps> = ({ toolOutput }) => {
  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Tool Output</CardTitle>
        <CardDescription className="text-gray-400">Results and feedback from the tools</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          readOnly
          className="bg-gray-800 text-white font-mono text-sm"
          value={toolOutput}
          placeholder="Tool output will appear here"
        />
      </CardContent>
    </Card>
  );
};

export default ToolOutput;

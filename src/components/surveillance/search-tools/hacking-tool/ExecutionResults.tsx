
import React from 'react';
import { Label } from '@/components/ui/label';

interface ExecutionResultsProps {
  results: string;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({ results }) => {
  if (!results) return null;
  
  return (
    <div className="mt-4">
      <Label className="text-white">Execution Results</Label>
      <div className="bg-black rounded p-2 mt-1 overflow-auto max-h-60 text-xs font-mono text-green-400">
        <pre className="whitespace-pre-wrap">{results}</pre>
      </div>
    </div>
  );
};

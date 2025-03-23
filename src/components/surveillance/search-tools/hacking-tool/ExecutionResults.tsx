
import React from 'react';
import { Label } from '@/components/ui/label';

interface ExecutionResultsProps {
  results: string;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({ results }) => {
  if (!results) return null;
  
  return (
    <div className="mt-4">
      <Label className="text-white font-semibold">Execution Results</Label>
      <div className="bg-black/90 rounded-md p-3 mt-2 overflow-auto max-h-80 text-sm font-mono text-green-400 border border-gray-700 shadow-inner">
        <pre className="whitespace-pre-wrap">{results}</pre>
      </div>
    </div>
  );
};

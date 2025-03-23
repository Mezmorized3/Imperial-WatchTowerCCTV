
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';

interface ExecutionResultsProps {
  results: string;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({ results }) => {
  const [copied, setCopied] = useState(false);
  
  if (!results) return null;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="mt-4 rounded-md border border-gray-700 p-4 bg-black/50">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-white font-semibold">Execution Results</Label>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 text-xs bg-scanner-dark-alt hover:bg-scanner-dark text-white border-gray-700"
          onClick={handleCopy}
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="bg-black/90 rounded-md p-3 overflow-auto max-h-80 text-sm font-mono text-green-400 border border-gray-800 shadow-inner">
        <pre className="whitespace-pre-wrap">{results}</pre>
      </div>
    </div>
  );
};

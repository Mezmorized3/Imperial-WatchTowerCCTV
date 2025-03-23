
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const WarningMessage: React.FC = () => {
  return (
    <div className="space-y-3">
      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-xs text-yellow-200">
          WARNING: This tool framework provides access to security testing utilities. 
          Use only on systems you own or have explicit permission to test. 
          Unauthorized access to computer systems is illegal.
        </AlertDescription>
      </Alert>
      
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-xs text-blue-200">
          Tools are executed using a simulated environment. For real execution, connect to a local server with installed security tools.
        </AlertDescription>
      </Alert>
    </div>
  );
};

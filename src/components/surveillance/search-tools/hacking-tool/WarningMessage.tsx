
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const WarningMessage: React.FC = () => {
  return (
    <div className="mt-2 text-xs text-gray-400 flex items-start">
      <AlertTriangle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0 text-yellow-500" />
      <span>
        WARNING: This tool framework provides access to security testing utilities. 
        Use only on systems you own or have explicit permission to test. 
        Unauthorized access to computer systems is illegal.
      </span>
    </div>
  );
};

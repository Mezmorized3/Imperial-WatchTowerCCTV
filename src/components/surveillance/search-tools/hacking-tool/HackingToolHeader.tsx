
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, ShieldAlert } from 'lucide-react';

export const HackingToolHeader: React.FC = () => {
  return (
    <CardHeader className="bg-scanner-dark border-b border-gray-700 pb-3">
      <CardTitle className="text-scanner-primary flex items-center">
        <Cpu className="mr-2 h-5 w-5" />
        Hacking Tool Framework
      </CardTitle>
      <CardDescription className="text-gray-400 flex items-center mt-1">
        <ShieldAlert className="mr-2 h-3.5 w-3.5 text-scanner-warning" />
        Security testing and vulnerability assessment tools
      </CardDescription>
    </CardHeader>
  );
};

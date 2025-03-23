
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

export const HackingToolHeader: React.FC = () => {
  return (
    <CardHeader className="bg-scanner-dark border-b border-gray-700">
      <CardTitle className="text-scanner-primary flex items-center">
        <Cpu className="mr-2 h-5 w-5" />
        Hacking Tool Framework
      </CardTitle>
    </CardHeader>
  );
};

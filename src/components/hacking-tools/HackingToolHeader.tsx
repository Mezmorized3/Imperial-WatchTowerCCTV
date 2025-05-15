
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Added Switch import
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface HackingToolHeaderProps {
  isRealmode: boolean;
  onRealmodeToggle: (checked: boolean) => void;
}

const HackingToolHeader: React.FC<HackingToolHeaderProps> = ({ isRealmode, onRealmodeToggle }) => {
  return (
    <header className="bg-scanner-card-alt border-b border-gray-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Offensive Toolkit</h1>
        <div className="flex items-center space-x-3">
          {isRealmode ? (
            <ShieldAlert className="h-6 w-6 text-red-500" />
          ) : (
            <ShieldCheck className="h-6 w-6 text-green-500" />
          )}
          <Label htmlFor="realmode-toggle" className={`font-medium ${isRealmode ? 'text-red-400' : 'text-green-400'}`}>
            {isRealmode ? "Real Mode Active" : "Sandbox Mode"}
          </Label>
          <Switch
            id="realmode-toggle"
            checked={isRealmode}
            onCheckedChange={onRealmodeToggle}
            className="data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-green-600"
          />
        </div>
      </div>
    </header>
  );
};

export default HackingToolHeader;

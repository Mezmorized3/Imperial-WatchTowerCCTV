
import React from 'react';
import { Settings as SettingsIcon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SettingsHeaderProps {
  imperialProtocolBanner: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ imperialProtocolBanner }) => {
  return (
    <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
            <pre className="text-[#ea384c] text-xs font-mono">{imperialProtocolBanner}</pre>
          </div>
        </div>
      </div>
    </header>
  );
};

export const SettingsTitle: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <SettingsIcon className="h-8 w-8 mr-3 text-scanner-primary" />
        <h1 className="text-3xl font-bold">Imperial Protocol</h1>
      </div>
      <Link to="/">
        <Button variant="outline" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

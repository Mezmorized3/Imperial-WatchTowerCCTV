
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface HackingToolHeaderProps {
  isRealmode: boolean;
  onRealmodeToggle: (checked: boolean) => void;
}

const HackingToolHeader: React.FC<HackingToolHeaderProps> = ({ isRealmode, onRealmodeToggle }) => {
  const imperialProtocolBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗         ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ 
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ███████║███████║██║     █████╔╝ █████╗  ██████╔╝
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
  `;

  return (
    <>
      <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Hacking Tools</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="realmode-toggle" className="text-sm text-gray-400">
                Realmode
              </Label>
              <Switch
                id="realmode-toggle"
                checked={isRealmode}
                onCheckedChange={onRealmodeToggle}
              />
            </div>
          </div>
        </div>
      </header>
      
      <div className="mx-auto mt-2 mb-4">
        <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
          <pre className="text-[#ea384c] text-xs font-mono">{imperialProtocolBanner}</pre>
        </div>
      </div>
    </>
  );
};

export default HackingToolHeader;

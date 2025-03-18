
import React, { useState } from 'react';
import { Shield, Settings, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle 
} from '@/components/ui/drawer';

interface DashboardHeaderProps {
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  console.log('DashboardHeader rendering, current path:', location.pathname);
  
  const handleSettingsClick = () => {
    console.log('Settings button clicked');
    setIsSettingsOpen(true);
  };
  
  const handleHelpClick = () => {
    console.log('Help button clicked');
    setIsHelpOpen(true);
  };
  
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-scanner-dark border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-scanner-primary" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Watchtower</h1>
            <p className="text-xs text-gray-400">CCTV Scanner & Control Panel</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={handleSettingsClick}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={handleHelpClick}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Settings Drawer */}
      <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DrawerContent className="bg-scanner-dark text-white border-t border-gray-800">
          <DrawerHeader>
            <DrawerTitle className="text-scanner-primary flex items-center justify-between">
              <span>Settings</span>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription className="text-gray-400">
              Customize the application to your preferences.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Theme</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">Light</Button>
                <Button variant="outline" size="sm" className="flex-1 bg-gray-800">Dark</Button>
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Scan Settings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Default to Aggressive Scan</span>
                  <Button variant="outline" size="sm">Off</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auto-Save Results</span>
                  <Button variant="outline" size="sm">On</Button>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">API Keys</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-400 block">Shodan API Key</label>
                  <div className="flex mt-1">
                    <input type="password" value="••••••••••••••••" className="bg-gray-900 border border-gray-800 rounded-l px-3 py-1 flex-1 text-sm" readOnly />
                    <Button variant="outline" size="sm" className="rounded-l-none">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="default" className="w-full">Save Changes</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Help Drawer */}
      <Drawer open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DrawerContent className="bg-scanner-dark text-white border-t border-gray-800">
          <DrawerHeader>
            <DrawerTitle className="text-scanner-primary flex items-center justify-between">
              <span>Help & Documentation</span>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription className="text-gray-400">
              Learn how to use Watchtower effectively.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4 overflow-auto max-h-[60vh]">
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Getting Started</h3>
              <p className="text-sm text-gray-400 mb-2">
                Watchtower is a CCTV scanning and monitoring tool designed to help you discover, analyze, and secure networked cameras.
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
                <li>Enter an IP address, range, or search query in the scan form</li>
                <li>Select scan settings and click "Start Scan"</li>
                <li>View results in real-time on the interactive globe or map</li>
                <li>Click on discovered cameras to view more details</li>
              </ol>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Scan Types</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium">IP Address</h4>
                  <p className="text-sm text-gray-400">Scan a single IP address (e.g., 192.168.1.1)</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">IP Range</h4>
                  <p className="text-sm text-gray-400">Scan a range of IPs using CIDR notation (e.g., 192.168.1.0/24)</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Shodan Query</h4>
                  <p className="text-sm text-gray-400">Use Shodan syntax to find specific cameras (e.g., "port:554 has_screenshot:true")</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Start Scan</div>
                <div>Ctrl + Enter</div>
                <div className="text-gray-400">Stop Scan</div>
                <div>Esc</div>
                <div className="text-gray-400">Switch to Globe View</div>
                <div>Alt + 1</div>
                <div className="text-gray-400">Switch to Map View</div>
                <div>Alt + 2</div>
                <div className="text-gray-400">Switch to Table View</div>
                <div>Alt + 3</div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="outline" className="w-full">View Full Documentation</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DashboardHeader;

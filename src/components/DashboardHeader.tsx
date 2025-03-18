
import React from 'react';
import { Shield, Eye, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onSettingsClick,
  onHelpClick
}) => {
  const navigate = useNavigate();
  
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/settings');
    }
  };
  
  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick();
    } else {
      navigate('/help');
    }
  };
  
  return (
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
  );
};

export default DashboardHeader;


import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ViewerHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back to Scanner
          </Button>
          
          <div className="w-full">
            <pre className="text-xs md:text-sm text-red-500 font-mono">
{`
██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗         ██████╗ ██████╗ ██╗   ██╗██████╗ ████████╗
██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║        ██╔════╝██╔═══██╗██║   ██║██╔══██╗╚══██╔══╝
██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║        ██║     ██║   ██║██║   ██║██████╔╝   ██║   
██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║        ██║     ██║   ██║██║   ██║██╔══██╗   ██║   
██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ╚██████╗╚██████╔╝╚██████╔╝██║  ██║   ██║   
╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
`}
            </pre>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white flex items-center"
          >
            <Globe className="h-4 w-4 mr-1" />
            Scanner
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/imperial')}
            className="text-gray-400 hover:text-white flex items-center"
          >
            <Shield className="h-4 w-4 mr-1" />
            Imperial
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ViewerHeader;

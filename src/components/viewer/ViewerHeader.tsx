
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewerHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back to Scanner
          </Button>
          <h1 className="text-xl font-bold">Camera Viewer</h1>
        </div>
      </div>
    </header>
  );
};

export default ViewerHeader;

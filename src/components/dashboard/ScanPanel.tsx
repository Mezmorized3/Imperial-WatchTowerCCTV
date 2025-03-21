
import React from 'react';
import ScanForm from '@/components/ScanForm';
import StatusBar from '@/components/StatusBar';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { ScanProgress, ScanTarget, ScanSettings } from '@/types/scanner';
import { useNavigate } from 'react-router-dom';

interface ScanPanelProps {
  onStartScan: (target: ScanTarget, settings: ScanSettings) => void;
  isScanning: boolean;
  scanProgress: ScanProgress;
}

const ScanPanel: React.FC<ScanPanelProps> = ({ 
  onStartScan, 
  isScanning, 
  scanProgress 
}) => {
  const navigate = useNavigate();

  const navigateToGlobe = () => {
    navigate('/globe');
  };

  return (
    <>
      <ScanForm 
        onStartScan={onStartScan}
        isScanning={isScanning}
      />
      
      <div className="mt-6">
        <StatusBar progress={scanProgress} />
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={navigateToGlobe}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <Globe className="mr-2 h-4 w-4" />
          Open Full Globe View
        </Button>
      </div>
    </>
  );
};

export default ScanPanel;

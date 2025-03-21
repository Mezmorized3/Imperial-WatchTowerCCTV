
import React from 'react';
import ScanForm from '@/components/ScanForm';
import StatusBar from '@/components/StatusBar';
import { ScanProgress, ScanTarget, ScanSettings } from '@/types/scanner';

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
  return (
    <>
      <ScanForm 
        onStartScan={onStartScan}
        isScanning={isScanning}
      />
      
      <div className="mt-6">
        <StatusBar progress={scanProgress} />
      </div>
    </>
  );
};

export default ScanPanel;

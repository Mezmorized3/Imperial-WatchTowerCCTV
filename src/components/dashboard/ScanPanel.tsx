
import React from 'react';
import { ScanProgress, ScanTarget, ScanSettings } from '@/types/scanner';
import StatusBar from '@/components/StatusBar';
import ScannerConfiguration from './ScannerConfiguration';

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
    <div className="space-y-4">
      <ScannerConfiguration 
        onStartScan={onStartScan}
        isScanning={isScanning}
      />
      
      <div className="mt-4">
        <StatusBar progress={scanProgress} />
      </div>
    </div>
  );
};

export default ScanPanel;

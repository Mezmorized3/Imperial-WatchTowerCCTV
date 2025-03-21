
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ScanAlertProps {
  scanInProgress: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

const ScanAlert: React.FC<ScanAlertProps> = ({ scanInProgress, currentTarget, targetCountry }) => {
  if (!scanInProgress || !targetCountry) return null;
  
  return (
    <Alert className="mb-4 bg-scanner-dark-alt border-scanner-info">
      <Info className="h-4 w-4 text-scanner-info" />
      <AlertTitle>Scan in Progress</AlertTitle>
      <AlertDescription>
        {currentTarget && `Scanning ${currentTarget}...`}
        {targetCountry && ` Focusing on ${targetCountry}`}
      </AlertDescription>
    </Alert>
  );
};

export default ScanAlert;

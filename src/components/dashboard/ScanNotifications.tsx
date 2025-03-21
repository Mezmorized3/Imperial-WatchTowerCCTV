
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ScanNotificationsProps {
  error: string | null;
}

const ScanNotifications: React.FC<ScanNotificationsProps> = ({ error }) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Scan Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Alert variant="default" className="mb-6 border-scanner-info bg-scanner-dark-alt">
        <Info className="h-4 w-4 text-scanner-info" />
        <AlertTitle>Browser Limitation</AlertTitle>
        <AlertDescription>
          Real network scanning cannot be performed directly in a web browser due to security restrictions.
          This demo uses simulation to demonstrate the UI. In a production environment, scanning would be 
          performed by a backend service or desktop application.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default ScanNotifications;


import React from 'react';
import { Globe } from 'lucide-react';

interface NoDataOverlayProps {
  visible: boolean;
}

const NoDataOverlay: React.FC<NoDataOverlayProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
      <div className="text-center text-gray-300">
        <Globe className="h-12 w-12 mx-auto mb-2 opacity-30" />
        <p>No camera locations to display</p>
        <p className="text-sm text-gray-400 mt-2">Start a scan to visualize results on the globe</p>
      </div>
    </div>
  );
};

export default NoDataOverlay;

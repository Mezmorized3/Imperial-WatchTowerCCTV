
import React, { useState } from 'react';
import { ExternalApiKeys } from './api-keys/ExternalApiKeys';
import { ServerConfig } from './api-keys/ServerConfig';

export const ApiKeySettings: React.FC = () => {
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);

  const handleSave = () => {
    setIsApiKeySaved(true);
    
    // Reset the saved indicator after 3 seconds
    setTimeout(() => {
      setIsApiKeySaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <ExternalApiKeys onSave={handleSave} isApiKeySaved={isApiKeySaved} />
      <ServerConfig />
    </div>
  );
};


import React from 'react';

interface ImperialBannerProps {
  showAscii: boolean;
  toggleAscii: () => void;
}

const ImperialBanner: React.FC<ImperialBannerProps> = ({ showAscii }) => {
  const imperialArmyBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗          █████╗ ██████╗ ███╗   ███╗██╗   ██╗
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔══██╗██╔══██╗████╗ ████║╚██╗ ██╔╝
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ███████║██████╔╝██╔████╔██║ ╚████╔╝ 
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██╔══██║██╔══██╗██║╚██╔╝██║  ╚██╔╝  
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ██║  ██║██║  ██║██║ ╚═╝ ██║   ██║   
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   
  `;

  if (!showAscii) return null;

  return (
    <div className="mx-auto mt-2 mb-4">
      <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
        <pre className="text-[#ea384c] text-xs font-mono">{imperialArmyBanner}</pre>
      </div>
    </div>
  );
};

export default ImperialBanner;

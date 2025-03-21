
import React from 'react';

const Legend: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 bg-black/60 rounded-md p-2 text-xs text-white">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span>Vulnerable</span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
        <span>Online</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Authenticated</span>
      </div>
    </div>
  );
};

export default Legend;

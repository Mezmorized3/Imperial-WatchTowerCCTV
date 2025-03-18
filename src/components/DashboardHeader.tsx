
import React from 'react';
import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardHeader: React.FC = () => {
  const location = useLocation();
  
  console.log('DashboardHeader rendering, current path:', location.pathname);
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-scanner-dark border-b border-gray-800">
      <Link to="/" className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-scanner-primary" />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white">Watchtower</h1>
          <p className="text-xs text-gray-400">CCTV Scanner & Control Panel</p>
        </div>
      </Link>
    </header>
  );
};

export default DashboardHeader;

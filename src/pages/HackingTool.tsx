
import React from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import HackingToolTool from '@/components/surveillance/search-tools/HackingToolTool';
import { Card } from '@/components/ui/card';
import { Cpu, Terminal, Code, AlertTriangle } from 'lucide-react';

const HackingToolPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Cpu className="mr-2 h-6 w-6 text-scanner-primary" />
            Hacking Tool Framework
          </h1>
          <p className="text-gray-400">
            Security testing and vulnerability assessment framework inspired by HackTools
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-scanner-dark-alt border-gray-700 p-4">
            <div className="flex flex-col items-center text-center">
              <Terminal className="h-8 w-8 text-scanner-warning mb-2" />
              <h2 className="text-lg font-semibold mb-1">Command Execution</h2>
              <p className="text-gray-400 text-sm">Run security testing commands with customizable parameters</p>
            </div>
          </Card>
          
          <Card className="bg-scanner-dark-alt border-gray-700 p-4">
            <div className="flex flex-col items-center text-center">
              <Code className="h-8 w-8 text-scanner-warning mb-2" />
              <h2 className="text-lg font-semibold mb-1">Tool Integration</h2>
              <p className="text-gray-400 text-sm">Access to numerous security and penetration testing tools</p>
            </div>
          </Card>
          
          <Card className="bg-scanner-dark-alt border-gray-700 p-4">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-8 w-8 text-scanner-warning mb-2" />
              <h2 className="text-lg font-semibold mb-1">Ethical Use Only</h2>
              <p className="text-gray-400 text-sm">Only use these tools on systems you own or have permission to test</p>
            </div>
          </Card>
          
          <Card className="bg-scanner-dark-alt border-gray-700 p-4">
            <div className="flex flex-col items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-scanner-warning mb-2">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.9 4.9 14.2 14.2" />
                <path d="M12 7v1" />
                <path d="M12 16v1" />
              </svg>
              <h2 className="text-lg font-semibold mb-1">Simulated Mode</h2>
              <p className="text-gray-400 text-sm">Tools run in a safe simulation mode by default</p>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <HackingToolTool />
        </div>
      </main>
    </div>
  );
};

export default HackingToolPage;

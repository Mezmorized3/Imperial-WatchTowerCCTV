
import React from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import HackingToolTool from '@/components/surveillance/search-tools/HackingToolTool';
import { Card } from '@/components/ui/card';

const HackingToolPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Hacking Tool Framework</h1>
          <p className="text-gray-400">
            Security testing and vulnerability assessment framework
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-scanner-dark-alt border-gray-700">
            <HackingToolTool />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HackingToolPage;

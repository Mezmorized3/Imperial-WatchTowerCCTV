
import React from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Terminal } from 'lucide-react';

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
            Security testing and vulnerability assessment framework
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-gray-700 bg-scanner-dark shadow-lg">
            <CardContent className="p-6 text-center space-y-4">
              <Terminal className="h-12 w-12 text-scanner-warning mx-auto" />
              <h2 className="text-xl font-semibold">Coming Soon</h2>
              <p className="text-gray-400">
                We are reimplementing the Hacking Tool Framework. Please check back later.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HackingToolPage;

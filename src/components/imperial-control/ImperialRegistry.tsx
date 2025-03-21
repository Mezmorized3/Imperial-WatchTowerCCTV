
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Activity, BarChart } from 'lucide-react';

interface LegionStatus {
  [port: string]: {
    status: string;
    lastActivation: string | null;
    operationalCapacity: string;
    role: string;
  };
}

interface ImperialRegistryProps {
  legionStatus: LegionStatus | null;
  selectedPort: string | null;
  setSelectedPort: (port: string) => void;
  issueDecree: (command: 'MOBILIZE' | 'STAND_DOWN') => void;
  isLoading: boolean;
}

const ImperialRegistry: React.FC<ImperialRegistryProps> = ({
  legionStatus,
  selectedPort,
  setSelectedPort,
  issueDecree,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2 bg-scanner-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Server className="mr-2 h-4 w-4 text-blue-400" />
              Legion Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {legionStatus ? (
              <div className="space-y-4">
                {Object.entries(legionStatus).map(([port, data]) => (
                  <div 
                    key={port} 
                    className={`p-3 border ${selectedPort === port ? 'border-blue-500' : 'border-gray-700'} 
                               rounded-md cursor-pointer transition-colors`}
                    onClick={() => setSelectedPort(port)}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${data.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Legion {port}</span>
                      </div>
                      <span className="text-gray-400">{data.operationalCapacity}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-400">{data.role}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No legion data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-scanner-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-4 w-4 text-green-400" />
              Imperial Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => issueDecree('MOBILIZE')} 
                disabled={!selectedPort || isLoading} 
                className="w-full mb-2"
              >
                Mobilize Legion
              </Button>
              <Button 
                onClick={() => issueDecree('STAND_DOWN')} 
                disabled={!selectedPort || isLoading} 
                variant="destructive"
                className="w-full"
              >
                Stand Down Legion
              </Button>
              
              <div className="pt-4 text-sm text-gray-400">
                {selectedPort ? (
                  <p>Selected: Legion {selectedPort} - {legionStatus?.[selectedPort]?.role}</p>
                ) : (
                  <p>No legion selected</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-scanner-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart className="mr-2 h-4 w-4 text-yellow-400" />
            Imperial Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
              <div className="text-sm text-gray-400">Active Legions</div>
              <div className="text-2xl mt-1">
                {legionStatus 
                  ? Object.values(legionStatus).filter(l => l.status === 'ACTIVE').length 
                  : 0}
                <span className="text-sm text-gray-500">/{legionStatus ? Object.keys(legionStatus).length : 0}</span>
              </div>
            </div>
            <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
              <div className="text-sm text-gray-400">Imperial Throne</div>
              <div className="text-2xl mt-1">Port 7443</div>
            </div>
            <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
              <div className="text-sm text-gray-400">Security Level</div>
              <div className="text-2xl mt-1 text-yellow-400">Imperial</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialRegistry;

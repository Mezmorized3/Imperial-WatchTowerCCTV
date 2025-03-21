
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, Users } from 'lucide-react';

interface SiegeDevice {
  id: string;
  ip: string;
  port: number;
  protocol: string;
  manufacturer: string;
  model: string;
  accessible: boolean;
  timestamp: string;
}

interface ImperialSiegeProps {
  targetSubnet: string;
  setTargetSubnet: (subnet: string) => void;
  commenceSiege: () => void;
  isLoading: boolean;
  progressValue: number;
  scanResults: SiegeDevice[] | null;
}

const ImperialSiege: React.FC<ImperialSiegeProps> = ({
  targetSubnet,
  setTargetSubnet,
  commenceSiege,
  isLoading,
  progressValue,
  scanResults
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Radar className="mr-2 h-5 w-5 text-blue-400" />
            Commence Imperial Siege
          </CardTitle>
          <CardDescription>
            Discover and capture surveillance devices across a network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-400">Target Subnet</label>
              <Input
                value={targetSubnet}
                onChange={(e) => setTargetSubnet(e.target.value)}
                placeholder="192.168.1.0/24"
                className="bg-scanner-dark border-gray-700 text-white"
              />
            </div>
            
            <Button
              onClick={commenceSiege}
              disabled={isLoading || !targetSubnet.trim()}
              className="w-full"
            >
              <Radar className="mr-2 h-4 w-4" />
              {isLoading ? "Siege in Progress..." : "Commence Siege"}
            </Button>
            
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Siege operations in progress...</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Siege Results */}
      {scanResults && scanResults.length > 0 && (
        <Card className="bg-scanner-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-400" />
              Captured Devices ({scanResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {scanResults.map(device => (
                <div 
                  key={device.id} 
                  className="p-4 bg-scanner-dark-alt border border-gray-700 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">
                      {device.ip}:{device.port}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${device.accessible ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                      {device.accessible ? 'Accessible' : 'Inaccessible'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-gray-400">Protocol:</span> {device.protocol}
                    </div>
                    <div>
                      <span className="text-gray-400">Manufacturer:</span> {device.manufacturer}
                    </div>
                    <div>
                      <span className="text-gray-400">Model:</span> {device.model}
                    </div>
                    <div>
                      <span className="text-gray-400">Captured:</span> {new Date(device.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                    <Button size="sm" variant="outline" className="text-xs">
                      Access Device
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImperialSiege;

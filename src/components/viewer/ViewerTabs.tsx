
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Camera, Map, BarChart, Globe, Shield } from 'lucide-react';
import ViewerOverview from './ViewerOverview';
import CameraMap from '@/components/CameraMap';
import ResultsTable from '@/components/ResultsTable';
import CameraSearchTools from '@/components/surveillance/CameraSearchTools';
import { CameraResult } from '@/types/scanner';

type ViewerTabsProps = {
  activeTab: string;
  setActiveTab: (value: string) => void;
  cameras: CameraResult[];
};

const ViewerTabs: React.FC<ViewerTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  cameras 
}) => {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-scanner-dark-alt w-full justify-start">
        <TabsTrigger value="overview" className="data-[state=active]:bg-scanner-info/20">
          <Camera className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="map" className="data-[state=active]:bg-scanner-info/20">
          <Map className="h-4 w-4 mr-2" />
          Location Map
        </TabsTrigger>
        <TabsTrigger value="table" className="data-[state=active]:bg-scanner-info/20">
          <BarChart className="h-4 w-4 mr-2" />
          Results Table
        </TabsTrigger>
        <TabsTrigger value="osint" className="data-[state=active]:bg-scanner-info/20">
          <Globe className="h-4 w-4 mr-2" />
          OSINT Tools
        </TabsTrigger>
        <TabsTrigger value="security" className="data-[state=active]:bg-scanner-info/20">
          <Shield className="h-4 w-4 mr-2" />
          Security
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <ViewerOverview cameras={cameras} />
      </TabsContent>
      
      <TabsContent value="map">
        {activeTab === 'map' && (
          <CameraMap 
            cameras={cameras} 
            onSelectCamera={(camera) => {
              console.log('Selected camera:', camera);
            }} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="table">
        {activeTab === 'table' && (
          <ResultsTable results={cameras} />
        )}
      </TabsContent>
      
      <TabsContent value="osint">
        {activeTab === 'osint' && (
          <CameraSearchTools />
        )}
      </TabsContent>
      
      <TabsContent value="security">
        {activeTab === 'security' && (
          <div className="p-6 bg-scanner-dark border border-gray-700 rounded-md">
            <h2 className="text-xl font-bold mb-4">Camera Security Assessment</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Vulnerability Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-red-900/30 border border-red-800 rounded-md">
                    <p className="text-sm text-gray-300">Critical Vulnerabilities</p>
                    <p className="text-2xl font-bold">{cameras.filter(c => c.vulnerabilities?.some(v => v.severity === 'critical')).length}</p>
                  </div>
                  <div className="p-3 bg-yellow-900/30 border border-yellow-800 rounded-md">
                    <p className="text-sm text-gray-300">Medium Vulnerabilities</p>
                    <p className="text-2xl font-bold">{cameras.filter(c => c.vulnerabilities?.some(v => v.severity === 'medium')).length}</p>
                  </div>
                  <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                    <p className="text-sm text-gray-300">Cameras with Default Credentials</p>
                    <p className="text-2xl font-bold">{cameras.filter(c => c.credentials !== null).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Common Vulnerabilities Found</h3>
                <ul className="space-y-2">
                  {Array.from(new Set(cameras.flatMap(c => c.vulnerabilities || []).map(v => v.name))).slice(0, 5).map((vulnName, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{vulnName}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Security Recommendations</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Change default credentials on all cameras</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Update camera firmware to latest versions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Implement network segmentation for surveillance systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Enable HTTPS/SSL for web interfaces when available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Disable UPnP and automatic port forwarding</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ViewerTabs;

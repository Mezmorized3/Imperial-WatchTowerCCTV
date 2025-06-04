
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { executeSecurityAdmin } from '@/utils/osintUtilsConnector';
import { Shield, Scan, Lock, AlertTriangle } from 'lucide-react';
import { CameraResult } from '@/types/scanner';
import { toast } from 'sonner';

interface SecurityToolsProps {
  cameras: CameraResult[];
}

const SecurityTools: React.FC<SecurityToolsProps> = ({ cameras }) => {
  const [activeTab, setActiveTab] = useState('vulnerabilities');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  const handleSecurityScan = async (target: string) => {
    setIsScanning(true);
    try {
      const results = await executeSecurityAdmin({
        tool: 'securityAdmin',
        target,
        action: 'check',
        scope: 'system',
        operation: 'scan'
      });
      setScanResults(results);
      toast.success('Security scan completed');
    } catch (error) {
      console.error('Security scan failed:', error);
      toast.error('Security scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAIScan = async (target: string) => {
    setIsScanning(true);
    try {
      const results = await executeSecurityAdmin({
        tool: 'shieldAI',
        targetSystem: target,
        scanType: 'vulnerability' as const,
        analysisDepth: 'deep'
      });
      setScanResults(results);
      toast.success('AI Security analysis completed');
    } catch (error) {
      console.error('AI scan failed:', error);
      toast.error('AI security analysis failed');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 bg-scanner-dark border border-gray-700 rounded-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Camera Security Assessment</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-scanner-dark-alt w-full justify-start mb-4">
            <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-scanner-info/20">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Vulnerabilities
            </TabsTrigger>
            <TabsTrigger value="scan" className="data-[state=active]:bg-scanner-info/20">
              <Scan className="h-4 w-4 mr-2" />
              Security Scan
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-scanner-info/20">
              <Shield className="h-4 w-4 mr-2" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-scanner-info/20">
              <Lock className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vulnerabilities">
            <div className="space-y-4">
              <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Vulnerability Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-red-900/30 border border-red-800 rounded-md">
                    <p className="text-sm text-gray-300">Critical Vulnerabilities</p>
                    <p className="text-2xl font-bold">{cameras.filter(c => c.vulnerabilities?.some(v => v.severity === 'critical')).length || 0}</p>
                  </div>
                  <div className="p-3 bg-yellow-900/30 border border-yellow-800 rounded-md">
                    <p className="text-sm text-gray-300">Medium Vulnerabilities</p>
                    <p className="text-2xl font-bold">{cameras.filter(c => c.vulnerabilities?.some(v => v.severity === 'medium')).length || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                    <p className="text-sm text-gray-300">Cameras with Default Credentials</p>
                    <p className="text-2xl font-bold">{cameras.filter(c => c.credentials !== null && c.credentials !== undefined).length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Common Vulnerabilities Found</h3>
                <ul className="space-y-2">
                  {Array.from(new Set(cameras.flatMap(c => c.vulnerabilities || []).map(v => v.name))).slice(0, 5).map((vulnName, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{vulnName || 'Unknown vulnerability'}</span>
                    </li>
                  ))}
                  {cameras.flatMap(c => c.vulnerabilities || []).length === 0 && (
                    <li className="text-gray-400">No vulnerabilities detected</li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scan">
            <Card className="p-4 bg-scanner-dark-alt border-gray-700">
              <h3 className="text-lg font-medium mb-4">Security Admin Tool</h3>
              <p className="mb-4 text-gray-400">Scan your camera network for security vulnerabilities and configuration issues.</p>
              <div className="flex space-x-4 mb-4">
                <Button 
                  variant="default"
                  onClick={() => handleSecurityScan('network')}
                  disabled={isScanning}
                >
                  {isScanning ? 'Scanning...' : 'Scan Network'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSecurityScan('devices')}
                  disabled={isScanning}
                >
                  Scan Devices
                </Button>
              </div>
              
              {scanResults && (
                <div className="mt-4 p-3 bg-scanner-dark rounded-md border border-gray-700">
                  <h4 className="text-md font-medium mb-2">Scan Results</h4>
                  <pre className="text-xs overflow-auto max-h-60 p-2 bg-black/30 rounded">
                    {JSON.stringify(scanResults, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="ai">
            <Card className="p-4 bg-scanner-dark-alt border-gray-700">
              <h3 className="text-lg font-medium mb-4">AI Security Analysis</h3>
              <p className="mb-4 text-gray-400">Use advanced AI to analyze your camera security posture and identify threats.</p>
              <div className="flex space-x-4 mb-4">
                <Button 
                  variant="default"
                  onClick={() => handleAIScan('all')}
                  disabled={isScanning}
                >
                  {isScanning ? 'Analyzing...' : 'Full AI Analysis'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleAIScan('quick')}
                  disabled={isScanning}
                >
                  Quick Analysis
                </Button>
              </div>
              
              {scanResults && (
                <div className="mt-4 p-3 bg-scanner-dark rounded-md border border-gray-700">
                  <h4 className="text-md font-medium mb-2">Analysis Results</h4>
                  <pre className="text-xs overflow-auto max-h-60 p-2 bg-black/30 rounded">
                    {JSON.stringify(scanResults, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityTools;

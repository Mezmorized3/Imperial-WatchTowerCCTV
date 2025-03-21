
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Scan, FileText } from 'lucide-react';

interface ComplianceResult {
  id: string;
  ip: string;
  status: string;
  vulnerabilities: any[];
  protocols: string[];
  ports: number[];
  timestamp: string;
}

interface ImperialComplianceProps {
  targetIP: string;
  setTargetIP: (ip: string) => void;
  initiateComplianceCheck: () => void;
  isLoading: boolean;
  progressValue: number;
  scanResults: ComplianceResult[] | null;
}

const ImperialCompliance: React.FC<ImperialComplianceProps> = ({
  targetIP,
  setTargetIP,
  initiateComplianceCheck,
  isLoading,
  progressValue,
  scanResults
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-red-400" />
            Imperial Compliance Check
          </CardTitle>
          <CardDescription>
            Assess a target for compliance with Imperial security protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-400">Target IP Address</label>
              <Input
                value={targetIP}
                onChange={(e) => setTargetIP(e.target.value)}
                placeholder="192.168.1.100"
                className="bg-scanner-dark border-gray-700 text-white"
              />
            </div>
            
            <Button
              onClick={initiateComplianceCheck}
              disabled={isLoading || !targetIP.trim()}
              className="w-full"
            >
              <Scan className="mr-2 h-4 w-4" />
              {isLoading ? "Checking Compliance..." : "Initiate Compliance Check"}
            </Button>
            
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compliance check in progress...</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Compliance Results */}
      {scanResults && (
        <Card className="bg-scanner-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-4 w-4 text-green-400" />
              Compliance Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanResults.map(result => (
              <div key={result.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{result.ip}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Open Ports</h4>
                    <div className="space-y-1">
                      {result.ports && result.ports.length > 0 ? (
                        result.ports.map((port: number, i: number) => (
                          <div key={i} className="text-sm">{port}</div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No open ports detected</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Protocols</h4>
                    <div className="space-y-1">
                      {result.protocols && result.protocols.length > 0 ? (
                        result.protocols.map((protocol: string, i: number) => (
                          <div key={i} className="text-sm">{protocol}</div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No protocols detected</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Vulnerabilities</h4>
                    <div className="space-y-1">
                      {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
                        result.vulnerabilities.map((vuln: any, i: number) => (
                          <div key={i} className="text-sm text-red-400">{vuln.name || vuln}</div>
                        ))
                      ) : (
                        <div className="text-sm text-green-500">No vulnerabilities detected</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Imperial Assessment</h4>
                  <div className="text-sm">
                    {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
                      <span className="text-red-400">Target has failed Imperial compliance check. Recommend immediate security remediation.</span>
                    ) : (
                      <span className="text-green-400">Target has passed Imperial compliance check. Continue monitoring for new threats.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImperialCompliance;

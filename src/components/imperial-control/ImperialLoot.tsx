
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Globe, Database } from 'lucide-react';

interface LootResult {
  id: string;
  url: string;
  headers: Record<string, string>;
  technologies: string[];
  security: {
    https?: boolean;
    hsts?: boolean;
    csp?: boolean;
  };
  dns: Array<{
    type: string;
    value: string;
  }>;
  timestamp: string;
}

interface ImperialLootProps {
  targetURL: string;
  setTargetURL: (url: string) => void;
  secureLoot: () => void;
  isLoading: boolean;
  progressValue: number;
  scanResults: LootResult[] | null;
}

const ImperialLoot: React.FC<ImperialLootProps> = ({
  targetURL,
  setTargetURL,
  secureLoot,
  isLoading,
  progressValue,
  scanResults
}) => {
  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-purple-400" />
            Secure Imperial Loot
          </CardTitle>
          <CardDescription>
            Acquire digital intelligence from online targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-400">Target URL</label>
              <Input
                value={targetURL}
                onChange={(e) => setTargetURL(e.target.value)}
                placeholder="https://example.com"
                className="bg-scanner-dark border-gray-700 text-white"
              />
            </div>
            
            <Button
              onClick={secureLoot}
              disabled={isLoading || !targetURL.trim()}
              className="w-full"
            >
              <Globe className="mr-2 h-4 w-4" />
              {isLoading ? "Securing Loot..." : "Secure Loot"}
            </Button>
            
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Acquiring intelligence...</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Loot Results */}
      {scanResults && scanResults.length > 0 && (
        <Card className="bg-scanner-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Database className="mr-2 h-4 w-4 text-purple-400" />
              Acquired Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanResults.map(result => (
              <div key={result.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{result.url}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.technologies && result.technologies.length > 0 ? (
                        result.technologies.map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-md">
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No technologies detected</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Security</h4>
                    <div className="space-y-1 text-sm">
                      {result.security ? (
                        <>
                          <div><span className="text-gray-400">HTTPS:</span> {result.security.https ? 'Yes' : 'No'}</div>
                          <div><span className="text-gray-400">HSTS:</span> {result.security.hsts ? 'Yes' : 'No'}</div>
                          <div><span className="text-gray-400">CSP:</span> {result.security.csp ? 'Yes' : 'No'}</div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">No security information available</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">DNS Information</h4>
                  <div className="space-y-2">
                    {result.dns && result.dns.length > 0 ? (
                      result.dns.map((record: any, i: number) => (
                        <div key={i} className="text-sm">
                          <span className="text-gray-400">{record.type}:</span> {record.value}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No DNS information available</span>
                    )}
                  </div>
                </div>
                
                <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">HTTP Headers</h4>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {result.headers && Object.keys(result.headers).length > 0 ? (
                      Object.entries(result.headers).map(([key, value]: [string, any], i: number) => (
                        <div key={i} className="text-sm flex">
                          <span className="text-gray-400 min-w-36">{key}:</span>
                          <span className="ml-2">{value as string}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No HTTP headers available</span>
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

export default ImperialLoot;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UsernameSearchTool from '@/components/surveillance/search-tools/UsernameSearchTool';
import TwintTool from '@/components/surveillance/search-tools/TwintTool';
import { executeOSINT } from '@/utils/osintImplementations/socialTools';

const SocialMediaTab: React.FC = () => {
  const [activeSocialTool, setActiveSocialTool] = useState<string | null>(null);
  const [osintResults, setOsintResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSocialToolClick = (toolName: string) => {
    setActiveSocialTool(toolName);
    toast({
      title: toolName,
      description: `Opening ${toolName} tool...`,
    });
  };

  const handleRunOsintFramework = async () => {
    setIsLoading(true);
    try {
      const result = await executeOSINT({ type: 'general', target: 'comprehensive-scan' });
      setOsintResults(result.data);
      toast({
        title: "OSINT Scan Complete",
        description: `Found ${result.data.results.length} results`,
      });
    } catch (error) {
      console.error("OSINT scan error:", error);
      toast({
        title: "OSINT Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeSocialTool) {
    return (
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Social Media Intelligence</h2>
            <p className="text-gray-400 mb-4">Tools for gathering intelligence from social media platforms</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Username Search</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Find accounts across multiple platforms
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialToolClick('username-search')}
                >
                  Open Tool
                </Button>
              </div>
              
              <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Twint</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Twitter intelligence tool
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialToolClick('twint')}
                >
                  Open Tool
                </Button>
              </div>
              
              <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
                <h3 className="text-lg font-medium mb-2">OSINT Framework</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Comprehensive OSINT gathering
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialToolClick('osint-framework')}
                >
                  Open Tool
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">
            {activeSocialTool === 'username-search' ? 'Username Search' : 
             activeSocialTool === 'twint' ? 'Twitter Intelligence (Twint)' : 
             'OSINT Framework'}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveSocialTool(null)}
          >
            Back
          </Button>
        </CardHeader>
        <CardContent>
          {activeSocialTool === 'username-search' && <UsernameSearchTool />}
          {activeSocialTool === 'twint' && <TwintTool />}
          {activeSocialTool === 'osint-framework' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                The OSINT Framework provides comprehensive intelligence gathering across multiple sources.
                Run a scan to collect data from various OSINT sources.
              </p>
              
              <Button
                onClick={handleRunOsintFramework}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Running OSINT Scan..." : "Run OSINT Framework Scan"}
              </Button>
              
              {osintResults && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">OSINT Scan Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {osintResults.results.map((result: any, index: number) => (
                      <div key={index} className="bg-scanner-dark p-4 rounded border border-gray-700">
                        <h4 className="font-medium">{result.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">Type: {result.type}</p>
                        <pre className="text-xs bg-black/30 p-2 mt-2 rounded overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaTab;

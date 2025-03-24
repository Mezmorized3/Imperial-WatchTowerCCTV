
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UsernameSearchTool } from '@/components/surveillance/search-tools/UsernameSearchTool';
import TwintTool from '@/components/surveillance/search-tools/TwintTool';

const SocialMediaTab: React.FC = () => {
  const [activeSocialTool, setActiveSocialTool] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSocialToolClick = (toolName: string) => {
    setActiveSocialTool(toolName);
    toast({
      title: toolName,
      description: `Opening ${toolName} tool...`,
    });
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
                <h3 className="text-lg font-medium mb-2">Social Media Analyzer</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Analyze profiles and connections
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialToolClick('social-analyzer')}
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
             'Social Media Analyzer'}
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
          {activeSocialTool === 'social-analyzer' && (
            <div className="py-8 text-center">
              <h3 className="text-lg font-medium mb-2">Social Media Analyzer</h3>
              <p className="text-sm text-gray-400 mb-4">
                This tool is currently in development. Check back soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaTab;


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import CameraSearchTools from '@/components/surveillance/CameraSearchTools';
import { Globe, Search, Users, Database, FileSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UsernameSearchTool } from '@/components/surveillance/search-tools/UsernameSearchTool';
import { TwintTool } from '@/components/surveillance/search-tools/TwintTool';

const OsintTools = () => {
  const [activeTab, setActiveTab] = useState('camera-tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSocialTool, setActiveSocialTool] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSocialToolClick = (toolName: string) => {
    setActiveSocialTool(toolName);
    toast({
      title: toolName,
      description: `Opening ${toolName} tool...`,
    });
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Globe className="mr-2 text-blue-500" /> OSINT Intelligence Center
          </h1>
          <p className="text-gray-400">
            Open Source Intelligence tools for gathering information and reconnaissance
          </p>
        </div>
        
        <div className="mb-6">
          <Card className="bg-scanner-dark-alt border-gray-700">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search across all OSINT tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-scanner-dark border-gray-700"
                />
                <Button 
                  className="whitespace-nowrap"
                  onClick={() => {
                    toast({
                      title: "Global Search",
                      description: "Searching across all OSINT tools...",
                    });
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 mb-4 bg-scanner-dark-alt w-full">
            <TabsTrigger value="camera-tools" className="data-[state=active]:bg-scanner-info/20">
              <Search className="h-4 w-4 mr-2" />
              Camera OSINT
            </TabsTrigger>
            <TabsTrigger value="social-media" className="data-[state=active]:bg-scanner-info/20">
              <Users className="h-4 w-4 mr-2" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="data-analysis" className="data-[state=active]:bg-scanner-info/20">
              <Database className="h-4 w-4 mr-2" />
              Data Analysis
            </TabsTrigger>
            <TabsTrigger value="document-search" className="data-[state=active]:bg-scanner-info/20">
              <FileSearch className="h-4 w-4 mr-2" />
              Document Search
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera-tools">
            <CameraSearchTools />
          </TabsContent>
          
          <TabsContent value="social-media">
            {!activeSocialTool ? (
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
            ) : (
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
            )}
          </TabsContent>
          
          <TabsContent value="data-analysis">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Data Analysis Tools</h2>
                  <p className="text-gray-400">Advanced tools for analyzing collected data</p>
                  
                  <div className="bg-scanner-dark p-6 rounded-md border border-gray-700 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium mb-2">Data Analysis Hub</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      This module is currently in development. Check back soon for updates.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature is currently in development",
                        });
                      }}
                    >
                      Request Early Access
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="document-search">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Document Search & Analysis</h2>
                  <p className="text-gray-400">Search and analyze documents from various sources</p>
                  
                  <div className="bg-scanner-dark p-6 rounded-md border border-gray-700 text-center">
                    <FileSearch className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium mb-2">Document Intelligence</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      This module is currently in development. Check back soon for updates.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "This feature is currently in development",
                        });
                      }}
                    >
                      Request Early Access
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OsintTools;


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import CameraSearchTools from '@/components/surveillance/CameraSearchTools';
import { Globe, Search, Users, Database, FileSearch } from 'lucide-react';
import OsintSearchBar from '@/components/osint/OsintSearchBar';
import SocialMediaTab from '@/components/osint/tabs/SocialMediaTab';
import DataAnalysisTab from '@/components/osint/tabs/DataAnalysisTab';
import DocumentSearchTab from '@/components/osint/tabs/DocumentSearchTab';

const OsintTools = () => {
  const [activeTab, setActiveTab] = useState('camera-tools');
  const [searchQuery, setSearchQuery] = useState('');

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
          <OsintSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
            <SocialMediaTab />
          </TabsContent>
          
          <TabsContent value="data-analysis">
            <DataAnalysisTab />
          </TabsContent>
          
          <TabsContent value="document-search">
            <DocumentSearchTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OsintTools;

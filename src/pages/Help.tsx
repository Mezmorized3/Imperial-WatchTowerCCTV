
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle } from 'lucide-react';
import SearchBar from '@/components/help/SearchBar';
import GuidesSection from '@/components/help/GuidesSection';
import FaqSection from '@/components/help/FaqSection';

const Help = () => {
  const imperialDirectiveBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗         ██████╗ ██╗██████╗ ███████╗ ██████╗████████╗██╗██╗   ██╗███████╗
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔══██╗██║██╔══██╗██╔════╝██╔════╝╚══██╔══╝██║██║   ██║██╔════╝
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ██║  ██║██║██████╔╝█████╗  ██║        ██║   ██║██║   ██║█████╗  
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██║  ██║██║██╔══██╗██╔══╝  ██║        ██║   ██║╚██╗ ██╔╝██╔══╝  
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ██████╔╝██║██║  ██║███████╗╚██████╗   ██║   ██║ ╚████╔╝ ███████╗
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝
  `;

  return (
    <div className="flex flex-col min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
              <pre className="text-[#ea384c] text-xs font-mono">{imperialDirectiveBanner}</pre>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <HelpCircle className="h-8 w-8 mr-3 text-scanner-primary" />
          <h1 className="text-3xl font-bold">Imperial Directive</h1>
        </div>

        <div className="mb-8">
          <SearchBar />
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="guides">User Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            <GuidesSection />
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <FaqSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Help;

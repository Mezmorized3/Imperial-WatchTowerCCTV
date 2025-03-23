
import React from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Terminal, Download, ExternalLink, Code, Shield, AlertTriangle, Tool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const HackingToolPage: React.FC = () => {
  const handleToolClick = (toolName: string) => {
    toast({
      title: "Tool Selected",
      description: `${toolName} will be implemented soon.`,
    });
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Cpu className="mr-2 h-6 w-6 text-scanner-primary" />
            Hacking Tool Framework
          </h1>
          <p className="text-gray-400">
            Security testing and vulnerability assessment framework
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-gray-700 bg-scanner-dark shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal className="h-5 w-5 text-scanner-warning mr-2" />
                Coming Soon
              </CardTitle>
              <CardDescription className="text-gray-400">
                We are reimplementing the Hacking Tool Framework
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Tool className="h-5 w-5 text-scanner-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-scanner-primary">HackTools</p>
                  <p className="text-gray-400 text-sm">
                    The all-in-one Red Team browser extension for Web Pentesters. 
                    HackTools is being integrated into our framework to provide a comprehensive 
                    set of tools right at your fingertips.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <p className="text-gray-300 text-sm font-medium">Features coming soon:</p>
                <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
                  <li>Reverse Shell generator</li>
                  <li>XSS payload generator</li>
                  <li>Hash & Encode/Decode utilities</li>
                  <li>CMS & Web technology detection</li>
                  <li>SQLi payloads & cheatsheets</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-scanner-dark-alt text-sm w-full"
                  onClick={() => window.open('https://github.com/LasCC/HackTools', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View HackTools on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-scanner-dark shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 text-scanner-primary mr-2" />
                FileCentipede
              </CardTitle>
              <CardDescription className="text-gray-400">
                Advanced Download Manager and Explorer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                FileCentipede is a powerful download manager with BitTorrent client, M3U8 downloader, 
                MPD downloader, and network packet capture capabilities.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-scanner-dark-alt"
                  onClick={() => handleToolClick('FileCentipede')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-scanner-dark-alt"
                  onClick={() => window.open('https://github.com/filecxx/FileCentipede', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-scanner-dark shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-scanner-success mr-2" />
                Tool-ExploitPack
              </CardTitle>
              <CardDescription className="text-gray-400">
                Collection of Security Exploits and Tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                Tool-ExploitPack by AngelSecurityTeam provides a collection of security exploits and penetration testing tools 
                for vulnerability assessment and security research.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-scanner-dark-alt"
                  onClick={() => handleToolClick('Tool-ExploitPack')}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Setup
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-scanner-dark-alt"
                  onClick={() => window.open('https://github.com/AngelSecurityTeam/Tool-ExploitPack', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HackingToolPage;

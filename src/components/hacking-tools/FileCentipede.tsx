
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const FileCentipede: React.FC = () => {
  const handleToolClick = (toolName: string) => {
    toast({
      title: "Tool Selected",
      description: `${toolName} will be implemented soon.`,
    });
  };

  return (
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
  );
};

export default FileCentipede;

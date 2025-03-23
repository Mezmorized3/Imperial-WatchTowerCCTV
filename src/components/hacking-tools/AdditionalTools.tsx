
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Code, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeSecurityAdmin } from '@/utils/osintTools';

interface AdditionalToolsProps {
  isRealmode: boolean;
}

const AdditionalTools: React.FC<AdditionalToolsProps> = ({ isRealmode }) => {
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
          <Shield className="h-5 w-5 text-scanner-success mr-2" />
          Additional Tools
        </CardTitle>
        <CardDescription className="text-gray-400">
          Other security testing tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={() => window.open('https://github.com/LasCC/HackTools', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            HackTools GitHub
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={() => {
              if (isRealmode) {
                executeSecurityAdmin({
                  command: 'scan',
                  scanType: 'basic',
                  options: {
                    target: 'localhost',
                    ports: '1-1000'
                  }
                }).then(result => {
                  toast({
                    title: "Security Admin",
                    description: "Scan completed. Check console for details.",
                  });
                  console.log("Security Admin Results:", result);
                }).catch(err => {
                  console.error("Security Admin Error:", err);
                });
              } else {
                handleToolClick('Security Admin');
              }
            }}
          >
            <Code className="h-4 w-4 mr-2" />
            Security Admin
          </Button>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-2">Available Tools:</h3>
          <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
            <li>SQLi payloads & cheatsheets</li>
            <li>CMS & Web technology detection</li>
            <li>Advanced payload generator</li>
            <li>Security scanning tools</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalTools;

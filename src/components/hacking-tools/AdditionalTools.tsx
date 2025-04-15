import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Code, Database, FileSearch, Terminal, Globe } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeSecurityAdmin } from '@/utils/osintTools';

interface AdditionalToolsProps {
  isRealmode: boolean;
}

const AdditionalTools: React.FC<AdditionalToolsProps> = ({ isRealmode }) => {
  const handleSecurityAdmin = async () => {
    try {
      const result = await executeSecurityAdmin({
        target: 'localhost',
        action: 'check',
        scope: 'system',
        timeout: 30
      });
      
      toast({
        title: "Security Admin",
        description: "Scan completed successfully",
      });
      console.log("Security Admin Results:", result);
    } catch (err) {
      toast({
        title: "Security Admin",
        description: "Error executing security scan",
        variant: "destructive",
      });
      console.error("Security Admin Error:", err);
    }
  };

  const handleSQLiPayloads = () => {
    toast({
      title: "SQLi Payloads",
      description: "Opening SQL injection payloads & cheatsheets",
    });
  };

  const handleCMSDetection = () => {
    toast({
      title: "CMS Detection",
      description: "Opening CMS & Web technology detection tool",
    });
  };

  const handlePayloadGenerator = () => {
    toast({
      title: "Payload Generator",
      description: "Opening advanced payload generator",
    });
  };

  const handleSecurityScanning = () => {
    toast({
      title: "Security Scanning",
      description: "Opening security scanning tools",
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
            onClick={handleSecurityAdmin}
          >
            <Code className="h-4 w-4 mr-2" />
            Security Admin
          </Button>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-2">Available Tools:</h3>
          <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
            <li className="cursor-pointer hover:text-scanner-primary" onClick={handleSQLiPayloads}>
              SQLi payloads & cheatsheets
            </li>
            <li className="cursor-pointer hover:text-scanner-primary" onClick={handleCMSDetection}>
              CMS & Web technology detection
            </li>
            <li className="cursor-pointer hover:text-scanner-primary" onClick={handlePayloadGenerator}>
              Advanced payload generator
            </li>
            <li className="cursor-pointer hover:text-scanner-primary" onClick={handleSecurityScanning}>
              Security scanning tools
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalTools;

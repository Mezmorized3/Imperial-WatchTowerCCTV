
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ApiKeySettings: React.FC = () => {
  const { toast } = useToast();
  const [virusTotalApiKey, setVirusTotalApiKey] = useState(localStorage.getItem('VIRUSTOTAL_API_KEY') || '');
  const [abuseIPDBApiKey, setAbuseIPDBApiKey] = useState(localStorage.getItem('ABUSEIPDB_API_KEY') || '');
  const [nvdApiKey, setNvdApiKey] = useState(localStorage.getItem('NVD_API_KEY') || '');
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);

  const handleSave = () => {
    // Save API keys to localStorage
    if (virusTotalApiKey) {
      localStorage.setItem('VIRUSTOTAL_API_KEY', virusTotalApiKey);
    }
    if (abuseIPDBApiKey) {
      localStorage.setItem('ABUSEIPDB_API_KEY', abuseIPDBApiKey);
    }
    if (nvdApiKey) {
      localStorage.setItem('NVD_API_KEY', nvdApiKey);
    }

    setIsApiKeySaved(true);
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });

    // Reset the saved indicator after 3 seconds
    setTimeout(() => {
      setIsApiKeySaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-scanner-card border-gray-700">
        <CardHeader>
          <CardTitle>External API Keys</CardTitle>
          <CardDescription className="text-gray-400">
            Configure API keys for external threat intelligence and vulnerability scanning services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="virustotal-api-key" className="flex items-center">
                <span>VirusTotal API Key</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900 text-blue-200 rounded">Threat Intel</span>
              </Label>
              <Input
                id="virustotal-api-key"
                className="bg-gray-800 font-mono"
                value={virusTotalApiKey}
                onChange={(e) => setVirusTotalApiKey(e.target.value)}
                placeholder="Enter your VirusTotal API key"
              />
              <p className="text-xs text-gray-400">Used for IP reputation and threat intelligence data.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abuseipdb-api-key" className="flex items-center">
                <span>AbuseIPDB API Key</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-900 text-blue-200 rounded">Threat Intel</span>
              </Label>
              <Input
                id="abuseipdb-api-key"
                className="bg-gray-800 font-mono"
                value={abuseIPDBApiKey}
                onChange={(e) => setAbuseIPDBApiKey(e.target.value)}
                placeholder="Enter your AbuseIPDB API key"
              />
              <p className="text-xs text-gray-400">Used for IP reputation and abuse reporting data.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nvd-api-key" className="flex items-center">
                <span>NVD API Key</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-900 text-red-200 rounded">Firmware</span>
              </Label>
              <Input
                id="nvd-api-key"
                className="bg-gray-800 font-mono"
                value={nvdApiKey}
                onChange={(e) => setNvdApiKey(e.target.value)}
                placeholder="Enter your NVD API key"
              />
              <p className="text-xs text-gray-400">Used for firmware vulnerability analysis from the National Vulnerability Database.</p>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleSave}
              variant={isApiKeySaved ? "secondary" : "default"}
              className="w-full"
            >
              <Key className="mr-2 h-4 w-4" />
              {isApiKeySaved ? "API Keys Saved" : "Save API Keys"}
            </Button>
          </div>
          
          <div className="border border-gray-700 p-4 rounded-md bg-gray-800/50 mt-4">
            <h4 className="text-sm font-medium mb-2 text-gray-300">Security Note</h4>
            <p className="text-xs text-gray-400">
              API keys are stored in your browser's local storage. For production use, consider configuring these keys on the server side in <code className="text-xs bg-gray-900 px-1 py-0.5 rounded">server/config.json</code>.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-scanner-card border-gray-700">
        <CardHeader>
          <CardTitle>Imperial Server Configuration</CardTitle>
          <CardDescription className="text-gray-400">
            Configure connection to the Imperial Server for enhanced capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="imperial-server-url" className="flex items-center">
              <span>Server URL</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded">Required</span>
            </Label>
            <Input
              id="imperial-server-url"
              className="bg-gray-800"
              defaultValue="http://localhost:7443"
              placeholder="http://localhost:7443"
            />
            <p className="text-xs text-gray-400">The URL of your Imperial Server instance. Default port is 7443.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imperial-token" className="flex items-center">
              <span>Imperial Access Token</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded">Required</span>
            </Label>
            <Input
              id="imperial-token"
              className="bg-gray-800"
              placeholder="Enter your Imperial admin token"
              type="password"
              defaultValue={localStorage.getItem('imperialToken') || ''}
            />
            <p className="text-xs text-gray-400">Admin token from your server's config.json file.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

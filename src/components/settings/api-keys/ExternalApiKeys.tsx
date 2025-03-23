
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExternalApiKeysProps {
  onSave: () => void;
  isApiKeySaved: boolean;
}

export const ExternalApiKeys: React.FC<ExternalApiKeysProps> = ({ onSave, isApiKeySaved }) => {
  const { toast } = useToast();
  const [virusTotalApiKey, setVirusTotalApiKey] = useState(localStorage.getItem('VIRUSTOTAL_API_KEY') || '');
  const [abuseIPDBApiKey, setAbuseIPDBApiKey] = useState(localStorage.getItem('ABUSEIPDB_API_KEY') || '');
  const [nvdApiKey, setNvdApiKey] = useState(localStorage.getItem('NVD_API_KEY') || '');
  const [useServerConfig, setUseServerConfig] = useState(true);

  const handleSave = () => {
    if (!useServerConfig) {
      // Save API keys to localStorage (fallback option)
      if (virusTotalApiKey) {
        localStorage.setItem('VIRUSTOTAL_API_KEY', virusTotalApiKey);
      }
      if (abuseIPDBApiKey) {
        localStorage.setItem('ABUSEIPDB_API_KEY', abuseIPDBApiKey);
      }
      if (nvdApiKey) {
        localStorage.setItem('NVD_API_KEY', nvdApiKey);
      }
    } else {
      // Remove any keys from localStorage since we're using server config
      localStorage.removeItem('VIRUSTOTAL_API_KEY');
      localStorage.removeItem('ABUSEIPDB_API_KEY');
      localStorage.removeItem('NVD_API_KEY');
    }
    
    toast({
      title: "API keys configuration saved",
      description: useServerConfig 
        ? "Using secure server-side API keys from configuration." 
        : "Your local API keys have been saved successfully.",
    });
    
    onSave();
  };

  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>External API Keys</CardTitle>
        <CardDescription className="text-gray-400">
          Configure API keys for external threat intelligence and vulnerability scanning services.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-green-900/20 border-green-800">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm ml-2">
            API keys are now securely stored in the server configuration. 
            You don't need to enter them here unless you want to override server settings.
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label htmlFor="use-server-config" className="text-sm font-medium">
              Use secure server-side API keys
            </Label>
            <p className="text-xs text-gray-400">
              Recommended for security. Keys are stored in server/config.json.
            </p>
          </div>
          <input
            type="checkbox"
            id="use-server-config"
            checked={useServerConfig}
            onChange={(e) => setUseServerConfig(e.target.checked)}
            className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-primary"
          />
        </div>
        
        <div className={useServerConfig ? "opacity-50" : "opacity-100"}>
          <div className="space-y-4">
            <ApiKeyInput 
              id="virustotal-api-key"
              label="VirusTotal API Key"
              tagLabel="Threat Intel"
              tagColor="blue"
              value={virusTotalApiKey}
              onChange={setVirusTotalApiKey}
              description="Used for IP reputation and threat intelligence data."
              disabled={useServerConfig}
            />
            
            <ApiKeyInput 
              id="abuseipdb-api-key"
              label="AbuseIPDB API Key"
              tagLabel="Threat Intel"
              tagColor="blue"
              value={abuseIPDBApiKey}
              onChange={setAbuseIPDBApiKey}
              description="Used for IP reputation and abuse reporting data."
              disabled={useServerConfig}
            />
            
            <ApiKeyInput 
              id="nvd-api-key"
              label="NVD API Key"
              tagLabel="Firmware"
              tagColor="red"
              value={nvdApiKey}
              onChange={setNvdApiKey}
              description="Used for firmware vulnerability analysis from the National Vulnerability Database."
              disabled={useServerConfig}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            onClick={handleSave}
            variant={isApiKeySaved ? "secondary" : "default"}
            className="w-full"
          >
            <Key className="mr-2 h-4 w-4" />
            {isApiKeySaved ? "Settings Saved" : "Save Settings"}
          </Button>
        </div>
        
        <div className="border border-gray-700 p-4 rounded-md bg-gray-800/50 mt-4">
          <h4 className="text-sm font-medium mb-2 text-gray-300 flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-400" />
            Security Information
          </h4>
          <p className="text-xs text-gray-400">
            For enhanced security, API keys are now stored in the server configuration file (<code className="text-xs bg-gray-900 px-1 py-0.5 rounded">server/config.json</code>).
            This approach prevents API keys from being exposed in the browser.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface ApiKeyInputProps {
  id: string;
  label: string;
  tagLabel: string;
  tagColor: "blue" | "red" | "green";
  value: string;
  onChange: (value: string) => void;
  description: string;
  disabled?: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  id, 
  label, 
  tagLabel, 
  tagColor, 
  value, 
  onChange, 
  description,
  disabled = false
}) => {
  const tagColorClass = {
    blue: "bg-blue-900 text-blue-200",
    red: "bg-red-900 text-red-200",
    green: "bg-green-900 text-green-200"
  }[tagColor];

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center">
        <span>{label}</span>
        <span className={`ml-2 px-2 py-0.5 text-xs ${tagColorClass} rounded`}>{tagLabel}</span>
      </Label>
      <Input
        id={id}
        className="bg-gray-800 font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter your ${label}`}
        disabled={disabled}
      />
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExternalApiKeysProps {
  onSave: () => void;
  isApiKeySaved: boolean;
}

export const ExternalApiKeys: React.FC<ExternalApiKeysProps> = ({ onSave, isApiKeySaved }) => {
  const { toast } = useToast();
  const [virusTotalApiKey, setVirusTotalApiKey] = useState(localStorage.getItem('VIRUSTOTAL_API_KEY') || '');
  const [abuseIPDBApiKey, setAbuseIPDBApiKey] = useState(localStorage.getItem('ABUSEIPDB_API_KEY') || '');
  const [nvdApiKey, setNvdApiKey] = useState(localStorage.getItem('NVD_API_KEY') || '');

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
    
    toast({
      title: "API keys saved",
      description: "Your API keys have been saved successfully.",
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
        <div className="space-y-4">
          <ApiKeyInput 
            id="virustotal-api-key"
            label="VirusTotal API Key"
            tagLabel="Threat Intel"
            tagColor="blue"
            value={virusTotalApiKey}
            onChange={setVirusTotalApiKey}
            description="Used for IP reputation and threat intelligence data."
          />
          
          <ApiKeyInput 
            id="abuseipdb-api-key"
            label="AbuseIPDB API Key"
            tagLabel="Threat Intel"
            tagColor="blue"
            value={abuseIPDBApiKey}
            onChange={setAbuseIPDBApiKey}
            description="Used for IP reputation and abuse reporting data."
          />
          
          <ApiKeyInput 
            id="nvd-api-key"
            label="NVD API Key"
            tagLabel="Firmware"
            tagColor="red"
            value={nvdApiKey}
            onChange={setNvdApiKey}
            description="Used for firmware vulnerability analysis from the National Vulnerability Database."
          />
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
        
        <SecurityNote />
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
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  id, 
  label, 
  tagLabel, 
  tagColor, 
  value, 
  onChange, 
  description 
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
      />
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

const SecurityNote: React.FC = () => {
  return (
    <div className="border border-gray-700 p-4 rounded-md bg-gray-800/50 mt-4">
      <h4 className="text-sm font-medium mb-2 text-gray-300">Security Note</h4>
      <p className="text-xs text-gray-400">
        API keys are stored in your browser's local storage. For production use, consider configuring these keys on the server side in <code className="text-xs bg-gray-900 px-1 py-0.5 rounded">server/config.json</code>.
      </p>
    </div>
  );
};

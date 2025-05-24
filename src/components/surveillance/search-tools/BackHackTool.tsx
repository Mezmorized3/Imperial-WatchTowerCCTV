
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Scan, AlertTriangle, Camera } from 'lucide-react';
import { executeBackHack } from '@/utils/osintUtilsConnector';
import { BackHackData } from '@/utils/types/osintToolTypes';

interface BackHackToolProps {
  // Add any props if needed
}

const BackHackTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({
    scanType: 'basic' as 'basic' | 'full',
    checkBackups: true,
    checkAdminPanels: true,
    checkCameras: true,
    checkVulnerabilities: false
  });
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<BackHackData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleOptionChange = (option: string, value: boolean) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [option]: value
    }));
  };

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      const result = await executeBackHack({
        tool: 'backHack',
        targetUrl: url,
        mode: options.scanType
      });

      if (result.success) {
        setResults(result.data.results);
        toast({
          title: "Scan Complete",
          description: `BackHack scan completed for ${url}`,
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "An error occurred during the scan",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          <Scan className="mr-2 h-4 w-4 text-scanner-info" />
          BackHack Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Target URL</Label>
          <Input
            type="url"
            id="url"
            placeholder="Enter URL to scan (e.g., https://example.com)"
            className="bg-scanner-dark-alt border-gray-700"
            value={url}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Scan Options</Label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="checkBackups"
                checked={options.checkBackups}
                onCheckedChange={(checked) => handleOptionChange('checkBackups', checked!)}
                className="peer h-5 w-9 rounded-full bg-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="checkBackups" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Check for Backup Files
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="checkAdminPanels"
                checked={options.checkAdminPanels}
                onCheckedChange={(checked) => handleOptionChange('checkAdminPanels', checked!)}
                className="peer h-5 w-9 rounded-full bg-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="checkAdminPanels" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Check for Admin Panels
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="checkCameras"
                checked={options.checkCameras}
                onCheckedChange={(checked) => handleOptionChange('checkCameras', checked!)}
                className="peer h-5 w-9 rounded-full bg-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="checkCameras" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Check for Camera Feeds
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="checkVulnerabilities"
                checked={options.checkVulnerabilities}
                onCheckedChange={(checked) => handleOptionChange('checkVulnerabilities', checked!)}
                className="peer h-5 w-9 rounded-full bg-gray-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="checkVulnerabilities" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Check for Vulnerabilities
              </Label>
            </div>
          </div>
        </div>

        <Button onClick={handleScan} disabled={isScanning} className="bg-scanner-primary">
          {isScanning ? (
            <>
              <Scan className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Scan className="mr-2 h-4 w-4" />
              Start Scan
            </>
          )}
        </Button>

        {results && (
          <div className="mt-4 space-y-4">
            {results.adminPanel && (
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent>
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500 inline-block" />
                  Possible Admin Panel: <a href={results.adminPanel} target="_blank" rel="noopener noreferrer" className="text-blue-500">{results.adminPanel}</a>
                </CardContent>
              </Card>
            )}

            {results.backupFiles && results.backupFiles.length > 0 && (
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent>
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500 inline-block" />
                  Backup Files Found:
                  <ul>
                    {results.backupFiles.map((file: string, index: number) => (
                      <li key={index}>
                        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500">{file}</a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {results.cameras && results.cameras.length > 0 && (
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent>
                  <Camera className="mr-2 h-4 w-4 text-blue-500 inline-block" />
                  Camera Feeds Found:
                  <ul>
                    {results.cameras.map((camera: any, index: number) => (
                      <li key={index}>
                        <a href={camera.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{camera.url}</a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {results.vulnerabilities && results.vulnerabilities.length > 0 && (
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent>
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500 inline-block" />
                  Vulnerabilities Found:
                  <ul>
                    {results.vulnerabilities.map((vuln: any, index: number) => (
                      <li key={index}>
                        {vuln.type} - <a href={vuln.url} target="_blank" rel="noopener noreferrer" className="text-blue-500"> {vuln.url}</a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {(!results.adminPanel && (!results.backupFiles || results.backupFiles.length === 0) && (!results.cameras || results.cameras.length === 0) && (!results.vulnerabilities || results.vulnerabilities.length === 0)) && (
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent>
                  No vulnerabilities or sensitive information found.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackHackTool;

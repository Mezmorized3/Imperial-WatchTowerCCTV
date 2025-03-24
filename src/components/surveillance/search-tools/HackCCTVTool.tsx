import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { CameraResult } from '@/types/scanner';
import { executeHackCCTV } from '@/utils/osintImplementations/hackCCTVTools';
import { convertToScannerFormat } from '@/utils/scanner/cameraConverter';

interface HackCCTVToolProps {
  onCameraResults?: (results: CameraResult[]) => void;
}

const HackCCTVTool: React.FC<HackCCTVToolProps> = ({ onCameraResults }) => {
  const { toast } = useToast();
  const [target, setTarget] = useState('');
  const [country, setCountry] = useState('');
  const [deepScan, setDeepScan] = useState(false);
  const [bruteforce, setBruteforce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CameraResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) {
      toast({
        title: "Error",
        description: "Target IP or range is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const hackResults = await executeHackCCTV({
        target,
        country: country || undefined,
        deepScan,
        bruteforce,
      });

      if (hackResults.success && hackResults.data?.cameras) {
        const convertedResults = hackResults.data.cameras.map(camera => 
          convertToScannerFormat(camera)
        );
        
        setResults(convertedResults);
        
        if (onCameraResults) {
          onCameraResults(convertedResults);
        }
        
        toast({
          title: "Scan Complete",
          description: `Found ${convertedResults.length} vulnerable cameras`,
        });
      } else {
        toast({
          title: "Scan Failed",
          description: hackResults.error || "No cameras found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in HackCCTV tool:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSimulatedResults = () => {
    // This is just a demo function to create sample results
    const simulatedCamera: CameraResult = {
      id: `hcam-${Date.now()}`,
      ip: '192.168.1.100',
      port: 554,
      model: 'Vulnerable IP Camera',
      brand: 'Generic',
      vulnerabilities: [
        { name: 'Default Credentials', severity: 'high', description: 'Using factory default password' },
        { name: 'Firmware Outdated', severity: 'medium', description: 'Running outdated firmware with known CVEs' }
      ],
      status: 'vulnerable',
      location: {
        country: country || 'United States',
        city: 'Unknown'
      },
      credentials: {
        username: 'admin',
        password: '12345'
      },
      lastSeen: new Date().toISOString(),
      accessLevel: 'admin'
    };
    
    return [simulatedCamera];
  };

  return (
    <Card className="w-full bg-scanner-dark border-gray-700">
      <CardHeader>
        <CardTitle className="text-scanner-info flex items-center">
          HackCCTV Tool
        </CardTitle>
        <CardDescription>
          Advanced exploitation tool for finding and compromising vulnerable cameras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target IP or Range</Label>
              <Input
                id="target"
                placeholder="192.168.1.1 or 192.168.1.0/24"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country Filter (optional)</Label>
              <Input
                id="country"
                placeholder="e.g., US, RU, CN"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="deepScan" 
                checked={deepScan} 
                onCheckedChange={(checked) => setDeepScan(checked as boolean)} 
              />
              <Label htmlFor="deepScan">Deep Scan</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bruteforce" 
                checked={bruteforce} 
                onCheckedChange={(checked) => setBruteforce(checked as boolean)} 
              />
              <Label htmlFor="bruteforce">Bruteforce Credentials</Label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-scanner-info hover:bg-scanner-info/80 text-black"
          >
            {loading ? "Scanning..." : "Start Scan"}
          </Button>
        </form>
        
        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Scan Results</h3>
            <ul className="space-y-2">
              {results.map((camera) => (
                <li key={camera.id} className="p-4 bg-scanner-dark-alt border border-gray-700 rounded-md">
                  <p>
                    <strong>IP:</strong> {camera.ip}
                  </p>
                  <p>
                    <strong>Model:</strong> {camera.model || 'Unknown'}
                  </p>
                  <p>
                    <strong>Status:</strong> {camera.status}
                  </p>
                  {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                    <div>
                      <strong>Vulnerabilities:</strong>
                      <ul>
                        {camera.vulnerabilities.map((vuln, index) => (
                          <li key={index}>
                            {vuln.name} ({vuln.severity}) - {vuln.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {camera.credentials && (
                    <p>
                      <strong>Credentials:</strong> Username: {camera.credentials.username}, Password: {camera.credentials.password}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HackCCTVTool;

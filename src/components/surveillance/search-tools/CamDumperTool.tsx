
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { executeCamDumper } from '@/utils/osintTools';
import { Camera, Loader2, Search, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CamDumperTool = () => {
  const [target, setTarget] = useState('');
  const [region, setRegion] = useState('global');
  const [manufacturer, setManufacturer] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const regions = [
    { value: 'global', label: 'Global' },
    { value: 'us', label: 'United States' },
    { value: 'eu', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'au', label: 'Australia' }
  ];

  const manufacturers = [
    { value: 'all', label: 'All Manufacturers' },
    { value: 'hikvision', label: 'Hikvision' },
    { value: 'dahua', label: 'Dahua' },
    { value: 'axis', label: 'Axis' },
    { value: 'foscam', label: 'Foscam' },
    { value: 'mobotix', label: 'Mobotix' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setResults([]);

    try {
      const response = await executeCamDumper({
        target: target || 'auto',
        region,
        manufacturer
      });

      if (response?.success) {
        setResults(response.data?.cameras || []);
      }
    } catch (error) {
      console.error('CamDumper error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Globe className="w-5 h-5 mr-2 text-green-500" />
          Cam Dumper Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="target">IP Address or Domain (Optional)</Label>
              <Input
                id="target"
                placeholder="Leave empty for auto-discovery"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region" className="bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select value={manufacturer} onValueChange={setManufacturer}>
                <SelectTrigger id="manufacturer" className="bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.value} value={manufacturer.value}>
                      {manufacturer.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Discover Cameras
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="block">
        {results.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400">Results ({results.length})</h3>
            {results.map((camera, index) => (
              <div key={index} className="p-2 rounded bg-scanner-dark border border-gray-700 text-sm">
                <div className="flex justify-between">
                  <p className="font-medium text-blue-400">{camera.ip}</p>
                  <p className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">
                    {camera.type || 'Camera'}
                  </p>
                </div>
                <p>Port: {camera.port}</p>
                {camera.manufacturer && <p>Manufacturer: {camera.manufacturer}</p>}
                {camera.model && <p>Model: {camera.model}</p>}
                {camera.location && <p>Location: {camera.location}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {loading ? 'Searching for cameras...' : 'Configure search parameters and click Discover'}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default CamDumperTool;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface SearchResult {
  id: string;
  type: string;
  source: string;
  content: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export const IPCamSearchTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter an IP range or specific IP",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    // Simulate search process
    toast({
      title: "Search Started",
      description: `Scanning IP range: ${query}`,
    });

    // Create a progress indicator
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setSearchProgress(Math.min(progress, 95));
      if (progress >= 95) clearInterval(progressInterval);
    }, 200);

    // Simulate search delay and results
    setTimeout(() => {
      const mockResults = generateMockResults(query);
      setResults(mockResults);
      setIsSearching(false);
      clearInterval(progressInterval);
      setSearchProgress(100);

      toast({
        title: "Search Complete",
        description: `Found ${mockResults.length} devices`,
      });

      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }, 2500);
  };

  // Generate mock results
  const generateMockResults = (ipRange: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < count; i++) {
      const ipBase = ipRange.split('/')[0].split('.');
      const lastOctet = Math.floor(Math.random() * 255);
      const ip = `${ipBase[0] || '192'}.${ipBase[1] || '168'}.${ipBase[2] || '1'}.${lastOctet}`;
      
      results.push({
        id: `ipcam-${Date.now()}-${i}`,
        type: 'ipcamsearch',
        source: 'IPCam Protocol',
        content: `${ip}:${[80, 8080, 554, 443][Math.floor(Math.random() * 4)]}`,
        timestamp: new Date().toISOString(),
        meta: {
          protocol: ['ONVIF', 'RTSP', 'HTTP'][Math.floor(Math.random() * 3)],
          manufacturer: ['Hikvision', 'Dahua', 'Axis', 'Bosch'][Math.floor(Math.random() * 4)]
        }
      });
    }

    return results;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="IP range (e.g., 192.168.1.0/24) or specific IP"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
        >
          {isSearching ? "Scanning..." : "Scan"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            Devices Found ({results.length})
          </h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {results.map(result => (
              <div 
                key={result.id} 
                className="p-3 bg-scanner-dark rounded-md border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.source}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-blue-400 break-all">{result.content}</p>
                
                {result.meta && Object.keys(result.meta).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(result.meta).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-400">{key}: </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

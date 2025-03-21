
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

export const CameradarTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter an RTSP target (IP or subnet)",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    // Simulate search process
    toast({
      title: "Cameradar Search Started",
      description: `Scanning for RTSP streams: ${query}`,
    });

    // Create a progress indicator
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 3;
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
        description: `Found ${mockResults.length} RTSP streams`,
      });

      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }, 3000);
  };

  // Generate mock results
  const generateMockResults = (target: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const count = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < count; i++) {
      const ipBase = target.split('/')[0].split('.');
      const lastOctet = Math.floor(Math.random() * 255);
      const ip = `${ipBase[0] || '192'}.${ipBase[1] || '168'}.${ipBase[2] || '1'}.${lastOctet}`;
      const routes = ['/live', '/stream', '/h264', '/cam', '/mpeg4'];
      const route = routes[Math.floor(Math.random() * routes.length)];
      
      results.push({
        id: `cameradar-${Date.now()}-${i}`,
        type: 'cameradar',
        source: 'Cameradar RTSP',
        content: `rtsp://${ip}:554${route}`,
        timestamp: new Date().toISOString(),
        meta: {
          credentials: Math.random() > 0.5 ? 'Found (admin:admin)' : 'Not found',
          routes: route,
          auth: Math.random() > 0.7 ? 'Basic' : 'Digest',
          accessible: Math.random() > 0.3 ? 'Yes' : 'No'
        }
      });
    }

    return results;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="RTSP target (IP or subnet)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
        >
          {isSearching ? "Scanning..." : "Scan RTSP"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            RTSP Streams Found ({results.length})
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

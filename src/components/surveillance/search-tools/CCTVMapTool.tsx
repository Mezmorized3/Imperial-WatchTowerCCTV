
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

export const CCTVMapTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a location or coordinates",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    // Simulate search process
    toast({
      title: "CCTV Mapping Started",
      description: `Searching cameras in: ${query}`,
    });

    // Create a progress indicator
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 4;
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
        title: "Mapping Complete",
        description: `Found ${mockResults.length} camera areas`,
      });

      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }, 2800);
  };

  // Generate mock results
  const generateMockResults = (location: string): SearchResult[] => {
    const results: SearchResult[] = [];
    const count = Math.floor(Math.random() * 4) + 1;
    
    // Try to extract any coordinates if provided
    let baseLatitude = 0, baseLongitude = 0;
    const coordMatch = location.match(/([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);
    if (coordMatch) {
      baseLatitude = parseFloat(coordMatch[1]);
      baseLongitude = parseFloat(coordMatch[2]);
    } else {
      // Simulate coordinates based on location name
      const locationHash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      baseLatitude = (locationHash % 180) - 90;
      baseLongitude = (locationHash % 360) - 180;
    }

    for (let i = 0; i < count; i++) {
      // Add a small variation to the coordinates for each result
      const latVariation = (Math.random() - 0.5) * 0.1;
      const lngVariation = (Math.random() - 0.5) * 0.1;
      
      const cities = ['New York', 'London', 'Tokyo', 'Berlin', 'Sydney', 'Paris', 'Moscow', 'Beijing'];
      const countries = ['USA', 'UK', 'Japan', 'Germany', 'Australia', 'France', 'Russia', 'China'];
      
      let locationName = location;
      if (!coordMatch) {
        // If it wasn't coordinates, use the provided location name
        locationName = `${location}, ${countries[Math.floor(Math.random() * countries.length)]}`;
      } else {
        // If coordinates were provided, generate a random city/country pair
        const randomIndex = Math.floor(Math.random() * cities.length);
        locationName = `${cities[randomIndex]}, ${countries[randomIndex]}`;
      }
      
      results.push({
        id: `cctvmap-${Date.now()}-${i}`,
        type: 'cctvmap',
        source: 'CCTV Mapper',
        content: locationName,
        timestamp: new Date().toISOString(),
        meta: {
          latitude: (baseLatitude + latVariation).toFixed(6),
          longitude: (baseLongitude + lngVariation).toFixed(6),
          cameras: Math.floor(Math.random() * 50) + 1,
          density: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
          area: `${(Math.random() * 5 + 0.5).toFixed(2)} km²`
        }
      });
    }

    return results;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="City, country or coordinates (e.g., 40.7128,-74.0060)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
        >
          {isSearching ? "Mapping..." : "Map Area"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            Mapped Camera Areas ({results.length})
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
                
                <p className="text-lg font-medium">{result.content}</p>
                
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

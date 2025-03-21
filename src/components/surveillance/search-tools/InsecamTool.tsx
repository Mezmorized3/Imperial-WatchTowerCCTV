
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { getInsecamCountries, searchInsecamByCountry } from '@/utils/osintUtils';

export const InsecamTool: React.FC = () => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [countries, setCountries] = useState<Array<{code: string; country: string; count: number}>>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [insecamPage, setInsecamPage] = useState(1);
  const [totalInsecamPages, setTotalInsecamPages] = useState(1);
  const [insecamCameras, setInsecamCameras] = useState<Array<{
    id: string;
    ip: string;
    port: number;
    previewUrl: string;
    location: string;
    manufacturer?: string;
  }>>([]);

  // Load countries list when component mounts
  useEffect(() => {
    if (countries.length === 0) {
      loadInsecamCountries();
    }
  }, [countries.length]);

  // Load Insecam countries
  const loadInsecamCountries = async () => {
    setIsSearching(true);
    try {
      const countryList = await getInsecamCountries();
      setCountries(countryList);
      if (countryList.length > 0) {
        setSelectedCountry(countryList[0].code);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries list from Insecam",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle searching Insecam by country
  const handleInsecamSearch = async () => {
    if (!selectedCountry) {
      toast({
        title: "Country Required",
        description: "Please select a country to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 5, 95));
    }, 100);
    
    try {
      const result = await searchInsecamByCountry(selectedCountry, insecamPage);
      setInsecamCameras(result.cameras);
      setTotalInsecamPages(result.totalPages);
      
      toast({
        title: "Search Complete",
        description: `Found ${result.cameras.length} cameras in selected country`,
      });
    } catch (error) {
      console.error('Error searching Insecam:', error);
      toast({
        title: "Error",
        description: "Failed to search for cameras by country",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={isSearching}>
          <SelectTrigger className="bg-scanner-dark border-gray-700 text-white flex-1">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.code} value={country.code}>
                {country.country} ({country.count} cameras)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleInsecamSearch} 
          disabled={isSearching || !selectedCountry}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* InsecamOrg results */}
      {insecamCameras.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            Cameras Found in {countries.find(c => c.code === selectedCountry)?.country || selectedCountry}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {insecamCameras.map(camera => (
              <div key={camera.id} className="bg-scanner-dark p-3 rounded border border-gray-700">
                <div className="aspect-video bg-black/30 rounded flex items-center justify-center mb-2 overflow-hidden">
                  <img 
                    src={camera.previewUrl || '/placeholder.svg'} 
                    alt="Camera preview"
                    className="max-w-full max-h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{camera.ip}:{camera.port}</p>
                    <p className="text-xs text-gray-400">{camera.location}</p>
                  </div>
                  {camera.manufacturer && (
                    <Badge variant="outline">{camera.manufacturer}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination for Insecam results */}
          {totalInsecamPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (insecamPage > 1) {
                      setInsecamPage(insecamPage - 1);
                      handleInsecamSearch();
                    }
                  }}
                  disabled={insecamPage === 1 || isSearching}
                >
                  Previous
                </Button>
                <span className="mx-4 flex items-center">
                  Page {insecamPage} of {totalInsecamPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (insecamPage < totalInsecamPages) {
                      setInsecamPage(insecamPage + 1);
                      handleInsecamSearch();
                    }
                  }}
                  disabled={insecamPage === totalInsecamPages || isSearching}
                >
                  Next
                </Button>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

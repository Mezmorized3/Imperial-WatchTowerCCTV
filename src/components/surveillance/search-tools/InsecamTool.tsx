import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Camera, Monitor, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getInsecamCountries, searchInsecamByCountry } from '@/utils/insecamUtils';

export const InsecamTool: React.FC = () => {
  const { toast } = useToast();
  const [countries, setCountries] = useState<Array<{
    code: string;
    country: string;
    count: number;
  }>>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cameras, setCameras] = useState<Array<{
    id: string;
    ip: string;
    port: number;
    previewUrl: string;
    location: string;
    manufacturer?: string;
  }>>([]);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const countryList = await getInsecamCountries();
      setCountries(countryList);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries list",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setCurrentPage(1);
    if (value) {
      searchCameras(value, 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    searchCameras(selectedCountry, page);
  };

  const searchCameras = async (countryCode: string, page: number) => {
    setIsSearching(true);
    setCameras([]);
    
    try {
      const result = await searchInsecamByCountry(countryCode, page);
      setCameras(result.cameras);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      
      toast({
        title: "Search Complete",
        description: `Found ${result.cameras.length} cameras in ${getCountryName(countryCode)}`,
      });
    } catch (error) {
      console.error('Error searching cameras:', error);
      toast({
        title: "Error",
        description: "Failed to search for cameras",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getCountryName = (code: string): string => {
    const country = countries.find(c => c.code === code);
    return country ? country.country : code;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Select
          value={selectedCountry}
          onValueChange={handleCountryChange}
          disabled={isLoadingCountries || isSearching}
        >
          <SelectTrigger className="w-full bg-scanner-dark border-gray-700 text-white">
            <SelectValue placeholder="Select a country to search" />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.code} value={country.code}>
                {country.country} ({country.count.toLocaleString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isSearching ? (
        <div className="text-center py-8">
          <Camera className="animate-pulse h-8 w-8 mx-auto mb-4" />
          <p>Searching for cameras...</p>
        </div>
      ) : cameras.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map(camera => (
              <Card key={camera.id} className="bg-scanner-dark overflow-hidden border-gray-700">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src={camera.previewUrl} 
                    alt={`Camera at ${camera.ip}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                      e.currentTarget.style.opacity = '0.5';
                    }}
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-red-600">Live</Badge>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {camera.manufacturer || 'Unknown Camera'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Globe className="h-3 w-3 mr-1" />
                      {camera.location}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {camera.ip}:{camera.port}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" className="text-xs">
                      View Stream
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isSearching}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center mx-2 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isSearching}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Pagination>
            </div>
          )}
        </>
      ) : selectedCountry ? (
        <div className="text-center py-8 text-gray-400">
          <Camera className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>No cameras found. Try a different country.</p>
        </div>
      ) : null}
    </div>
  );
};

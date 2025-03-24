import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter } from 'lucide-react';
import { CameraResult } from '@/types/scanner';

interface CameraSearchProps {
  onSearch: (filters: any) => void;
  isLoading: boolean;
  totalCameras: number;
  onSelectCamera?: (camera: CameraResult) => void;
  selectedCamera?: CameraResult | null;
}

const CameraSearch: React.FC<CameraSearchProps> = ({
  onSearch,
  isLoading,
  totalCameras,
  onSelectCamera,
  selectedCamera
}) => {
  const [searchType, setSearchType] = useState('ip');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [vulnerableOnly, setVulnerableOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch({
      type: searchType,
      value: searchValue,
      filters: {
        countries: selectedCountries,
        accessibleOnly,
        vulnerableOnly,
        brands: selectedBrands,
        ports: selectedPorts
      }
    });
  };

  const selectCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const eastEuropeanCountries = [
    { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
    { name: 'Russia', code: 'RU', flag: '🇷🇺' },
    { name: 'Georgia', code: 'GE', flag: '🇬🇪' },
    { name: 'Romania', code: 'RO', flag: '🇷🇴' }
  ];

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const renderCountrySelector = () => (
    <div className="flex flex-wrap gap-2">
      {eastEuropeanCountries.map((country) => (
        <Button
          key={country.code}
          variant={selectedCountries.includes(country.name) ? 'default' : 'outline'}
          className={`border-gray-700 hover:bg-scanner-dark-alt ${selectedCountries.includes(country.name) ? 'bg-scanner-primary' : ''}`}
          onClick={() => selectCountry(country.name)}
        >
          {country.flag} {country.name}
        </Button>
      ))}
    </div>
  );

  const renderBrandSelector = () => (
    <div className="flex flex-wrap gap-2">
      {['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha', 'Uniview'].map((brand) => (
        <Button
          key={brand}
          variant={selectedBrands.includes(brand) ? 'default' : 'outline'}
          className={`border-gray-700 hover:bg-scanner-dark-alt ${selectedBrands.includes(brand) ? 'bg-scanner-primary' : ''}`}
          onClick={() => {
            if (selectedBrands.includes(brand)) {
              setSelectedBrands(selectedBrands.filter(b => b !== brand));
            } else {
              setSelectedBrands([...selectedBrands, brand]);
            }
          }}
        >
          {brand}
        </Button>
      ))}
    </div>
  );

  const renderPortSelector = () => (
    <div className="flex flex-wrap gap-2">
      {['80', '554', '8000', '8080', '37777'].map((port) => (
        <Button
          key={port}
          variant={selectedPorts.includes(port) ? 'default' : 'outline'}
          className={`border-gray-700 hover:bg-scanner-dark-alt ${selectedPorts.includes(port) ? 'bg-scanner-primary' : ''}`}
          onClick={() => {
            if (selectedPorts.includes(port)) {
              setSelectedPorts(selectedPorts.filter(p => p !== port));
            } else {
              setSelectedPorts([...selectedPorts, port]);
            }
          }}
        >
          {port}
        </Button>
      ))}
    </div>
  );

  const renderCameraLocation = (camera: CameraResult) => {
    if (!camera) return "Unknown location";
    
    const location = camera.location;
    
    if (!location || (!location.country && !location.city)) {
      return "Unknown location";
    }
    
    return [location.city, location.country].filter(Boolean).join(', ');
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[120px] bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Search Type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="ip">IP Address</SelectItem>
              <SelectItem value="range">IP Range</SelectItem>
              <SelectItem value="country">Country</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder={`Enter ${searchType === 'ip' ? 'IP Address' : searchType === 'range' ? 'IP Range' : 'Country'}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
          <Button onClick={handleSearch} disabled={isLoading} className="bg-scanner-primary">
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Total Cameras Found: {totalCameras}
          </p>
          <Button variant="outline" size="sm" onClick={toggleFilter} className="border-gray-700 hover:bg-scanner-dark-alt">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        {isFilterOpen && (
          <div className="space-y-4 p-4 bg-scanner-dark border border-gray-700 rounded-md">
            <div className="space-y-2">
              <Label>Country</Label>
              {renderCountrySelector()}
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              {renderBrandSelector()}
            </div>
            <div className="space-y-2">
              <Label>Port</Label>
              {renderPortSelector()}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accessible"
                checked={accessibleOnly}
                onCheckedChange={(checked) => setAccessibleOnly(!!checked)}
                className="peer h-5 w-5 bg-scanner-dark-alt border-gray-700"
              />
              <Label htmlFor="accessible" className="text-sm text-gray-400">
                Accessible Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vulnerable"
                checked={vulnerableOnly}
                onCheckedChange={(checked) => setVulnerableOnly(!!checked)}
                className="peer h-5 w-5 bg-scanner-dark-alt border-gray-700"
              />
              <Label htmlFor="vulnerable" className="text-sm text-gray-400">
                Vulnerable Only
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraSearch;

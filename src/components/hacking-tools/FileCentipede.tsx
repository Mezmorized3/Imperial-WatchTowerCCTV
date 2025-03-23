
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Globe, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DETAILED_COUNTRY_IP_RANGES } from '@/utils/mockData';
import { calculateIpsInRange } from '@/utils/ipRangeUtils';

const FileCentipede: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [rangeDetails, setRangeDetails] = useState<{
    range: string;
    description: string;
    assignDate: string;
    ipCount: number;
  } | null>(null);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSelectedRange("");
    setRangeDetails(null);
  };

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    
    // Find the selected range details
    const countryRanges = DETAILED_COUNTRY_IP_RANGES[selectedCountry as keyof typeof DETAILED_COUNTRY_IP_RANGES] || [];
    const rangeInfo = countryRanges.find(r => r.range === range);
    
    if (rangeInfo) {
      setRangeDetails({
        ...rangeInfo,
        ipCount: calculateIpsInRange(range)
      });
    }
  };

  const handleToolClick = (toolName: string) => {
    if (rangeDetails) {
      toast({
        title: `${toolName} Selected`,
        description: `Target range: ${rangeDetails.range} (${rangeDetails.ipCount.toLocaleString()} IPs)`,
      });
    } else {
      toast({
        title: "Tool Selected",
        description: `${toolName} will be implemented soon.`,
      });
    }
  };

  const countryCodes = Object.keys(DETAILED_COUNTRY_IP_RANGES);
  const countryNames: Record<string, string> = {
    ge: "Georgia",
    ro: "Romania",
    ua: "Ukraine",
    ru: "Russia"
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 text-scanner-primary mr-2" />
          FileCentipede
        </CardTitle>
        <CardDescription className="text-gray-400">
          Advanced Download Manager and IP Range Explorer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-gray-300">Country</Label>
          <Select value={selectedCountry} onValueChange={handleCountrySelect}>
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              {countryCodes.map(code => (
                <SelectItem key={code} value={code}>{countryNames[code] || code.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCountry && (
            <>
              <Label className="text-gray-300">IP Range</Label>
              <Select 
                value={selectedRange} 
                onValueChange={handleRangeSelect}
                disabled={!selectedCountry}
              >
                <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                  <SelectValue placeholder="Select IP range" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  {DETAILED_COUNTRY_IP_RANGES[selectedCountry as keyof typeof DETAILED_COUNTRY_IP_RANGES]?.map(range => (
                    <SelectItem key={range.range} value={range.range}>
                      {range.range} - {range.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {rangeDetails && (
            <div className="mt-4 p-3 rounded bg-scanner-dark-alt border border-gray-700">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Globe className="h-4 w-4 mr-1 text-scanner-primary" />
                Range Details
              </h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">CIDR:</span> {rangeDetails.range}</p>
                <p><span className="text-gray-400">Description:</span> {rangeDetails.description}</p>
                <p><span className="text-gray-400">Assigned:</span> {rangeDetails.assignDate}</p>
                <p><span className="text-gray-400">IP Count:</span> {rangeDetails.ipCount.toLocaleString()}</p>
              </div>
              <Input 
                value={`country:${countryNames[selectedCountry]} range:${rangeDetails.range}`}
                className="mt-3 bg-scanner-dark border-gray-700 text-xs"
                readOnly
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={() => handleToolClick('IP Range Explorer')}
          >
            <Search className="h-4 w-4 mr-2" />
            Explore Range
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={() => handleToolClick('FileCentipede')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={() => window.open('https://github.com/filecxx/FileCentipede', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCentipede;

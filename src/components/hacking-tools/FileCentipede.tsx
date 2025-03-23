import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Globe, Search, Copy, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DETAILED_COUNTRY_IP_RANGES } from '@/utils/mockData';
import { calculateIpsInRange, getRandomIpInRange } from '@/utils/ipRangeUtils';

const FileCentipede: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [rangeDetails, setRangeDetails] = useState<{
    range: string;
    description: string;
    assignDate: string;
    ipCount: number;
    randomIpSample?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSelectedRange("");
    setRangeDetails(null);
  };

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    
    const countryRanges = DETAILED_COUNTRY_IP_RANGES[selectedCountry as keyof typeof DETAILED_COUNTRY_IP_RANGES] || [];
    const rangeInfo = countryRanges.find(r => r.range === range);
    
    if (rangeInfo) {
      const randomIp = getRandomIpInRange(range);
      
      setRangeDetails({
        ...rangeInfo,
        ipCount: calculateIpsInRange(range),
        randomIpSample: randomIp
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Range information has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const countryCodes = Object.keys(DETAILED_COUNTRY_IP_RANGES);
  const countryNames: Record<string, string> = {
    ge: "Georgia",
    ro: "Romania",
    ua: "Ukraine",
    ru: "Russia"
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg hover:shadow-scanner-primary/5 transition-all">
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
                <SelectItem key={code} value={code} className="flex items-center">
                  {countryNames[code] || code.toUpperCase()}
                </SelectItem>
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
                      <div className="truncate">
                        {range.range} - {range.description}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {rangeDetails && (
            <div className="mt-4 p-3 rounded bg-scanner-dark-alt border border-gray-700 animate-in fade-in-50 duration-200">
              <h4 className="text-sm font-medium mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-scanner-primary" />
                  Range Details
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 p-1 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(`Country: ${countryNames[selectedCountry]}, Range: ${rangeDetails.range}, Description: ${rangeDetails.description}, IPs: ${rangeDetails.ipCount.toLocaleString()}`)}
                >
                  {copied ? 
                    <span className="text-xs text-green-400">Copied!</span> : 
                    <Copy className="h-3.5 w-3.5" />
                  }
                </Button>
              </h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">CIDR:</span> {rangeDetails.range}</p>
                <p><span className="text-gray-400">Description:</span> {rangeDetails.description}</p>
                <p><span className="text-gray-400">Assigned:</span> {rangeDetails.assignDate}</p>
                <p><span className="text-gray-400">IP Count:</span> {rangeDetails.ipCount.toLocaleString()}</p>
                {rangeDetails.randomIpSample && (
                  <p><span className="text-gray-400">Sample IP:</span> <span className="text-scanner-primary">{rangeDetails.randomIpSample}</span></p>
                )}
              </div>
              <div className="mt-3 bg-scanner-dark rounded p-2 border border-gray-700 flex items-center justify-between">
                <code className="text-xs text-scanner-primary/80">
                  country:{countryNames[selectedCountry]} range:{rangeDetails.range}
                </code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 p-1 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(`country:${countryNames[selectedCountry]} range:${rangeDetails.range}`)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt hover:text-scanner-primary transition-colors"
            onClick={() => handleToolClick('IP Range Explorer')}
          >
            <Search className="h-4 w-4 mr-2" />
            Explore Range
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-scanner-dark-alt hover:text-scanner-primary transition-colors"
            onClick={() => handleToolClick('FileCentipede')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        
        {selectedCountry && rangeDetails && (
          <div className="mt-2 text-xs text-right">
            <Link 
              to={`/imperial-scanner?country=${selectedCountry}&range=${encodeURIComponent(rangeDetails.range)}`}
              className="text-scanner-primary/70 hover:text-scanner-primary flex items-center justify-end"
            >
              Scan this range
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileCentipede;

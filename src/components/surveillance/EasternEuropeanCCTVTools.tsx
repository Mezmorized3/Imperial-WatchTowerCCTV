
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveCCTVScanner } from './search-tools/ComprehensiveCCTVScanner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Globe, AlertCircle, Crosshair, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const targetCountries = [
  {
    code: 'ua',
    name: 'Ukraine',
    description: 'Ukrainian CCTV systems and security cameras',
    count: 2347,
    icon: '🇺🇦',
    color: 'bg-blue-900/50 text-blue-400',
    ipRanges: ['31.128.0.0/11', '37.52.0.0/14', '46.119.0.0/16', '77.120.0.0/13', '193.108.0.0/16'],
    cities: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv']
  },
  {
    code: 'ru',
    name: 'Russia',
    description: 'Russian security and surveillance camera networks',
    count: 4126,
    icon: '🇷🇺',
    color: 'bg-red-900/50 text-red-400',
    ipRanges: ['5.136.0.0/13', '31.13.0.0/16', '37.9.0.0/16', '45.10.0.0/16', '77.37.0.0/16'],
    cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan']
  },
  {
    code: 'ge',
    name: 'Georgia',
    description: 'Georgian traffic and security camera infrastructure',
    count: 986,
    icon: '🇬🇪',
    color: 'bg-orange-900/50 text-orange-400',
    ipRanges: ['31.146.0.0/16', '37.232.0.0/16', '46.49.0.0/16', '77.92.0.0/16', '82.211.0.0/16'],
    cities: ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori']
  },
  {
    code: 'ro',
    name: 'Romania',
    description: 'Romanian surveillance systems and networks',
    count: 1532,
    icon: '🇷🇴',
    color: 'bg-yellow-900/50 text-yellow-400',
    ipRanges: ['37.120.0.0/16', '46.214.0.0/16', '77.81.0.0/16', '79.112.0.0/16', '89.120.0.0/16'],
    cities: ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța']
  }
];

const EasternEuropeanCCTVTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const { toast } = useToast();
  
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setActiveTab('scanner');
    
    const country = targetCountries.find(c => c.code === countryCode);
    if (country) {
      toast({
        title: `${country.name} Selected`,
        description: `Targeting ${country.name} camera networks and systems`,
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-scanner-primary" />
            Eastern European CCTV Systems
          </CardTitle>
          <CardDescription>
            Specialized tools for analyzing and accessing surveillance systems in Eastern Europe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Country Overview</TabsTrigger>
              <TabsTrigger value="scanner">CCTV Scanner</TabsTrigger>
              <TabsTrigger value="analysis">Network Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targetCountries.map((country) => (
                  <Card 
                    key={country.code}
                    className="bg-scanner-dark border-gray-700 hover:border-scanner-primary/50 transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <span className="mr-2">{country.icon}</span>
                            {country.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{country.description}</p>
                        </div>
                        <Badge className={country.color}>
                          {country.count.toLocaleString()} cameras
                        </Badge>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Top IP Ranges:</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {country.ipRanges.slice(0, 3).map((range, i) => (
                              <li key={i} className="font-mono">{range}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Major Cities:</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {country.cities.slice(0, 3).map((city, i) => (
                              <li key={i}>{city}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-gray-700 hover:bg-scanner-dark-alt hover:text-scanner-primary text-sm"
                          onClick={() => handleCountrySelect(country.code)}
                        >
                          <Crosshair className="h-3.5 w-3.5 mr-1.5" />
                          Target {country.name}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-scanner-dark border-gray-700 mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 text-scanner-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Important Information</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        These tools are provided for educational purposes only. Always ensure you have proper authorization before accessing any surveillance systems. Unauthorized access to camera systems may be illegal in many jurisdictions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scanner">
              <ComprehensiveCCTVScanner />
            </TabsContent>
            
            <TabsContent value="analysis">
              <Card className="bg-scanner-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-md flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-scanner-primary" />
                    Camera Network Analysis
                  </CardTitle>
                  <CardDescription>
                    Advanced analysis of surveillance infrastructure in Eastern European countries
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card className="bg-scanner-dark-alt border-gray-700">
                      <CardContent className="p-3">
                        <h4 className="text-sm font-medium mb-2">Camera Brands Distribution</h4>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Hikvision</span>
                              <span>42%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-red-600" style={{ width: '42%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Dahua</span>
                              <span>28%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: '28%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Axis</span>
                              <span>15%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-green-600" style={{ width: '15%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Other</span>
                              <span>15%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-gray-600" style={{ width: '15%' }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-scanner-dark-alt border-gray-700">
                      <CardContent className="p-3">
                        <h4 className="text-sm font-medium mb-2">Vulnerability Analysis</h4>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Default Credentials</span>
                              <span>35%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-red-600" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Outdated Firmware</span>
                              <span>48%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-orange-600" style={{ width: '48%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Unencrypted Streams</span>
                              <span>62%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-yellow-600" style={{ width: '62%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Web Interface Issues</span>
                              <span>27%</span>
                            </div>
                            <div className="h-2 bg-scanner-dark rounded overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: '27%' }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-scanner-dark-alt border-gray-700">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium mb-3">Country Comparison</h4>
                      <div className="grid grid-cols-4 gap-1 text-center text-xs">
                        <div className="p-2">Country</div>
                        <div className="p-2">Camera Density</div>
                        <div className="p-2">Vulnerability Rate</div>
                        <div className="p-2">Access Success</div>
                      </div>
                      
                      {targetCountries.map((country) => (
                        <div key={country.code} className="grid grid-cols-4 gap-1 text-center text-xs border-t border-gray-700">
                          <div className="p-2 flex items-center justify-center">
                            <span className="mr-1.5">{country.icon}</span>
                            {country.name}
                          </div>
                          <div className="p-2">
                            {country.code === 'ua' ? 'Medium' : 
                             country.code === 'ru' ? 'High' : 
                             country.code === 'ge' ? 'Low' : 'Medium'}
                          </div>
                          <div className="p-2">
                            <Badge className={`${
                              country.code === 'ua' ? 'bg-yellow-900/40 text-yellow-400' : 
                              country.code === 'ru' ? 'bg-red-900/40 text-red-400' : 
                              country.code === 'ge' ? 'bg-green-900/40 text-green-400' : 
                              'bg-blue-900/40 text-blue-400'
                            }`}>
                              {country.code === 'ua' ? '38%' : 
                               country.code === 'ru' ? '46%' : 
                               country.code === 'ge' ? '22%' : '31%'}
                            </Badge>
                          </div>
                          <div className="p-2">
                            {country.code === 'ua' ? 'Medium (42%)' : 
                             country.code === 'ru' ? 'High (57%)' : 
                             country.code === 'ge' ? 'Low (28%)' : 'Medium (39%)'}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      className="border-gray-700 hover:bg-scanner-dark-alt hover:text-scanner-primary"
                      onClick={() => setActiveTab('scanner')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Launch Scanner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EasternEuropeanCCTVTools;

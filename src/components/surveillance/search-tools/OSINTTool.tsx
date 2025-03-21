
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Globe, User, Mail, Calendar, ExternalLink } from 'lucide-react';
import { executeOSINT } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export const OSINTTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('domain');
  const [depth, setDepth] = useState('medium');
  const [scope, setScope] = useState<string[]>(['all']);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const scopeOptions = [
    { id: 'all', label: 'All Data Sources' },
    { id: 'email', label: 'Email Addresses' },
    { id: 'social', label: 'Social Media Profiles' },
    { id: 'domain', label: 'Domain Information' },
    { id: 'breaches', label: 'Data Breaches' },
  ];

  const handleScopeChange = (scopeId: string, checked: boolean) => {
    if (scopeId === 'all') {
      setScope(checked ? ['all'] : []);
    } else {
      // If 'all' is selected and user selects something else, remove 'all'
      const newScope = scope.filter(s => s !== 'all');
      
      if (checked) {
        setScope([...newScope, scopeId]);
      } else {
        setScope(newScope.filter(s => s !== scopeId));
      }
    }
  };

  const handleSearch = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a target (person, email, domain, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    if (scope.length === 0) {
      toast({
        title: "Scope Required",
        description: "Please select at least one data source to search",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    toast({
      title: "OSINT Search Initiated",
      description: `Searching for information about ${target}...`,
    });
    
    try {
      const searchResults = await executeOSINT({
        target,
        mode,
        depth,
        scope
      });
      
      setResults(searchResults);
      toast({
        title: "Search Complete",
        description: searchResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "OSINT search completed successfully",
      });
    } catch (error) {
      console.error('OSINT search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter target (person, email, domain, IP, etc.)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !target || scope.length === 0}
            className="w-full"
          >
            {isSearching ? (
              <>Searching...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Gather Intelligence
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mode-select">Target Type</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person">Person/Username</SelectItem>
                  <SelectItem value="domain">Domain/Website</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Type of target to search for</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depth-select">Search Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger id="depth-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select search depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (Faster)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="deep">Deep (Thorough)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Deeper searches find more but take longer</p>
            </div>
            
            <div className="sm:col-span-2">
              <Label className="block mb-2">Data Sources</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {scopeOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`scope-${option.id}`} 
                      checked={scope.includes(option.id)}
                      onCheckedChange={(checked) => handleScopeChange(option.id, checked as boolean)}
                    />
                    <Label htmlFor={`scope-${option.id}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && results.result && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5" />
              OSINT Results for {results.target}
            </h3>
            
            <Tabs defaultValue={Object.keys(results.result)[0] || 'emails'} className="w-full">
              <TabsList className="w-full">
                {results.result.emails && (
                  <TabsTrigger value="emails" className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Emails ({results.result.emails.length})
                  </TabsTrigger>
                )}
                {results.result.socialProfiles && (
                  <TabsTrigger value="social" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Social Profiles ({results.result.socialProfiles.length})
                  </TabsTrigger>
                )}
                {results.result.domainInfo && (
                  <TabsTrigger value="domain" className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Domain
                  </TabsTrigger>
                )}
                {results.result.breaches !== undefined && (
                  <TabsTrigger value="breaches" className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Breaches
                  </TabsTrigger>
                )}
              </TabsList>
              
              {results.result.emails && (
                <TabsContent value="emails" className="pt-4">
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-2">
                      {results.result.emails.map((email: string, index: number) => (
                        <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700 flex items-center">
                          <Mail className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="font-mono">{email}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              )}
              
              {results.result.socialProfiles && (
                <TabsContent value="social" className="pt-4">
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-2">
                      {results.result.socialProfiles.map((profile: any, index: number) => (
                        <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-blue-400 mr-2" />
                              <span className="font-medium">{profile.platform}</span>
                            </div>
                            {profile.verified && (
                              <Badge className="bg-blue-600">Verified</Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <span className="text-gray-400 mr-2">Username:</span>
                            <span className="font-mono">{profile.username}</span>
                          </div>
                          <div className="mt-1 flex items-center text-sm">
                            <ExternalLink className="h-3 w-3 text-gray-400 mr-2" />
                            <a href="#" className="text-blue-400 hover:underline">{profile.url}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              )}
              
              {results.result.domainInfo && (
                <TabsContent value="domain" className="pt-4">
                  <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                    <h4 className="text-md font-medium mb-3 flex items-center">
                      <Globe className="h-4 w-4 text-blue-400 mr-2" />
                      Domain Information
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Domain: </span>
                        <span className="font-mono">{results.result.domainInfo.domain}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Registrar: </span>
                        <span>{results.result.domainInfo.registrar}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Creation Date: </span>
                        <span>{results.result.domainInfo.created}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Expiration Date: </span>
                        <span>{results.result.domainInfo.expires}</span>
                      </div>
                    </div>
                    
                    {results.result.domainInfo.nameservers && results.result.domainInfo.nameservers.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-400">Nameservers: </span>
                        <div className="mt-1 space-y-1">
                          {results.result.domainInfo.nameservers.map((ns: string, i: number) => (
                            <div key={i} className="font-mono text-sm ml-4">{ns}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
              
              {results.result.breaches !== undefined && (
                <TabsContent value="breaches" className="pt-4">
                  <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                        Data Breaches
                      </h4>
                      <Badge className={results.result.breaches > 0 ? 'bg-yellow-600' : 'bg-blue-600'}>
                        {results.result.breaches} {results.result.breaches === 1 ? 'Breach' : 'Breaches'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 text-sm">
                      {results.result.breaches > 0 ? (
                        <p>The target appears in {results.result.breaches} data {results.result.breaches === 1 ? 'breach' : 'breaches'}. This may include leaked passwords, personal information, or other sensitive data.</p>
                      ) : (
                        <p>No data breaches were found for this target. This is a good sign, but does not guarantee complete security.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Additional icon imports
import { AlertCircle } from 'lucide-react';

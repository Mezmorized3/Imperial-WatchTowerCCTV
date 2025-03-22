
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Key, Shield, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkVirusTotal, checkAbuseIPDB } from '@/utils/threatApiUtils';
import { getComprehensiveThreatIntel } from '@/utils/threatIntelligence';

const ThreatIntelligence = () => {
  const [target, setTarget] = useState('');
  const [searching, setSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP",
        variant: "destructive"
      });
      return;
    }

    setSearching(true);
    setProgress(0);
    setResults(null);

    toast({
      title: "Threat Intelligence Search",
      description: `Searching threat intelligence for ${target}...`
    });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // In a real implementation, this would use the GitHub tools
      // For now we'll use our mocked implementation that will be replaced
      const threatIntel = await getComprehensiveThreatIntel(target);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(threatIntel);
      
      toast({
        title: "Search Complete",
        description: `Threat intelligence gathered for ${target}`
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center">
            <Key className="mr-2 text-purple-500" />
            Threat Intelligence
          </h2>
          <p className="text-gray-400">
            Search threat intelligence databases for information about malicious IPs and domains
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter IP address"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-scanner-dark border-gray-700"
            />
            <Button 
              onClick={handleSearch} 
              disabled={searching}
              className="whitespace-nowrap"
            >
              {searching ? "Searching..." : "Search Threats"}
            </Button>
          </div>
          
          {searching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Searching threat intelligence...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {results && (
            <div className="space-y-4">
              <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">IP Reputation</h3>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    results.ipReputation > 70 ? 'bg-green-900/50 text-green-300' :
                    results.ipReputation > 40 ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-red-900/50 text-red-300'
                  }`}>
                    {results.ipReputation > 70 ? 'Good' :
                     results.ipReputation > 40 ? 'Suspicious' : 'Malicious'}
                  </div>
                </div>
                
                <div className="mt-2">
                  <Progress 
                    value={results.ipReputation} 
                    className="w-full"
                    indicatorClassName={`${
                      results.ipReputation > 70 ? 'bg-green-500' :
                      results.ipReputation > 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Malicious</span>
                    <span>Reputation Score: {results.ipReputation}</span>
                    <span>Good</span>
                  </div>
                </div>
              </div>
              
              {results.lastReportedMalicious && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                    <p className="text-sm text-gray-400">Last Reported Malicious</p>
                    <p>{new Date(results.lastReportedMalicious).toLocaleString()}</p>
                  </div>
                  
                  <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                    <p className="text-sm text-gray-400">First Seen</p>
                    <p>{results.firstSeen ? new Date(results.firstSeen).toLocaleString() : 'Unknown'}</p>
                  </div>
                </div>
              )}
              
              {results.associatedMalware && results.associatedMalware.length > 0 && (
                <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Associated Malware</p>
                  <div className="flex flex-wrap gap-2">
                    {results.associatedMalware.map((malware: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs">
                        {malware}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {results.tags && results.tags.length > 0 && (
                <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {results.tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-scanner-dark-alt text-gray-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {results.reportedBy && results.reportedBy.length > 0 && (
                <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Reported By</p>
                  <div className="space-y-1">
                    {results.reportedBy.map((reporter: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>{reporter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">Intelligence Source</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Confidence: {results.confidenceScore}%
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  {results.source === 'virustotal' ? 'VirusTotal' :
                   results.source === 'abuseipdb' ? 'AbuseIPDB' :
                   results.source === 'threatfox' ? 'ThreatFox' : 'Multiple Sources'}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatIntelligence;

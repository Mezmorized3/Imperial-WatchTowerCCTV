
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, AlertCircle, Clock, Tag, Search } from 'lucide-react';
import { getComprehensiveThreatIntel } from '@/utils/threatIntelligence';
import { ThreatIntelData } from '@/types/scanner';
import { useToast } from '@/components/ui/use-toast';

interface ThreatIntelligenceProps {
  // Add any props if needed
}

export const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = () => {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [threatData, setThreatData] = useState<ThreatIntelData | null>(null);

  const handleSearch = async () => {
    if (!ipAddress.trim()) {
      toast({
        title: 'Missing IP Address',
        description: 'Please enter an IP address to analyze.',
        variant: 'destructive',
      });
      return;
    }

    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      toast({
        title: 'Invalid IP Address',
        description: 'Please enter a valid IPv4 address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const result = await getComprehensiveThreatIntel(ipAddress);
      setThreatData(result);
      toast({
        title: 'Analysis Complete',
        description: 'Threat intelligence data retrieved successfully.',
      });
    } catch (error) {
      console.error('Error retrieving threat intelligence:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to retrieve threat intelligence. Please try again.',
        variant: 'destructive',
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const getReputationColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'bg-blue-500';
    if (score >= 50) return 'bg-blue-400';
    if (score >= 25) return 'bg-blue-300';
    return 'bg-blue-200';
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Shield className="mr-2 h-6 w-6" />
            Threat Intelligence
          </CardTitle>
          <CardDescription>
            Analyze IP addresses for malicious activity and threat intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 gap-2">
              <Input
                placeholder="Enter IP address (e.g. 192.168.1.1)"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="md:w-1/4"
              >
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </Button>
            </div>

            {isLoading && (
              <div className="my-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing threat intelligence...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {threatData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Threat Intelligence Report
            </CardTitle>
            <CardDescription>
              IP Address: {ipAddress}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">IP Reputation</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">{threatData.ipReputation}/100</span>
                      <div className="flex-1 mx-2">
                        <Progress 
                          value={threatData.ipReputation} 
                          className="h-2.5"
                        />
                      </div>
                    </div>
                    <div className="text-sm mt-1 text-gray-500">
                      {threatData.ipReputation < 50 ? 'Potentially malicious' : 'Good reputation'}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Confidence Score</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">{threatData.confidenceScore}%</span>
                      <div className="flex-1 mx-2">
                        <Progress 
                          value={threatData.confidenceScore} 
                          className="h-2.5"
                        />
                      </div>
                    </div>
                    <div className="text-sm mt-1 text-gray-500">
                      Data source: {threatData.source}
                    </div>
                  </div>
                </div>

                {threatData.lastReportedMalicious && (
                  <div className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <span className="font-medium">Last reported malicious: </span>
                      <span>{new Date(threatData.lastReportedMalicious).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {threatData.tags && threatData.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Associated Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {threatData.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                {threatData.associatedMalware && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Associated Malware
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {threatData.associatedMalware.map((malware, i) => (
                        <li key={i}>{malware}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {threatData.reportedBy && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Reported By</h3>
                    <div className="flex flex-wrap gap-2">
                      {threatData.reportedBy.map((reporter, i) => (
                        <Badge key={i} variant="outline">{reporter}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-2">Source Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-gray-500">Source:</span>
                      <span className="font-medium">{threatData.source}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-gray-500">Confidence:</span>
                      <span className="font-medium">{threatData.confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 mt-4">
                {threatData.firstSeen && (
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-medium">First seen: </span>
                      <span>{new Date(threatData.firstSeen).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                
                {threatData.lastReportedMalicious && (
                  <div className="flex items-center space-x-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <span className="font-medium">Last malicious activity: </span>
                      <span>{new Date(threatData.lastReportedMalicious).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  <p>Historical data is limited in this version. For full historical data, connect to a threat intelligence API.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-sm text-gray-500">
              Powered by Imperial Shield Intelligence
            </div>
            <Button variant="outline" size="sm">
              Export Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ThreatIntelligence;

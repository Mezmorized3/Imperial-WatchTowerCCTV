
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { analyzeWebsite } from '@/utils/osintUtils';

export const WebCheckTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [webCheckResults, setWebCheckResults] = useState<{
    dns?: Array<{type: string, value: string}>;
    headers?: Record<string, string>;
    technologies?: string[];
    securityHeaders?: Array<{header: string, value: string | null, status: 'good' | 'warning' | 'bad'}>;
    certificates?: {
      issuer: string;
      validFrom: string;
      validTo: string;
      daysRemaining: number;
    } | null;
    ports?: Array<{port: number, service: string, state: 'open' | 'closed' | 'filtered'}>;
  }>({});

  // Handle website analysis
  const handleWebsiteAnalysis = async () => {
    if (!query.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setWebCheckResults({});
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 0.5, 95));
    }, 100);
    
    try {
      const result = await analyzeWebsite(query);
      setWebCheckResults(result);
      
      toast({
        title: "Analysis Complete",
        description: `Website security analysis for ${query} is complete`,
      });
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Error",
        description: "Failed to analyze website",
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
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter website URL to analyze (e.g., example.com)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleWebsiteAnalysis} 
          disabled={isSearching}
        >
          {isSearching ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* Web Check Results */}
      {webCheckResults.dns && (
        <div className="mt-4 space-y-6">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            Analysis for {query}
          </h3>
          
          {/* DNS Records */}
          <div className="space-y-2">
            <h4 className="text-md font-medium">DNS Records</h4>
            <div className="bg-scanner-dark rounded p-3 border border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                {webCheckResults.dns.map((record, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-400">{record.type}:</span> {record.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Security Headers */}
          {webCheckResults.securityHeaders && (
            <div className="space-y-2">
              <h4 className="text-md font-medium">Security Headers</h4>
              <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                {webCheckResults.securityHeaders.map((header, index) => (
                  <div key={index} className="mb-2 pb-2 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{header.header}</span>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${header.status === 'good' ? 'border-green-500 text-green-500' : ''}
                          ${header.status === 'warning' ? 'border-yellow-500 text-yellow-500' : ''}
                          ${header.status === 'bad' ? 'border-red-500 text-red-500' : ''}
                        `}
                      >
                        {header.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {header.value || 'Not set'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Technologies */}
          {webCheckResults.technologies && (
            <div className="space-y-2">
              <h4 className="text-md font-medium">Technologies</h4>
              <div className="bg-scanner-dark rounded p-3 border border-gray-700 flex flex-wrap gap-2">
                {webCheckResults.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Open Ports */}
          {webCheckResults.ports && (
            <div className="space-y-2">
              <h4 className="text-md font-medium">Ports</h4>
              <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                <div className="grid grid-cols-3 gap-2">
                  {webCheckResults.ports.map((port, index) => (
                    <div key={index} className="text-sm">
                      <span className={`
                        ${port.state === 'open' ? 'text-green-500' : ''}
                        ${port.state === 'closed' ? 'text-gray-500' : ''}
                        ${port.state === 'filtered' ? 'text-yellow-500' : ''}
                      `}>
                        {port.port}/{port.service}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">({port.state})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* SSL Certificate */}
          {webCheckResults.certificates && (
            <div className="space-y-2">
              <h4 className="text-md font-medium">SSL Certificate</h4>
              <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-gray-400">Issuer:</span> {webCheckResults.certificates.issuer}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Days Remaining:</span> {webCheckResults.certificates.daysRemaining}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Valid From:</span> {new Date(webCheckResults.certificates.validFrom).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Valid To:</span> {new Date(webCheckResults.certificates.validTo).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

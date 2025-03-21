
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Shield, Database, Server, Code } from 'lucide-react';
import { analyzeWebsite } from '@/utils/networkUtils';

export const WebCheckTool: React.FC = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Handle website analysis
  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "Empty URL",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      const results = await analyzeWebsite(url);
      setAnalysisResults(results);
      
      toast({
        title: "Analysis Complete",
        description: `Completed security analysis for ${url}`,
      });
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the website",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter website URL (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      
      {/* Web Analysis Results */}
      {analysisResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* DNS Information */}
          <div className="bg-scanner-dark p-4 rounded border border-gray-700">
            <h3 className="flex items-center text-lg font-medium mb-3">
              <Database className="mr-2 h-5 w-5" /> DNS Records
            </h3>
            <div className="space-y-2">
              {analysisResults.dns.map((record: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-mono">{record.type}</span>
                  <span className="text-gray-300">{record.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Security Headers */}
          <div className="bg-scanner-dark p-4 rounded border border-gray-700">
            <h3 className="flex items-center text-lg font-medium mb-3">
              <Shield className="mr-2 h-5 w-5" /> Security Headers
            </h3>
            <div className="space-y-2">
              {analysisResults.securityHeaders.map((header: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-mono">{header.header}</span>
                  <span className={
                    header.status === 'good' ? 'text-green-400' : 
                    header.status === 'warning' ? 'text-yellow-400' : 
                    'text-red-400'
                  }>
                    {header.value || 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Technologies */}
          <div className="bg-scanner-dark p-4 rounded border border-gray-700">
            <h3 className="flex items-center text-lg font-medium mb-3">
              <Code className="mr-2 h-5 w-5" /> Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResults.technologies.map((tech: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Open Ports */}
          <div className="bg-scanner-dark p-4 rounded border border-gray-700">
            <h3 className="flex items-center text-lg font-medium mb-3">
              <Server className="mr-2 h-5 w-5" /> Open Ports
            </h3>
            <div className="space-y-2">
              {analysisResults.ports
                .filter((port: any) => port.state === 'open')
                .map((port: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-mono">Port {port.port}</span>
                  <span className="text-gray-300">{port.service}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* SSL Certificate */}
          {analysisResults.certificates && (
            <div className="bg-scanner-dark p-4 rounded border border-gray-700 md:col-span-2">
              <h3 className="flex items-center text-lg font-medium mb-3">
                <Shield className="mr-2 h-5 w-5" /> SSL Certificate
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mb-1">Issuer</p>
                  <p className="text-gray-300">{analysisResults.certificates.issuer}</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Valid Until</p>
                  <p className="text-gray-300">{new Date(analysisResults.certificates.validTo).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm mb-1">Days Remaining</p>
                  <p className={
                    analysisResults.certificates.daysRemaining > 30 ? 'text-green-400' : 
                    analysisResults.certificates.daysRemaining > 7 ? 'text-yellow-400' : 
                    'text-red-400'
                  }>
                    {analysisResults.certificates.daysRemaining} days
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Lock, FileWarning, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeFirmware } from '@/utils/threat/firmwareAnalyzer';

const FirmwareAnalysis = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const commonManufacturers = [
    'Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha', 
    'Uniview', 'Vivotek', 'Panasonic', 'Sony', 'IDIS'
  ];

  const handleAnalyze = async () => {
    if (!manufacturer || !model || !firmwareVersion) {
      toast({
        title: "Missing Information",
        description: "Please provide manufacturer, model, and firmware version",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    setProgress(0);
    setAnalysisResult(null);

    toast({
      title: "Analysis Started",
      description: "Analyzing firmware vulnerabilities and security..."
    });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 200);

      // In a real implementation, this would use one of the GitHub tools
      // For now, we'll use our utility that will be replaced with real implementation
      const result = await analyzeFirmware(manufacturer, model, firmwareVersion);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: result.outdated 
          ? `Firmware is outdated with ${result.knownVulnerabilities.length} vulnerabilities found` 
          : "Firmware analysis complete"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center">
            <Lock className="mr-2 text-blue-500" />
            Firmware Analysis
          </h2>
          <p className="text-gray-400">
            Analyze camera firmware for vulnerabilities and security issues
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Manufacturer</label>
                <Select onValueChange={(value) => setManufacturer(value)}>
                  <SelectTrigger className="bg-scanner-dark border-gray-700">
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonManufacturers.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Model</label>
                <Input
                  placeholder="Camera model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-scanner-dark border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Firmware Version</label>
                <Input
                  placeholder="e.g. 1.2.3"
                  value={firmwareVersion}
                  onChange={(e) => setFirmwareVersion(e.target.value)}
                  className="bg-scanner-dark border-gray-700"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={analyzing}
              className="w-full"
            >
              {analyzing ? "Analyzing..." : "Analyze Firmware"}
            </Button>
          </div>
          
          {analyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing firmware...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {analysisResult && (
            <div className="space-y-4 p-4 bg-scanner-dark rounded-md border border-gray-700">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">Analysis Results</h3>
                <div className={`flex items-center ${
                  analysisResult.outdated ? 'text-red-500' : 'text-green-500'
                }`}>
                  {analysisResult.outdated ? (
                    <>
                      <XCircle className="h-5 w-5 mr-1" />
                      <span>Outdated</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span>Current</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Security Score</p>
                  <div className="flex items-center">
                    <Progress 
                      value={analysisResult.securityScore} 
                      className="w-full mr-2"
                      indicatorClassName={`${
                        analysisResult.securityScore > 70 ? 'bg-green-500' :
                        analysisResult.securityScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm">{analysisResult.securityScore}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Last Update</p>
                  <p>{new Date(analysisResult.lastUpdate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {analysisResult.outdated && (
                <div>
                  <p className="text-sm text-gray-400">Recommended Version</p>
                  <p className="text-green-500">{analysisResult.recommendedVersion}</p>
                </div>
              )}
              
              {analysisResult.knownVulnerabilities && analysisResult.knownVulnerabilities.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400">Known Vulnerabilities</p>
                  <div className="space-y-1 mt-1">
                    {analysisResult.knownVulnerabilities.map((vuln: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <FileWarning className="h-4 w-4 mr-2 text-red-500" />
                        <span>{vuln}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {analysisResult.recommendations && (
                <div>
                  <p className="text-sm text-gray-400">Recommendations</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FirmwareAnalysis;

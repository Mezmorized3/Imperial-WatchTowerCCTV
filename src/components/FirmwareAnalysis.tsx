
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Shield, Download, Upload, Search } from 'lucide-react';
import { analyzeFirmware } from '@/utils/threatIntelligence';
import { useToast } from '@/components/ui/use-toast';

interface FirmwareAnalysisProps {
  // Add any props if needed
}

export const FirmwareAnalysis: React.FC<FirmwareAnalysisProps> = () => {
  const { toast } = useToast();
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);

  const manufacturers = [
    'Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha', 
    'Uniview', 'Vivotek', 'IDIS', 'Panasonic', 'Sony'
  ];

  const handleAnalyze = async () => {
    if (!manufacturer || !model || !firmwareVersion) {
      toast({
        title: 'Missing Information',
        description: 'Please provide manufacturer, model, and firmware version.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
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
      const result = await analyzeFirmware(manufacturer, model, firmwareVersion);
      setAnalyzeResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'Firmware analysis completed successfully.',
      });
    } catch (error) {
      console.error('Error analyzing firmware:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze firmware. Please try again.',
        variant: 'destructive',
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  const getSeverityColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Shield className="mr-2 h-6 w-6" />
            Firmware Analysis Tool
          </CardTitle>
          <CardDescription>
            Analyze camera firmware for vulnerabilities and security issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Manufacturer</label>
                <Select 
                  value={manufacturer} 
                  onValueChange={setManufacturer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Model</label>
                <Input
                  placeholder="e.g. DS-2CD2142FWD-I"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Firmware Version</label>
                <Input
                  placeholder="e.g. 5.4.5"
                  value={firmwareVersion}
                  onChange={(e) => setFirmwareVersion(e.target.value)}
                />
              </div>
            </div>

            {isAnalyzing && (
              <div className="my-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing firmware...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Analyze Firmware
              </Button>
              <Button variant="outline" disabled={isAnalyzing} className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Firmware File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analyzeResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {analyzeResult.outdated ? (
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              )}
              Firmware Analysis Results
            </CardTitle>
            <CardDescription>
              {manufacturer} {model} - Version {firmwareVersion}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Security Score</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold mr-2">{analyzeResult.securityScore}/100</span>
                  <div className="flex-1 mx-2">
                    <Progress 
                      value={analyzeResult.securityScore} 
                      className="h-2.5"
                    />
                  </div>
                </div>
                <div className="flex space-x-1">
                  {analyzeResult.outdated && (
                    <Badge variant="destructive">Outdated</Badge>
                  )}
                  {analyzeResult.knownVulnerabilities.length > 0 && (
                    <Badge variant="destructive">{analyzeResult.knownVulnerabilities.length} Vulnerabilities</Badge>
                  )}
                  {analyzeResult.outdated && analyzeResult.recommendedVersion && (
                    <Badge variant="outline">Recommended: v{analyzeResult.recommendedVersion}</Badge>
                  )}
                </div>
              </div>

              {analyzeResult.knownVulnerabilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Known Vulnerabilities</h3>
                  <div className="space-y-2">
                    {analyzeResult.knownVulnerabilities.map((cve: string, i: number) => (
                      <div key={i} className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                        <span className="font-mono">{cve}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analyzeResult.recommendations && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analyzeResult.recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-sm text-gray-500">
              Last Update: {new Date(analyzeResult.lastUpdate).toLocaleDateString()}
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FirmwareAnalysis;

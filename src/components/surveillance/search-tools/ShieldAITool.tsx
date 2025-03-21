
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, Network, AlertTriangle, Cpu, BarChart } from 'lucide-react';
import { executeShieldAI } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export const ShieldAITool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('vulnerability');
  const [depth, setDepth] = useState('medium');
  const [aiModel, setAiModel] = useState('ShieldCore-v2');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a target system to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setResults(null);
    setAnalysisProgress(0);
    
    toast({
      title: "Shield AI Analysis Initiated",
      description: `Analyzing ${target} using AI security model...`,
    });
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 300);
    
    try {
      const analysisResults = await executeShieldAI({
        target,
        mode,
        depth,
        aiModel
      });
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Short delay to show 100% progress
      setTimeout(() => {
        setResults(analysisResults);
        toast({
          title: "Analysis Complete",
          description: analysisResults?.simulatedData 
            ? "Showing simulated results (dev mode)" 
            : "AI security analysis completed successfully",
        });
        setIsAnalyzing(false);
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Shield AI analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter target system (IP, domain, URL, etc.)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !target}
            className="w-full"
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Run AI Analysis
              </>
            )}
          </Button>
        </div>
      </div>
      
      {analysisProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Analyzing {target}</span>
            <span>{analysisProgress}%</span>
          </div>
          <Progress value={analysisProgress} className="h-2" />
        </div>
      )}
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mode-select">Analysis Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select analysis mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vulnerability">Vulnerability Assessment</SelectItem>
                  <SelectItem value="anomaly">Anomaly Detection</SelectItem>
                  <SelectItem value="network">Network Analysis</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Scan</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Type of AI security analysis to perform</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depth-select">Scan Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger id="depth-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select scan depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (Faster)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="deep">Deep (Thorough)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Deeper scans find more but take longer</p>
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="ai-model-select">AI Security Model</Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger id="ai-model-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ShieldCore-v1">ShieldCore v1 (Stable)</SelectItem>
                  <SelectItem value="ShieldCore-v2">ShieldCore v2 (Recommended)</SelectItem>
                  <SelectItem value="ShieldCore-advanced">ShieldCore Advanced (Experimental)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">AI model used for security analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Shield AI Analysis Results
              </h3>
              <Badge className="capitalize">{results.mode} Mode</Badge>
            </div>
            
            <Tabs defaultValue={Object.keys(results.result)[0] || 'vulnerabilityAssessment'} className="w-full">
              <TabsList className="w-full">
                {results.result.vulnerabilityAssessment && (
                  <TabsTrigger value="vulnerabilityAssessment" className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Vulnerabilities
                  </TabsTrigger>
                )}
                {results.result.anomalyDetection && (
                  <TabsTrigger value="anomalyDetection" className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    Anomalies
                  </TabsTrigger>
                )}
                {results.result.networkAnalysis && (
                  <TabsTrigger value="networkAnalysis" className="flex items-center">
                    <Network className="mr-2 h-4 w-4" />
                    Network
                  </TabsTrigger>
                )}
              </TabsList>
              
              {results.result.vulnerabilityAssessment && (
                <TabsContent value="vulnerabilityAssessment" className="pt-4">
                  {results.result.overallRisk && (
                    <div className="mb-4 p-3 bg-scanner-dark rounded-md border border-gray-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                        <span className="font-medium">Overall Risk Assessment</span>
                      </div>
                      <Badge className={getRiskColor(results.result.overallRisk)}>
                        {results.result.overallRisk}
                      </Badge>
                    </div>
                  )}
                  
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {results.result.vulnerabilityAssessment.map((assessment: any, index: number) => (
                        <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{assessment.category}</span>
                            <Badge className={getRiskColor(assessment.riskLevel)}>
                              {assessment.riskLevel}
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Confidence: </span>
                              <span>{assessment.confidenceScore}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Recommendations: </span>
                              <span>{assessment.recommendations}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {results.result.remediationTimeEstimate && (
                    <div className="mt-3 text-sm text-gray-400">
                      Estimated remediation time: {results.result.remediationTimeEstimate}
                    </div>
                  )}
                </TabsContent>
              )}
              
              {results.result.anomalyDetection && (
                <TabsContent value="anomalyDetection" className="pt-4">
                  <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                    <h4 className="text-md font-medium mb-3 flex items-center">
                      <BarChart className="h-4 w-4 text-blue-400 mr-2" />
                      Anomaly Detection Results
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Anomalies Detected: </span>
                        <span className="font-medium">{results.result.anomalyDetection.anomaliesDetected}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Baseline Variance: </span>
                        <span>{results.result.anomalyDetection.baselineVariance}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">False Positive Rate: </span>
                        <span>{(results.result.anomalyDetection.falsePositiveRate * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Monitoring Period: </span>
                        <span>{results.result.anomalyDetection.monitoringPeriod}</span>
                      </div>
                    </div>
                    
                    {results.result.potentialThreats > 0 && (
                      <div className="mt-3">
                        <Badge className="bg-yellow-600">
                          {results.result.potentialThreats} Potential {results.result.potentialThreats === 1 ? 'Threat' : 'Threats'} Detected
                        </Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
              
              {results.result.networkAnalysis && (
                <TabsContent value="networkAnalysis" className="pt-4">
                  <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                    <h4 className="text-md font-medium mb-3 flex items-center">
                      <Network className="h-4 w-4 text-blue-400 mr-2" />
                      Network Analysis
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Device Count: </span>
                        <span>{results.result.networkAnalysis.deviceCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Unusual Connections: </span>
                        <span>{results.result.networkAnalysis.unusualConnections}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Encrypted Traffic: </span>
                        <span>{results.result.networkAnalysis.encryptedTraffic}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">External Connections: </span>
                        <span>{results.result.networkAnalysis.externalConnections}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <Cpu className="h-3 w-3 mr-1" />
              Analysis performed using {results.aiModel} model
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

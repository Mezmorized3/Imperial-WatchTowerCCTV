
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, History, Wifi, AlertCircle, Activity, Check, X } from 'lucide-react';
import { executeCamerattack } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';

export const CamerattackTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('reconnaissance');
  const [timeout, setTimeout] = useState(30);
  const [advanced, setAdvanced] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAttack = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a camera IP or URL to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAttacking(true);
    toast({
      title: "Camera Analysis Initiated",
      description: `Analyzing ${target} with ${mode} mode...`,
    });
    
    try {
      const attackResults = await executeCamerattack({
        target,
        mode,
        timeout,
        advanced
      });
      
      setResults(attackResults);
      toast({
        title: "Analysis Complete",
        description: attackResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "Camera analysis completed successfully",
      });
    } catch (error) {
      console.error('Camerattack error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAttacking(false);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'dos':
        return <Activity className="h-4 w-4 mr-2" />;
      case 'hijack':
        return <Camera className="h-4 w-4 mr-2" />;
      case 'replay':
        return <History className="h-4 w-4 mr-2" />;
      default:
        return <Wifi className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border border-red-900">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-200">
              <p className="font-medium">Warning: Security Testing Tool</p>
              <p className="text-red-300/80">
                This tool is designed for security professionals to test the resilience of camera systems. Using this tool against systems without explicit permission is illegal and unethical.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter camera IP or URL (e.g., 192.168.1.100 or rtsp://camera.example.com:554)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleAttack} 
            disabled={isAttacking || !target}
            className="w-full"
            variant="destructive"
          >
            {isAttacking ? (
              <>Analyzing...</>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Analyze Camera
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mode-select">Analysis Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reconnaissance">Reconnaissance</SelectItem>
                  <SelectItem value="dos">Stability Testing</SelectItem>
                  <SelectItem value="hijack">Access Analysis</SelectItem>
                  <SelectItem value="replay">Stream Analysis</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Type of analysis to perform</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="timeout-slider">Timeout: {timeout}s</Label>
              </div>
              <Slider 
                id="timeout-slider"
                min={5} 
                max={60} 
                step={5} 
                value={[timeout]} 
                onValueChange={(value) => setTimeout(value[0])}
              />
              <p className="text-xs text-gray-400">Maximum time for analysis</p>
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="advanced-mode" className="text-sm">Advanced Techniques</Label>
                <Switch 
                  id="advanced-mode" 
                  checked={advanced}
                  onCheckedChange={setAdvanced}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Use more advanced analysis techniques (may take longer)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                {getModeIcon()}
                Camera Analysis Results
              </h3>
              <Badge className="capitalize">{results.mode}</Badge>
            </div>
            
            <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium">
                      {results.result?.attackType || 'Analysis Results'}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    {/* Reconnaissance Mode */}
                    {mode === 'reconnaissance' && results.result?.openPorts && (
                      <>
                        <div>
                          <span className="text-gray-400">Open Ports: </span>
                          <span className="font-mono">
                            {results.result.openPorts.length > 0 
                              ? results.result.openPorts.join(', ') 
                              : 'None detected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Vulnerabilities: </span>
                          <span>{results.result.vulnerabilities || 0}</span>
                        </div>
                      </>
                    )}
                    
                    {/* DoS Mode */}
                    {mode === 'dos' && (
                      <>
                        <div>
                          <span className="text-gray-400">Success: </span>
                          {results.result?.success ? 
                            <Check className="inline h-4 w-4 text-green-500" /> : 
                            <X className="inline h-4 w-4 text-red-500" />}
                        </div>
                        <div>
                          <span className="text-gray-400">Time to Disable: </span>
                          <span>{results.result?.timeToDisable || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Packets: </span>
                          <span>{results.result?.packetsRequired || 'N/A'}</span>
                        </div>
                      </>
                    )}
                    
                    {/* Hijack Mode */}
                    {mode === 'hijack' && (
                      <>
                        <div>
                          <span className="text-gray-400">Success: </span>
                          {results.result?.success ? 
                            <Check className="inline h-4 w-4 text-green-500" /> : 
                            <X className="inline h-4 w-4 text-red-500" />}
                        </div>
                        <div>
                          <span className="text-gray-400">Stream Access: </span>
                          {results.result?.streamAccess ? 
                            <Check className="inline h-4 w-4 text-green-500" /> : 
                            <X className="inline h-4 w-4 text-red-500" />}
                        </div>
                        <div>
                          <span className="text-gray-400">Control Access: </span>
                          {results.result?.controlAccess ? 
                            <Check className="inline h-4 w-4 text-green-500" /> : 
                            <X className="inline h-4 w-4 text-red-500" />}
                        </div>
                      </>
                    )}
                    
                    {/* Replay Mode */}
                    {mode === 'replay' && (
                      <>
                        <div>
                          <span className="text-gray-400">Success: </span>
                          {results.result?.success ? 
                            <Check className="inline h-4 w-4 text-green-500" /> : 
                            <X className="inline h-4 w-4 text-red-500" />}
                        </div>
                        <div>
                          <span className="text-gray-400">Captured Frames: </span>
                          <span>{results.result?.capturedFrames || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Replay Duration: </span>
                          <span>{results.result?.replayDuration || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Advanced Techniques Results */}
              {advanced && results.result?.advancedTechniques && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <h4 className="font-medium mb-2">Advanced Techniques</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Packet Forging: </span>
                      {results.result.advancedTechniques.packetForging ? 
                        <Check className="inline h-4 w-4 text-green-500" /> : 
                        <X className="inline h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <span className="text-gray-400">Encryption Bypass: </span>
                      {results.result.advancedTechniques.encryptionBypass ? 
                        <Check className="inline h-4 w-4 text-green-500" /> : 
                        <X className="inline h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <span className="text-gray-400">Firmware Analysis: </span>
                      {results.result.advancedTechniques.firmwareAnalysis ? 
                        <Check className="inline h-4 w-4 text-green-500" /> : 
                        <X className="inline h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

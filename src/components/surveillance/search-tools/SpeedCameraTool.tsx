
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Zap, Video, Camera, Eye, BarChart } from 'lucide-react';
import { executeSpeedCamera } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export const SpeedCameraTool: React.FC = () => {
  const [source, setSource] = useState('');
  const [motionThreshold, setMotionThreshold] = useState(25);
  const [fps, setFps] = useState(10);
  const [mode, setMode] = useState('standard');
  const [advanced, setAdvanced] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!source) {
      toast({
        title: "Source Required",
        description: "Please enter a camera source (URL or IP address)",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    toast({
      title: "Speed Camera Analysis Started",
      description: `Analyzing ${source} for motion...`,
    });
    
    try {
      const analyzeResults = await executeSpeedCamera({
        source,
        motionThreshold,
        fps,
        mode
      });
      
      setResults(analyzeResults);
      toast({
        title: "Analysis Complete",
        description: analyzeResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : `Found ${analyzeResults.motionEvents?.length || 0} motion events`,
      });
    } catch (error) {
      console.error('Speed Camera analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getObjectTypeIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'vehicle':
        return <Car className="h-4 w-4 text-green-400" />;
      case 'animal':
        return <Paw className="h-4 w-4 text-yellow-400" />;
      default:
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Camera RTSP/HTTP URL or IP address (e.g., rtsp://192.168.1.100:554/stream)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !source}
            className="w-full"
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Detect Motion
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-slider">Motion Threshold: {motionThreshold}%</Label>
                </div>
                <Slider 
                  id="threshold-slider"
                  min={5} 
                  max={50} 
                  step={1} 
                  value={[motionThreshold]} 
                  onValueChange={(value) => setMotionThreshold(value[0])}
                />
                <p className="text-xs text-gray-400">Lower values detect more subtle motion</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fps-slider">FPS: {fps}</Label>
                </div>
                <Slider 
                  id="fps-slider"
                  min={1} 
                  max={30} 
                  step={1} 
                  value={[fps]} 
                  onValueChange={(value) => setFps(value[0])}
                />
                <p className="text-xs text-gray-400">Frames per second to analyze</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mode-select">Detection Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger id="mode-select" className="bg-scanner-dark">
                    <SelectValue placeholder="Select detection mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="sensitive">Sensitive</SelectItem>
                    <SelectItem value="tracking">Object Tracking</SelectItem>
                    <SelectItem value="night">Night Vision</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">Detection algorithm optimization</p>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <Label htmlFor="advanced-mode" className="text-sm">Advanced Mode</Label>
                <Switch 
                  id="advanced-mode" 
                  checked={advanced}
                  onCheckedChange={setAdvanced}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Motion Analysis Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-scanner-dark rounded-md border border-gray-700 flex items-center">
                  <Video className="h-5 w-5 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">FPS</p>
                    <p className="text-lg font-medium">{results.fps}</p>
                  </div>
                </div>
                <div className="p-3 bg-scanner-dark rounded-md border border-gray-700 flex items-center">
                  <Eye className="h-5 w-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Sensitivity</p>
                    <p className="text-lg font-medium">{results.statistics?.sensitivityLevel}</p>
                  </div>
                </div>
                <div className="p-3 bg-scanner-dark rounded-md border border-gray-700 flex items-center">
                  <BarChart className="h-5 w-5 text-green-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Avg. Speed</p>
                    <p className="text-lg font-medium">{results.statistics?.averageSpeed} units</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Motion Events ({results.motionEvents?.length || 0})</h3>
              {results.motionEvents && results.motionEvents.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {results.motionEvents.map((event: any, index: number) => (
                      <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {event.objectType === 'person' ? (
                              <User className="h-5 w-5 text-blue-400 mr-2" />
                            ) : event.objectType === 'vehicle' ? (
                              <Car className="h-5 w-5 text-green-400 mr-2" />
                            ) : (
                              <Eye className="h-5 w-5 text-yellow-400 mr-2" />
                            )}
                            <span className="font-medium">{event.objectType}</span>
                          </div>
                          <Badge className={event.speed > 20 ? 'bg-red-600' : event.speed > 10 ? 'bg-yellow-600' : 'bg-blue-600'}>
                            {event.speed} units/s
                          </Badge>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Direction: </span>
                            <span>{event.direction}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Confidence: </span>
                            <span>{event.confidence}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Time: </span>
                            <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>No motion events detected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Additional icon imports
import { User, Car, Paw } from 'lucide-react';


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { detectMotion } from '@/utils/rtspUtils';
import { Play, Pause, Camera, Video, Settings, Box, Eye } from 'lucide-react';

interface SpeedCameraToolProps {
  streamUrl?: string;
}

const SpeedCameraTool: React.FC<SpeedCameraToolProps> = ({ streamUrl }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  const [threshold, setThreshold] = useState(30);
  const [detectionRegion, setDetectionRegion] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });
  const [url, setUrl] = useState(streamUrl || '');
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [detectionInterval, setDetectionIntervalState] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (streamUrl) {
      setUrl(streamUrl);
    }
  }, [streamUrl]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [detectionInterval]);

  const startDetection = async () => {
    if (!url) {
      toast({
        title: "Stream URL Required",
        description: "Please enter a valid camera stream URL",
        variant: "destructive"
      });
      return;
    }

    setIsDetecting(true);
    toast({
      title: "Motion Detection Started",
      description: "Analyzing video feed for motion and objects...",
    });

    try {
      // Initial detection
      const results = await detectMotion(url, {
        sensitivity: sensitivity / 100,
        threshold: threshold / 100,
        region: detectionRegion
      });
      
      setDetectionResults(results);
      
      // Set up interval for continuous detection
      const interval = setInterval(async () => {
        try {
          const updatedResults = await detectMotion(url, {
            sensitivity: sensitivity / 100,
            threshold: threshold / 100,
            region: detectionRegion
          });
          
          setDetectionResults(updatedResults);
          
          // Alert on motion if not previously detected
          if (updatedResults.motionDetected && (!detectionResults || !detectionResults.motionDetected)) {
            toast({
              title: "Motion Detected!",
              description: `Objects detected: ${updatedResults.objects?.join(', ') || 'Unknown'}`,
            });
          }
        } catch (error) {
          console.error('Error in detection interval:', error);
        }
      }, 5000); // Check every 5 seconds
      
      setDetectionIntervalState(interval);
    } catch (error) {
      console.error('Error starting detection:', error);
      toast({
        title: "Detection Failed",
        description: error instanceof Error ? error.message : "Failed to analyze video stream",
        variant: "destructive"
      });
      setIsDetecting(false);
    }
  };

  const stopDetection = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionIntervalState(null);
    }
    setIsDetecting(false);
    toast({
      title: "Motion Detection Stopped",
      description: "No longer analyzing the video feed",
    });
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2" /> Speed Camera Motion Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="camera" className="w-full">
          <TabsList>
            <TabsTrigger value="camera" className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              Camera Feed
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Detection Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="RTSP stream URL (e.g., rtsp://192.168.1.10:554/stream)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-scanner-dark"
                  disabled={isDetecting}
                />
              </div>
              <div>
                {!isDetecting ? (
                  <Button 
                    onClick={startDetection} 
                    className="w-full"
                    disabled={!url}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Detection
                  </Button>
                ) : (
                  <Button 
                    onClick={stopDetection} 
                    variant="destructive"
                    className="w-full"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Detection
                  </Button>
                )}
              </div>
            </div>
            
            <div className="relative border-2 border-dashed border-gray-700 h-64 bg-scanner-dark rounded flex items-center justify-center">
              {url ? (
                <div className="text-center">
                  <div className="mb-2">Stream connected to: {url}</div>
                  {isDetecting && (
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mb-2 ${detectionResults?.motionDetected ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <div className="text-sm">
                        {detectionResults?.motionDetected ? 'MOTION DETECTED' : 'No motion detected'}
                      </div>
                      {detectionResults?.objects && detectionResults.objects.length > 0 && (
                        <div className="mt-2 text-sm">
                          Objects: {detectionResults.objects.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Enter a stream URL to begin</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Detection Sensitivity: {sensitivity}%</Label>
                <Slider
                  value={[sensitivity]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={(val) => setSensitivity(val[0])}
                  disabled={isDetecting}
                />
                <p className="text-xs text-gray-400">
                  Higher values increase sensitivity to motion, but may cause more false positives
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Detection Threshold: {threshold}%</Label>
                <Slider
                  value={[threshold]}
                  min={5}
                  max={95}
                  step={5}
                  onValueChange={(val) => setThreshold(val[0])}
                  disabled={isDetecting}
                />
                <p className="text-xs text-gray-400">
                  Percentage of pixels that must change to trigger motion detection
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Detect Objects</Label>
                  <Switch checked={true} disabled />
                </div>
                <p className="text-xs text-gray-400">
                  Identifies objects in the video stream (people, vehicles, animals)
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Region of Interest</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">X Position (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={detectionRegion.x}
                      onChange={(e) => setDetectionRegion({...detectionRegion, x: parseInt(e.target.value) || 0})}
                      disabled={isDetecting}
                      className="bg-scanner-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Y Position (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={detectionRegion.y}
                      onChange={(e) => setDetectionRegion({...detectionRegion, y: parseInt(e.target.value) || 0})}
                      disabled={isDetecting}
                      className="bg-scanner-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Width (%)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={detectionRegion.width}
                      onChange={(e) => setDetectionRegion({...detectionRegion, width: parseInt(e.target.value) || 100})}
                      disabled={isDetecting}
                      className="bg-scanner-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Height (%)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={detectionRegion.height}
                      onChange={(e) => setDetectionRegion({...detectionRegion, height: parseInt(e.target.value) || 100})}
                      disabled={isDetecting}
                      className="bg-scanner-dark"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isDetecting && detectionResults && (
          <div className="bg-scanner-dark border border-gray-700 rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Eye className="mr-2 h-5 w-5" /> Detection Results
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-scanner-dark-alt rounded-md p-3 border border-gray-700">
                <h4 className="text-sm font-medium mb-2">Motion Status</h4>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${detectionResults.motionDetected ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <div>
                    {detectionResults.motionDetected ? 'Movement Detected' : 'No Movement'}
                  </div>
                </div>
                {detectionResults.confidence !== undefined && (
                  <div className="mt-2 text-sm">
                    Confidence: {Math.round(detectionResults.confidence * 100)}%
                  </div>
                )}
              </div>
              
              <div className="bg-scanner-dark-alt rounded-md p-3 border border-gray-700">
                <h4 className="text-sm font-medium mb-2">Detected Objects</h4>
                {detectionResults.objects && detectionResults.objects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {detectionResults.objects.map((object: string, index: number) => (
                      <div key={index} className="flex items-center bg-scanner-dark px-2 py-1 rounded">
                        <Box className="h-3 w-3 mr-1 text-blue-400" />
                        {object}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No objects detected</div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeedCameraTool;

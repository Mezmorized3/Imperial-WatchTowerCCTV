import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bird, Zap, Video, Camera, AlertTriangle } from 'lucide-react'; // Using Bird instead of Paw

export const SpeedCameraTool: React.FC = () => {
  const [source, setSource] = useState('');
  const [sensitivity, setSensitivity] = useState(5);
  const [motionThreshold, setMotionThreshold] = useState(30);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // Fix the function calls by removing the second parameter if needed
  const handleStartScan = () => {
    if (!source) {
      toast({
        title: "Source Required",
        description: "Please enter a camera source or URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    setResults(null);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);
    
    // Simulate scan completion
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Generate simulated results
      const detectionCount = Math.floor(Math.random() * 10) + 1;
      const detections = Array(detectionCount).fill(null).map((_, i) => ({
        id: `detection-${i + 1}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleString(),
        speed: Math.floor(Math.random() * 60) + 10,
        direction: Math.random() > 0.5 ? 'Incoming' : 'Outgoing',
        confidence: Math.floor(Math.random() * 30) + 70,
        type: ['Vehicle', 'Person', 'Animal', 'Unknown'][Math.floor(Math.random() * 4)]
      }));
    
      setTimeout(() => {
        setResults({
          source,
          sensitivity,
          motionThreshold,
          timestamp: new Date().toLocaleString(),
          detections,
          averageSpeed: Math.floor(detections.reduce((sum, d) => sum + d.speed, 0) / detections.length),
          maxSpeed: Math.max(...detections.map(d => d.speed))
        });
      
        setIsScanning(false);
      
        toast({
          title: "Speed Detection Complete",
          description: `Found ${detections.length} motion events in the source.`
        });
      }, 500);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Camera URL, RTSP stream, or video file path"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleStartScan} 
            disabled={isScanning || !source}
            className="w-full"
          >
            {isScanning ? (
              <>Processing...</>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Detect Motion
              </>
            )}
          </Button>
        </div>
      </div>
      
      {progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Processing {source}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="sensitivity-slider">Motion Sensitivity</Label>
                  <span className="text-sm text-gray-400">{sensitivity}</span>
                </div>
                <Slider
                  id="sensitivity-slider"
                  min={1}
                  max={10}
                  step={1}
                  value={[sensitivity]}
                  onValueChange={(values) => setSensitivity(values[0])}
                  className="py-2"
                />
                <p className="text-xs text-gray-400">Higher values detect smaller movements</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="threshold-slider">Speed Threshold (km/h)</Label>
                  <span className="text-sm text-gray-400">{motionThreshold}</span>
                </div>
                <Slider
                  id="threshold-slider"
                  min={5}
                  max={120}
                  step={5}
                  value={[motionThreshold]}
                  onValueChange={(values) => setMotionThreshold(values[0])}
                  className="py-2"
                />
                <p className="text-xs text-gray-400">Only detect objects moving above this speed</p>
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="source-type">Source Type</Label>
              <Select defaultValue="rtsp">
                <SelectTrigger id="source-type" className="bg-scanner-dark">
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rtsp">RTSP Stream</SelectItem>
                  <SelectItem value="http">HTTP Video Stream</SelectItem>
                  <SelectItem value="file">Local Video File</SelectItem>
                  <SelectItem value="webcam">Webcam</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Type of video source to process</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Speed Detection Results
              </h3>
              <Badge>
                {results.detections.length} {results.detections.length === 1 ? 'Detection' : 'Detections'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                <p className="text-xs text-gray-400">Source</p>
                <p className="truncate">{results.source}</p>
              </div>
              <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                <p className="text-xs text-gray-400">Average Speed</p>
                <p className="text-xl font-semibold">{results.averageSpeed} km/h</p>
              </div>
              <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                <p className="text-xs text-gray-400">Max Speed</p>
                <p className="text-xl font-semibold">{results.maxSpeed} km/h</p>
              </div>
              <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                <p className="text-xs text-gray-400">Timestamp</p>
                <p className="text-sm">{results.timestamp}</p>
              </div>
            </div>
            
            <div className="border border-gray-700 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-scanner-dark">
                  <tr>
                    <th className="py-2 px-3 text-left">Timestamp</th>
                    <th className="py-2 px-3 text-left">Type</th>
                    <th className="py-2 px-3 text-left">Speed</th>
                    <th className="py-2 px-3 text-left">Direction</th>
                    <th className="py-2 px-3 text-left">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.detections.map((detection: any) => (
                    <tr key={detection.id} className="border-t border-gray-700">
                      <td className="py-2 px-3">{detection.timestamp}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          {detection.type === 'Vehicle' && <Video className="h-4 w-4 mr-1" />}
                          {detection.type === 'Person' && <Bird className="h-4 w-4 mr-1" />}
                          {detection.type === 'Animal' && <Bird className="h-4 w-4 mr-1" />}
                          {detection.type === 'Unknown' && <AlertTriangle className="h-4 w-4 mr-1" />}
                          {detection.type}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge className={detection.speed > motionThreshold ? 'bg-red-600' : 'bg-green-600'}>
                          {detection.speed} km/h
                        </Badge>
                      </td>
                      <td className="py-2 px-3">{detection.direction}</td>
                      <td className="py-2 px-3">{detection.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 flex items-center">
              <Camera className="h-3 w-3 mr-1" />
              Speed detection performed with sensitivity level {results.sensitivity}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

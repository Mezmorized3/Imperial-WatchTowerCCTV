
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ObjectDetectionTool: React.FC = () => {
  const { toast } = useToast();
  const [streamUrl, setStreamUrl] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.5');
  const [model, setModel] = useState('yolov4');
  const [enableTracking, setEnableTracking] = useState(true);
  const [enableCounting, setEnableCounting] = useState(true);
  const [processingInterval, setProcessingInterval] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleStartDetection = async () => {
    if (!streamUrl) {
      toast({
        title: "Error",
        description: "Please enter a stream URL",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate detection results
      const mockResults = {
        success: true,
        data: {
          detections: [
            { label: 'person', confidence: 0.94, boundingBox: [120, 80, 200, 350], trackId: 1 },
            { label: 'car', confidence: 0.87, boundingBox: [450, 300, 200, 150], trackId: 2 },
            { label: 'bicycle', confidence: 0.78, boundingBox: [50, 200, 100, 80], trackId: 3 }
          ],
          counts: { person: 1, car: 1, bicycle: 1 },
          processedFrames: 30,
          processingTime: '2.3s',
          model: model,
          timestamp: new Date().toISOString()
        }
      };

      setResults(mockResults.data);
      
      toast({
        title: "Detection Complete",
        description: `Detected ${mockResults.data.detections.length} objects in the stream`
      });
    } catch (error) {
      console.error('Object detection error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Object Detection Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="detection-stream-url">Camera Stream URL</Label>
          <Input 
            id="detection-stream-url"
            placeholder="rtsp://camera.example.com/stream"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">RTSP, HLS or WebRTC stream URL</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="detection-model">Detection Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="detection-model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yolov4">YOLOv4 (Fast)</SelectItem>
              <SelectItem value="yolov5">YOLOv5 (Balanced)</SelectItem>
              <SelectItem value="fasterrcnn">Faster R-CNN (Accurate)</SelectItem>
              <SelectItem value="efficientdet">EfficientDet (Optimized)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
          <Input 
            id="confidence-threshold"
            type="number"
            min="0.1"
            max="1.0"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(e.target.value)}
          />
          <p className="text-xs text-gray-500">Value between 0.1 and 1.0</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="processing-interval">Processing Interval (seconds)</Label>
          <Input 
            id="processing-interval"
            type="number"
            min="0.1"
            value={processingInterval}
            onChange={(e) => setProcessingInterval(e.target.value)}
          />
          <p className="text-xs text-gray-500">How often to process frames (0 for continuous)</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable-object-tracking"
            checked={enableTracking}
            onCheckedChange={(checked) => setEnableTracking(!!checked)}
          />
          <Label htmlFor="enable-object-tracking">Enable object tracking</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable-counting"
            checked={enableCounting}
            onCheckedChange={(checked) => setEnableCounting(!!checked)}
          />
          <Label htmlFor="enable-counting">Enable object counting</Label>
        </div>

        <Button 
          onClick={handleStartDetection} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Start Object Detection"
          )}
        </Button>

        {results && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Objects Detected:</span> {results.detections.length}</p>
              <p><span className="font-medium">Processed Frames:</span> {results.processedFrames}</p>
              <p><span className="font-medium">Processing Time:</span> {results.processingTime}</p>
              
              {enableCounting && results.counts && (
                <div className="mt-2">
                  <h4 className="font-medium">Object Counts:</h4>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {Object.entries(results.counts).map(([label, count]: any) => (
                      <p key={label}><span className="font-medium">{label}:</span> {count}</p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-2">
                <h4 className="font-medium">Detected Objects:</h4>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {results.detections.map((det: any, index: number) => (
                    <div key={index} className="p-2 bg-gray-200 dark:bg-gray-700 rounded flex justify-between">
                      <span>
                        <span className="font-medium">{det.label}</span> 
                        {enableTracking && <span className="text-xs ml-1">(ID: {det.trackId})</span>}
                      </span>
                      <span>{(det.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectDetectionTool;

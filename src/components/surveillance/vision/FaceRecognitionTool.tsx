
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, User, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FaceRecognitionTool: React.FC = () => {
  const { toast } = useToast();
  const [streamUrl, setStreamUrl] = useState('');
  const [confidence, setConfidence] = useState(0.6);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('standard');
  const [enableTracking, setEnableTracking] = useState(true);
  const [saveImages, setSaveImages] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleProcess = async () => {
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

      // Simulate results
      const mockResults = {
        success: true,
        data: {
          faces: [
            { id: 1, confidence: 0.92, location: [120, 80, 200, 200], age: '30-40', gender: 'male' },
            { id: 2, confidence: 0.78, location: [450, 100, 120, 140], age: '20-30', gender: 'female' }
          ],
          processedFrames: 120,
          elapsedTime: '4.2s',
          model: selectedModel,
          timestamp: new Date().toISOString()
        }
      };

      setResults(mockResults.data);
      
      toast({
        title: "Processing Complete",
        description: `Detected ${mockResults.data.faces.length} faces in the stream`
      });
    } catch (error) {
      console.error('Face recognition error:', error);
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
          <User className="h-5 w-5" />
          Face Recognition Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stream-url">Camera Stream URL</Label>
          <Input 
            id="stream-url"
            placeholder="rtsp://camera.example.com/stream"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">RTSP, HLS or WebRTC stream URL</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model-select">Recognition Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Fast)</SelectItem>
              <SelectItem value="enhanced">Enhanced (Medium)</SelectItem>
              <SelectItem value="comprehensive">Comprehensive (Slow)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Confidence Threshold: {confidence}</Label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500">Higher values mean fewer false positives</p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="enable-tracking"
            checked={enableTracking}
            onCheckedChange={(checked) => setEnableTracking(!!checked)}
          />
          <Label htmlFor="enable-tracking">Enable face tracking</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-images"
            checked={saveImages}
            onCheckedChange={(checked) => setSaveImages(!!checked)}
          />
          <Label htmlFor="save-images">Save detected face images</Label>
        </div>

        <Button 
          onClick={handleProcess} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Start Face Recognition
            </>
          )}
        </Button>

        {results && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Faces Detected:</span> {results.faces.length}</p>
              <p><span className="font-medium">Processed Frames:</span> {results.processedFrames}</p>
              <p><span className="font-medium">Processing Time:</span> {results.elapsedTime}</p>
              <p><span className="font-medium">Model Used:</span> {results.model}</p>
              
              {results.faces.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Faces:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {results.faces.map((face: any) => (
                      <div key={face.id} className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
                        <p><span className="font-medium">ID:</span> {face.id}</p>
                        <p><span className="font-medium">Confidence:</span> {(face.confidence * 100).toFixed(1)}%</p>
                        <p><span className="font-medium">Age Est.:</span> {face.age}</p>
                        <p><span className="font-medium">Gender:</span> {face.gender}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceRecognitionTool;

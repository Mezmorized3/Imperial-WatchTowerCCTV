
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileImage, Loader2, Upload } from 'lucide-react';

const ObjectDetectionTool: React.FC = () => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleProcessImage = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResults(null);

    // Simulate processing with timeout
    setTimeout(() => {
      const objectTypes = ['person', 'car', 'bicycle', 'motorcycle', 'bus', 'truck', 'traffic light', 'dog', 'cat', 'backpack'];
      const detectedObjects = Math.floor(Math.random() * 8) + 1;
      
      const objects = Array.from({ length: detectedObjects }, () => ({
        type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
        confidence: (Math.random() * 40 + 60).toFixed(2) + "%",
        location: `x: ${Math.floor(Math.random() * 600)}, y: ${Math.floor(Math.random() * 400)}, w: ${Math.floor(Math.random() * 200) + 50}, h: ${Math.floor(Math.random() * 200) + 50}`
      }));
      
      setResults({
        objectsDetected: detectedObjects,
        processingTime: (Math.random() * 2).toFixed(2) + "s",
        objects
      });
      
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete",
        description: `Detected ${detectedObjects} objects in the image`
      });
    }, 2000);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Object Detection Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="Enter URL to image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>

          {results && (
            <div className="mt-4 p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
              <h3 className="text-md font-medium mb-2">Results</h3>
              <p className="text-sm mb-2">Detected {results.objectsDetected} objects in {results.processingTime}</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.objects.map((obj: any, index: number) => (
                  <div key={index} className="p-2 bg-black/30 rounded text-sm">
                    <div className="font-semibold">{obj.type} ({obj.confidence})</div>
                    <div className="text-xs text-gray-400">{obj.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleProcessImage}
          disabled={isProcessing || !imageUrl}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Detect Objects"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ObjectDetectionTool;

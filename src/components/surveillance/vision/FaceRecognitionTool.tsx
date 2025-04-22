
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2, Upload } from 'lucide-react';

const FaceRecognitionTool: React.FC = () => {
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
      setResults({
        facesDetected: Math.floor(Math.random() * 5) + 1,
        confidence: (Math.random() * 40 + 60).toFixed(2) + "%",
        processingTime: (Math.random() * 2).toFixed(2) + "s",
        matches: Math.floor(Math.random() * 3)
      });
      
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete",
        description: "Face recognition analysis completed"
      });
    }, 2000);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Face Recognition Tool
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
            <Button variant="outline" disabled={isProcessing}>
              <Camera className="h-4 w-4 mr-2" />
              Use Camera
            </Button>
          </div>

          {results && (
            <div className="mt-4 p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
              <h3 className="text-md font-medium mb-2">Results</h3>
              <ul className="space-y-1 text-sm">
                <li>Faces Detected: {results.facesDetected}</li>
                <li>Confidence Level: {results.confidence}</li>
                <li>Processing Time: {results.processingTime}</li>
                <li>Database Matches: {results.matches}</li>
              </ul>
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
            "Process Image"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FaceRecognitionTool;

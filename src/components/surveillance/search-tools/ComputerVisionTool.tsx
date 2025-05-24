import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { MonitorPlay, ImageIcon, BrainCircuit } from 'lucide-react';
import { executeHackingTool } from '@/utils/osintUtilsConnector';
import {
  OpenCVParams,
  DeepstackParams,
  FaceRecognitionParams,
  MotionParams
} from '@/utils/types/osintToolTypes';

interface ComputerVisionToolProps {
  // Props if needed
}

const ComputerVisionTool: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [openCVOptions, setOpenCVOptions] = useState({
    detectionType: 'detect_faces',
  });

  const [deepstackOptions, setDeepstackOptions] = useState({
    detectionType: 'object',
  });

  const [motionOptions, setMotionOptions] = useState({
    threshold: 50,
    detectMotion: true,
    saveFrames: false,
    recordOnMotion: false,
    notifyOnMotion: false
  });

  const handleOpenCVAnalysis = async () => {
    if (!streamUrl) {
      toast({
        title: "Error",
        description: "Please enter a stream URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const detectionTypeMap = {
        'detect_faces': 'face_detection',
        'detect_objects': 'edge_detection', 
        'motion_detection': 'edge_detection',
        'text_recognition': 'edge_detection'
      };

      const result = await executeHackingTool({
        tool: 'openCV',
        imagePath: streamUrl,
        operation: detectionTypeMap[openCVOptions.detectionType as keyof typeof detectionTypeMap] as 'edge_detection' | 'face_detection' | 'object_tracking_init'
      });

      if (result.success) {
        setResults({ openCV: result.data.results });
        toast({
          title: "OpenCV Analysis Complete",
          description: "Analysis completed successfully",
        });
      } else {
        toast({
          title: "OpenCV Analysis Failed",
          description: result.error || "Analysis failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "OpenCV Analysis Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeepstackAnalysis = async () => {
    if (!streamUrl) {
      toast({
        title: "Error",
        description: "Please enter a stream URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await executeHackingTool({
        tool: 'deepstack',
        imagePath: streamUrl,
        mode: deepstackOptions.detectionType
      });

      if (result.success) {
        setResults({ deepstack: result.data.results });
        toast({
          title: "Deepstack Analysis Complete",
          description: "Analysis completed successfully",
        });
      } else {
        toast({
          title: "Deepstack Analysis Failed",
          description: result.error || "Analysis failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Deepstack Analysis Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFaceRecognition = async () => {
    if (!streamUrl) {
      toast({
        title: "Error",
        description: "Please enter a stream URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await executeHackingTool({
        tool: 'faceRecognition',
        knownFacesDir: '/known_faces',
        imageToCheck: streamUrl
      });

      if (result.success) {
        setResults({ faceRecognition: result.data.results });
        toast({
          title: "Face Recognition Complete",
          description: "Analysis completed successfully",
        });
      } else {
        toast({
          title: "Face Recognition Failed",
          description: result.error || "Analysis failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Face Recognition Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMotionDetection = async () => {
    if (!streamUrl) {
      toast({
        title: "Error",
        description: "Please enter a stream URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await executeHackingTool({
        tool: 'motion',
        streamUrl: streamUrl,
        threshold: motionOptions.threshold,
        detectMotion: motionOptions.detectMotion,
        saveFrames: motionOptions.saveFrames,
        recordOnMotion: motionOptions.recordOnMotion,
        notifyOnMotion: motionOptions.notifyOnMotion
      });

      if (result.success) {
        setResults({ motion: result.data.results });
        toast({
          title: "Motion Detection Complete",
          description: "Analysis completed successfully",
        });
      } else {
        toast({
          title: "Motion Detection Failed",
          description: result.error || "Analysis failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Motion Detection Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="stream-url">Stream URL</Label>
            <Input
              id="stream-url"
              placeholder="Enter stream URL"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opencv-detection-type">OpenCV Detection Type</Label>
              <Select value={openCVOptions.detectionType} onValueChange={(value) => setOpenCVOptions({ ...openCVOptions, detectionType: value })}>
                <SelectTrigger id="opencv-detection-type" className="bg-scanner-dark-alt border-gray-700">
                  <SelectValue placeholder="Select detection type" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="detect_faces">Detect Faces</SelectItem>
                  <SelectItem value="detect_objects">Detect Objects</SelectItem>
                  <SelectItem value="motion_detection">Motion Detection</SelectItem>
                  <SelectItem value="text_recognition">Text Recognition</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleOpenCVAnalysis} disabled={isAnalyzing} className="mt-2 w-full bg-scanner-primary">
                {isAnalyzing ? 'Analyzing...' : 'Analyze with OpenCV'}
              </Button>
            </div>

            <div>
              <Label htmlFor="deepstack-detection-type">Deepstack Detection Type</Label>
              <Select value={deepstackOptions.detectionType} onValueChange={(value) => setDeepstackOptions({ ...deepstackOptions, detectionType: value })}>
                <SelectTrigger id="deepstack-detection-type" className="bg-scanner-dark-alt border-gray-700">
                  <SelectValue placeholder="Select detection type" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="object">Object Detection</SelectItem>
                  <SelectItem value="face">Face Detection</SelectItem>
                  <SelectItem value="scene">Scene Detection</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleDeepstackAnalysis} disabled={isAnalyzing} className="mt-2 w-full bg-scanner-primary">
                {isAnalyzing ? 'Analyzing...' : 'Analyze with Deepstack'}
              </Button>
            </div>
          </div>

          <Button onClick={handleFaceRecognition} disabled={isAnalyzing} className="w-full bg-scanner-primary">
            {isAnalyzing ? 'Analyzing...' : 'Run Face Recognition'}
          </Button>

          <Button onClick={handleMotionDetection} disabled={isAnalyzing} className="w-full bg-scanner-primary">
            {isAnalyzing ? 'Analyzing...' : 'Run Motion Detection'}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComputerVisionTool;

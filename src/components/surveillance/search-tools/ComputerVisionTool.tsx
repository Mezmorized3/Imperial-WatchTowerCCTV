
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Loader2, Camera, Webcam, Search, FileSearch } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { executeOpenCV, executeDeepstack, executeFaceRecognition, executeMotion } from '@/utils/osintTools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComputerVisionToolProps {
  onProcessComplete?: (results: any) => void;
}

const ComputerVisionTool: React.FC<ComputerVisionToolProps> = ({ onProcessComplete }) => {
  const [activeTab, setActiveTab] = useState('opencv');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  // OpenCV state
  const [opencvSource, setOpencvSource] = useState('');
  const [opencvOperation, setOpencvOperation] = useState<'detect_faces' | 'detect_objects' | 'motion_detection' | 'text_recognition'>('detect_objects');
  const [opencvConfidence, setOpencvConfidence] = useState<number>(50);
  const [opencvShowProcessing, setOpencvShowProcessing] = useState<boolean>(true);
  const [opencvSaveResults, setOpencvSaveResults] = useState<boolean>(false);

  // Deepstack state
  const [deepstackStreamUrl, setDeepstackStreamUrl] = useState('');
  const [deepstackDetectionType, setDeepstackDetectionType] = useState<'object' | 'face' | 'scene'>('object');
  const [deepstackConfidence, setDeepstackConfidence] = useState<number>(50);
  const [deepstackInterval, setDeepstackInterval] = useState<number>(1);
  const [deepstackReturnImage, setDeepstackReturnImage] = useState<boolean>(true);

  // Face Recognition state
  const [faceImage, setFaceImage] = useState('');
  const [faceKnownFaces, setFaceKnownFaces] = useState<boolean>(false);
  const [faceDetectAge, setFaceDetectAge] = useState<boolean>(false);
  const [faceDetectGender, setFaceDetectGender] = useState<boolean>(false);
  const [faceDetectEmotion, setFaceDetectEmotion] = useState<boolean>(false);
  const [faceMinConfidence, setFaceMinConfidence] = useState<number>(50);

  // Motion Detection state
  const [motionStreamUrl, setMotionStreamUrl] = useState('');
  const [motionThreshold, setMotionThreshold] = useState<number>(25);
  const [motionRecordOnMotion, setMotionRecordOnMotion] = useState<boolean>(true);
  const [motionNotifyOnMotion, setMotionNotifyOnMotion] = useState<boolean>(false);
  const [motionSaveFrames, setMotionSaveFrames] = useState<boolean>(true);

  const handleOpenCVProcess = async () => {
    if (!opencvSource) {
      toast({
        title: "Error",
        description: "Please enter a source URL or file path",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      const result = await executeOpenCV({
        source: opencvSource,
        operation: opencvOperation,
        confidence: opencvConfidence / 100,
        showProcessing: opencvShowProcessing,
        saveResults: opencvSaveResults
      });

      if (result && result.success) {
        setResults(result.data);

        if (onProcessComplete) {
          onProcessComplete(result.data);
        }

        toast({
          title: "Processing Complete",
          description: `Found ${result.found} detections in the source`
        });
      } else {
        toast({
          title: "Processing Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during OpenCV processing:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeepstackProcess = async () => {
    if (!deepstackStreamUrl) {
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
      const result = await executeDeepstack({
        streamUrl: deepstackStreamUrl,
        detectionType: deepstackDetectionType,
        confidence: deepstackConfidence / 100,
        interval: deepstackInterval,
        returnImage: deepstackReturnImage
      });

      if (result && result.success) {
        setResults(result.data);

        if (onProcessComplete) {
          onProcessComplete(result.data);
        }

        toast({
          title: "Detection Complete",
          description: `Found ${result.found} ${deepstackDetectionType} detections`
        });
      } else {
        toast({
          title: "Detection Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during Deepstack processing:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFaceRecognitionProcess = async () => {
    if (!faceImage) {
      toast({
        title: "Error",
        description: "Please enter an image URL or upload an image",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      const result = await executeFaceRecognition({
        image: faceImage,
        knownFaces: faceKnownFaces,
        detectAge: faceDetectAge,
        detectGender: faceDetectGender,
        detectEmotion: faceDetectEmotion,
        minConfidence: faceMinConfidence / 100
      });

      if (result && result.success) {
        setResults(result.data);

        if (onProcessComplete) {
          onProcessComplete(result.data);
        }

        toast({
          title: "Face Recognition Complete",
          description: `Found ${result.found} faces in the image`
        });
      } else {
        toast({
          title: "Face Recognition Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during Face Recognition:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMotionDetectionProcess = async () => {
    if (!motionStreamUrl) {
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
      const result = await executeMotion({
        streamUrl: motionStreamUrl,
        threshold: motionThreshold,
        detectMotion: true,
        saveFrames: motionSaveFrames,
        recordOnMotion: motionRecordOnMotion,
        notifyOnMotion: motionNotifyOnMotion
      });

      if (result && result.success) {
        setResults(result.data);

        if (onProcessComplete) {
          onProcessComplete(result.data);
        }

        toast({
          title: "Motion Detection Active",
          description: `Detected ${result.found} motion events`
        });
      } else {
        toast({
          title: "Motion Detection Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during Motion Detection:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcess = () => {
    switch (activeTab) {
      case 'opencv':
        handleOpenCVProcess();
        break;
      case 'deepstack':
        handleDeepstackProcess();
        break;
      case 'face-recognition':
        handleFaceRecognitionProcess();
        break;
      case 'motion-detection':
        handleMotionDetectionProcess();
        break;
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webcam className="h-5 w-5" />
          Computer Vision Tools
        </CardTitle>
        <CardDescription>
          Advanced detection and recognition for camera feeds and images
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="opencv" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
            <TabsTrigger value="opencv">
              <Camera className="h-4 w-4 mr-2" />
              OpenCV
            </TabsTrigger>
            <TabsTrigger value="deepstack">
              <FileSearch className="h-4 w-4 mr-2" />
              Deepstack
            </TabsTrigger>
            <TabsTrigger value="face-recognition">
              <Search className="h-4 w-4 mr-2" />
              Face Recog
            </TabsTrigger>
            <TabsTrigger value="motion-detection">
              <Webcam className="h-4 w-4 mr-2" />
              Motion
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="opencv" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="opencvSource">Source URL or File</Label>
              <Input
                id="opencvSource"
                placeholder="e.g., rtsp://example.com/stream or /path/to/file.mp4"
                value={opencvSource}
                onChange={(e) => setOpencvSource(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="opencvOperation">Operation</Label>
              <Select
                value={opencvOperation}
                onValueChange={(value: 'detect_faces' | 'detect_objects' | 'motion_detection' | 'text_recognition') => setOpencvOperation(value)}
                disabled={isProcessing}
              >
                <SelectTrigger id="opencvOperation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detect_faces">Face Detection</SelectItem>
                  <SelectItem value="detect_objects">Object Detection</SelectItem>
                  <SelectItem value="motion_detection">Motion Detection</SelectItem>
                  <SelectItem value="text_recognition">Text Recognition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="opencvConfidence">Confidence Threshold ({opencvConfidence}%)</Label>
              </div>
              <Slider
                id="opencvConfidence"
                min={1}
                max={100}
                step={1}
                value={[opencvConfidence]}
                onValueChange={(value) => setOpencvConfidence(value[0])}
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="opencvShowProcessing"
                checked={opencvShowProcessing}
                onCheckedChange={(checked) => setOpencvShowProcessing(checked === true)}
                disabled={isProcessing}
              />
              <Label htmlFor="opencvShowProcessing">Show Processing</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="opencvSaveResults"
                checked={opencvSaveResults}
                onCheckedChange={(checked) => setOpencvSaveResults(checked === true)}
                disabled={isProcessing}
              />
              <Label htmlFor="opencvSaveResults">Save Results</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="deepstack" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deepstackStreamUrl">Stream URL</Label>
              <Input
                id="deepstackStreamUrl"
                placeholder="e.g., rtsp://example.com/stream"
                value={deepstackStreamUrl}
                onChange={(e) => setDeepstackStreamUrl(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deepstackDetectionType">Detection Type</Label>
              <Select
                value={deepstackDetectionType}
                onValueChange={(value: 'object' | 'face' | 'scene') => setDeepstackDetectionType(value)}
                disabled={isProcessing}
              >
                <SelectTrigger id="deepstackDetectionType">
                  <SelectValue placeholder="Select detection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="object">Object Detection</SelectItem>
                  <SelectItem value="face">Face Detection</SelectItem>
                  <SelectItem value="scene">Scene Recognition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="deepstackConfidence">Confidence Threshold ({deepstackConfidence}%)</Label>
              </div>
              <Slider
                id="deepstackConfidence"
                min={1}
                max={100}
                step={1}
                value={[deepstackConfidence]}
                onValueChange={(value) => setDeepstackConfidence(value[0])}
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deepstackInterval">Detection Interval (seconds)</Label>
              <Input
                id="deepstackInterval"
                type="number"
                value={deepstackInterval}
                onChange={(e) => setDeepstackInterval(parseInt(e.target.value))}
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="deepstackReturnImage"
                checked={deepstackReturnImage}
                onCheckedChange={(checked) => setDeepstackReturnImage(checked === true)}
                disabled={isProcessing}
              />
              <Label htmlFor="deepstackReturnImage">Return Images</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="face-recognition" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faceImage">Image URL</Label>
              <Input
                id="faceImage"
                placeholder="e.g., http://example.com/image.jpg"
                value={faceImage}
                onChange={(e) => setFaceImage(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="faceMinConfidence">Confidence Threshold ({faceMinConfidence}%)</Label>
              </div>
              <Slider
                id="faceMinConfidence"
                min={1}
                max={100}
                step={1}
                value={[faceMinConfidence]}
                onValueChange={(value) => setFaceMinConfidence(value[0])}
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faceKnownFaces"
                  checked={faceKnownFaces}
                  onCheckedChange={(checked) => setFaceKnownFaces(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="faceKnownFaces">Match Known Faces</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faceDetectAge"
                  checked={faceDetectAge}
                  onCheckedChange={(checked) => setFaceDetectAge(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="faceDetectAge">Detect Age</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faceDetectGender"
                  checked={faceDetectGender}
                  onCheckedChange={(checked) => setFaceDetectGender(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="faceDetectGender">Detect Gender</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faceDetectEmotion"
                  checked={faceDetectEmotion}
                  onCheckedChange={(checked) => setFaceDetectEmotion(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="faceDetectEmotion">Detect Emotion</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="motion-detection" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motionStreamUrl">Stream URL</Label>
              <Input
                id="motionStreamUrl"
                placeholder="e.g., rtsp://example.com/stream"
                value={motionStreamUrl}
                onChange={(e) => setMotionStreamUrl(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="motionThreshold">Motion Threshold ({motionThreshold})</Label>
              </div>
              <Slider
                id="motionThreshold"
                min={1}
                max={100}
                step={1}
                value={[motionThreshold]}
                onValueChange={(value) => setMotionThreshold(value[0])}
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500">Lower values are more sensitive to motion</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="motionSaveFrames"
                  checked={motionSaveFrames}
                  onCheckedChange={(checked) => setMotionSaveFrames(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="motionSaveFrames">Save Frames</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="motionRecordOnMotion"
                  checked={motionRecordOnMotion}
                  onCheckedChange={(checked) => setMotionRecordOnMotion(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="motionRecordOnMotion">Record on Motion</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="motionNotifyOnMotion"
                  checked={motionNotifyOnMotion}
                  onCheckedChange={(checked) => setMotionNotifyOnMotion(checked === true)}
                  disabled={isProcessing}
                />
                <Label htmlFor="motionNotifyOnMotion">Notify on Motion</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Results</h3>
            <Textarea
              readOnly
              value={JSON.stringify(results, null, 2)}
              className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleProcess}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              {activeTab === 'opencv' && 'Process with OpenCV'}
              {activeTab === 'deepstack' && 'Detect with Deepstack'}
              {activeTab === 'face-recognition' && 'Recognize Faces'}
              {activeTab === 'motion-detection' && 'Start Motion Detection'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComputerVisionTool;

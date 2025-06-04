
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Eye, Brain, Camera, Activity } from 'lucide-react';
import {
  OpenCVParams,
  DeepstackParams,
  FaceRecognitionParams,
  MotionParams
} from '@/utils/types/osintToolTypes';
import {
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion
} from '@/utils/osintUtilsConnector';

const ComputerVisionTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('opencv');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  // OpenCV state
  const [openCVOperation, setOpenCVOperation] = useState<'detect' | 'track' | 'analyze'>('detect');
  const [openCVInput, setOpenCVInput] = useState<'image' | 'video' | 'stream'>('image');
  const [openCVSource, setOpenCVSource] = useState('');

  // Deepstack state
  const [deepstackOperation, setDeepstackOperation] = useState<'face_detection' | 'object_detection' | 'scene_recognition'>('face_detection');
  const [deepstackImage, setDeepstackImage] = useState('');
  const [deepstackConfidence, setDeepstackConfidence] = useState(0.7);

  // Face Recognition state
  const [faceOperation, setFaceOperation] = useState<'encode' | 'compare' | 'identify'>('encode');
  const [faceImage, setFaceImage] = useState('');
  const [faceDatabase, setFaceDatabase] = useState('');

  // Motion Detection state
  const [motionOperation, setMotionOperation] = useState<'detect' | 'track' | 'record'>('detect');
  const [motionSource, setMotionSource] = useState('');
  const [motionSensitivity, setMotionSensitivity] = useState(5);

  const executeOpenCVTool = async () => {
    if (!openCVSource) {
      toast({
        title: "Error",
        description: "Please provide a source for OpenCV processing",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const params: OpenCVParams = {
        tool: 'openCV',
        operation: openCVOperation,
        inputType: openCVInput,
        source: openCVSource
      };

      const result = await executeOpenCV(params);
      setResults(result);
      
      if (result.success) {
        toast({
          title: "OpenCV Processing Complete",
          description: "Computer vision analysis completed successfully"
        });
      } else {
        toast({
          title: "Processing Failed",
          description: result.error || "OpenCV processing failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDeepstackTool = async () => {
    if (!deepstackImage) {
      toast({
        title: "Error", 
        description: "Please provide an image for Deepstack analysis",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const params: DeepstackParams = {
        tool: 'deepstack',
        operation: deepstackOperation,
        image: deepstackImage,
        confidence: deepstackConfidence
      };

      const result = await executeDeepstack(params);
      setResults(result);
      
      if (result.success) {
        toast({
          title: "Deepstack Analysis Complete",
          description: "AI-powered image analysis completed"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: result.error || "Deepstack analysis failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeFaceRecognitionTool = async () => {
    if (!faceImage) {
      toast({
        title: "Error",
        description: "Please provide an image for face recognition",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const params: FaceRecognitionParams = {
        tool: 'faceRecognition',
        operation: faceOperation,
        image: faceImage,
        database: faceDatabase || undefined
      };

      const result = await executeFaceRecognition(params);
      setResults(result);
      
      if (result.success) {
        toast({
          title: "Face Recognition Complete",
          description: "Facial analysis completed successfully"
        });
      } else {
        toast({
          title: "Recognition Failed",
          description: result.error || "Face recognition failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeMotionTool = async () => {
    if (!motionSource) {
      toast({
        title: "Error",
        description: "Please provide a source for motion detection",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const params: MotionParams = {
        tool: 'motion',
        operation: motionOperation,
        source: motionSource,
        sensitivity: motionSensitivity
      };

      const result = await executeMotion(params);
      setResults(result);
      
      if (result.success) {
        toast({
          title: "Motion Detection Complete",
          description: "Motion analysis completed successfully"
        });
      } else {
        toast({
          title: "Detection Failed",
          description: result.error || "Motion detection failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-scanner-dark shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 text-scanner-info mr-2" />
            Computer Vision & AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-scanner-dark-alt grid w-full grid-cols-4">
              <TabsTrigger value="opencv" className="data-[state=active]:bg-scanner-info/20">
                <Camera className="h-4 w-4 mr-2" />
                OpenCV
              </TabsTrigger>
              <TabsTrigger value="deepstack" className="data-[state=active]:bg-scanner-info/20">
                <Brain className="h-4 w-4 mr-2" />
                Deepstack
              </TabsTrigger>
              <TabsTrigger value="face" className="data-[state=active]:bg-scanner-info/20">
                <Eye className="h-4 w-4 mr-2" />
                Face Recognition
              </TabsTrigger>
              <TabsTrigger value="motion" className="data-[state=active]:bg-scanner-info/20">
                <Activity className="h-4 w-4 mr-2" />
                Motion Detection
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opencv" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Operation</Label>
                  <Select value={openCVOperation} onValueChange={(value) => setOpenCVOperation(value as any)}>
                    <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detect">Object Detection</SelectItem>
                      <SelectItem value="track">Object Tracking</SelectItem>
                      <SelectItem value="analyze">Image Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Input Type</Label>
                  <Select value={openCVInput} onValueChange={(value) => setOpenCVInput(value as any)}>
                    <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="stream">Live Stream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Source</Label>
                <Input
                  placeholder="Image URL, video path, or stream URL"
                  value={openCVSource}
                  onChange={(e) => setOpenCVSource(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              <Button
                onClick={executeOpenCVTool}
                disabled={isProcessing}
                className="bg-scanner-primary w-full"
              >
                {isProcessing ? "Processing..." : "Execute OpenCV Analysis"}
              </Button>
            </TabsContent>

            <TabsContent value="deepstack" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Operation</Label>
                  <Select value={deepstackOperation} onValueChange={(value) => setDeepstackOperation(value as any)}>
                    <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="face_detection">Face Detection</SelectItem>
                      <SelectItem value="object_detection">Object Detection</SelectItem>
                      <SelectItem value="scene_recognition">Scene Recognition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Confidence Threshold</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={deepstackConfidence}
                    onChange={(e) => setDeepstackConfidence(parseFloat(e.target.value))}
                    className="bg-scanner-dark-alt border-gray-700"
                  />
                </div>
              </div>
              <div>
                <Label>Image</Label>
                <Input
                  placeholder="Image URL or base64 data"
                  value={deepstackImage}
                  onChange={(e) => setDeepstackImage(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              <Button
                onClick={executeDeepstackTool}
                disabled={isProcessing}
                className="bg-scanner-primary w-full"
              >
                {isProcessing ? "Analyzing..." : "Execute Deepstack Analysis"}
              </Button>
            </TabsContent>

            <TabsContent value="face" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Operation</Label>
                  <Select value={faceOperation} onValueChange={(value) => setFaceOperation(value as any)}>
                    <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encode">Encode Face</SelectItem>
                      <SelectItem value="compare">Compare Faces</SelectItem>
                      <SelectItem value="identify">Identify Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Database (optional)</Label>
                  <Input
                    placeholder="Face database name"
                    value={faceDatabase}
                    onChange={(e) => setFaceDatabase(e.target.value)}
                    className="bg-scanner-dark-alt border-gray-700"
                  />
                </div>
              </div>
              <div>
                <Label>Image</Label>
                <Input
                  placeholder="Image URL or base64 data"
                  value={faceImage}
                  onChange={(e) => setFaceImage(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              <Button
                onClick={executeFaceRecognitionTool}
                disabled={isProcessing}
                className="bg-scanner-primary w-full"
              >
                {isProcessing ? "Processing..." : "Execute Face Recognition"}
              </Button>
            </TabsContent>

            <TabsContent value="motion" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Operation</Label>
                  <Select value={motionOperation} onValueChange={(value) => setMotionOperation(value as any)}>
                    <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detect">Motion Detection</SelectItem>
                      <SelectItem value="track">Motion Tracking</SelectItem>
                      <SelectItem value="record">Motion Recording</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sensitivity (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={motionSensitivity}
                    onChange={(e) => setMotionSensitivity(parseInt(e.target.value))}
                    className="bg-scanner-dark-alt border-gray-700"
                  />
                </div>
              </div>
              <div>
                <Label>Source</Label>
                <Input
                  placeholder="Video stream URL or camera device"
                  value={motionSource}
                  onChange={(e) => setMotionSource(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              <Button
                onClick={executeMotionTool}
                disabled={isProcessing}
                className="bg-scanner-primary w-full"
              >
                {isProcessing ? "Detecting..." : "Execute Motion Detection"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-gray-700 bg-scanner-dark-alt">
          <CardHeader>
            <CardTitle className="text-sm">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96 p-4 bg-scanner-dark rounded-md border border-gray-700">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComputerVisionTool;

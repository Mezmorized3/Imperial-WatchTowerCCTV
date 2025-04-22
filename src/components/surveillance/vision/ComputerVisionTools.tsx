
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Webcam, Camera, Video, Book, FileSearch, Server, 
  Loader2, Scan, BarChart, Car, Eye
} from 'lucide-react';
import { 
  executeOpenALPR, 
  executeDarknet, 
  executeTensorFlow, 
  executeGoCV,
  executeLive555,
  executeEyeWitness
} from '@/utils/osintImplementations/computerVisionTools';

const ComputerVisionTools: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('openalpr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // OpenALPR state
  const [alprImagePath, setAlprImagePath] = useState('');
  const [alprRtspUrl, setAlprRtspUrl] = useState('');
  const [alprRegion, setAlprRegion] = useState('us');
  const [alprConfidence, setAlprConfidence] = useState(75);
  const [alprOutputFormat, setAlprOutputFormat] = useState<'json' | 'text'>('json');
  const [alprTopResults, setAlprTopResults] = useState(5);
  
  // Darknet/YOLO state
  const [darknetModel, setDarknetModel] = useState<'yolov4' | 'yolov4-tiny' | 'yolov3' | 'yolov3-tiny'>('yolov4');
  const [darknetInputSource, setDarknetInputSource] = useState('');
  const [darknetThreshold, setDarknetThreshold] = useState(25);
  const [darknetOutputFile, setDarknetOutputFile] = useState('');
  const [darknetGpuAcceleration, setDarknetGpuAcceleration] = useState(false);
  
  // TensorFlow state
  const [tensorflowModel, setTensorflowModel] = useState<'coco-ssd' | 'mobilenet' | 'posenet' | 'face-landmarks' | 'custom'>('coco-ssd');
  const [tensorflowInputSource, setTensorflowInputSource] = useState('');
  const [tensorflowThreshold, setTensorflowThreshold] = useState(50);
  const [tensorflowCustomModelPath, setTensorflowCustomModelPath] = useState('');
  const [tensorflowCustomModelLabels, setTensorflowCustomModelLabels] = useState('');
  const [tensorflowBatchSize, setTensorflowBatchSize] = useState(1);
  
  // Live555 state
  const [live555Mode, setLive555Mode] = useState<'client' | 'server'>('client');
  const [live555RtspUrl, setLive555RtspUrl] = useState('');
  const [live555ServerPort, setLive555ServerPort] = useState('8554');
  const [live555MediaFile, setLive555MediaFile] = useState('');
  const [live555OutputFile, setLive555OutputFile] = useState('');
  const [live555Duration, setLive555Duration] = useState('60');
  
  // GoCV state
  const [gocvMode, setGocvMode] = useState<'face-detection' | 'object-detection' | 'motion-detection' | 'feature-extraction'>('object-detection');
  const [gocvInputSource, setGocvInputSource] = useState('');
  const [gocvOutputFile, setGocvOutputFile] = useState('');
  const [gocvThreshold, setGocvThreshold] = useState(30);
  const [gocvShowWindows, setGocvShowWindows] = useState(false);
  const [gocvModelPath, setGocvModelPath] = useState('');
  
  // EyeWitness state
  const [eyewitnessTargets, setEyewitnessTargets] = useState('');
  const [eyewitnessPorts, setEyewitnessPorts] = useState('80,443,8080,8443');
  const [eyewitnessTimeout, setEyewitnessTimeout] = useState(10);
  const [eyewitnessThreads, setEyewitnessThreads] = useState(10);
  const [eyewitnessHeadless, setEyewitnessHeadless] = useState(true);
  const [eyewitnessReportFormat, setEyewitnessReportFormat] = useState<'html' | 'csv' | 'xml'>('html');
  
  const handleOpenALPRExecute = async () => {
    if (!alprImagePath && !alprRtspUrl) {
      toast({
        title: "Error",
        description: "Please provide either an image path or RTSP URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setResults(null);
    
    try {
      const result = await executeOpenALPR({
        imagePath: alprImagePath || undefined,
        rtspUrl: alprRtspUrl || undefined,
        region: alprRegion,
        outputFormat: alprOutputFormat,
        confidenceThreshold: alprConfidence / 100,
        topN: alprTopResults
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "OpenALPR Executed",
          description: `Found ${result.data.results?.length || 0} license plates`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('OpenALPR error:', error);
      toast({
        title: "OpenALPR Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDarknetExecute = async () => {
    if (!darknetInputSource) {
      toast({
        title: "Error",
        description: "Please provide an input source",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setResults(null);
    
    try {
      const result = await executeDarknet({
        model: darknetModel,
        inputSource: darknetInputSource, // Fixed: Changed source to inputSource
        threshold: darknetThreshold / 100,
        outputFile: darknetOutputFile || undefined,
        gpuAcceleration: darknetGpuAcceleration
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "Darknet YOLO Executed",
          description: `Detected ${result.data.detections?.length || 0} objects`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Darknet error:', error);
      toast({
        title: "Darknet Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleTensorFlowExecute = async () => {
    if (!tensorflowInputSource) {
      toast({
        title: "Error",
        description: "Please provide an input source",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setResults(null);
    
    try {
      const result = await executeTensorFlow({
        model: tensorflowModel, // Fixed: Ensure compatible model types
        inputSource: tensorflowInputSource,
        threshold: tensorflowThreshold / 100,
        customModelPath: tensorflowCustomModelPath || undefined,
        customModelLabels: tensorflowCustomModelLabels ? tensorflowCustomModelLabels.split(',') : undefined,
        batchSize: tensorflowBatchSize
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "TensorFlow Executed",
          description: `Model: ${tensorflowModel} - Processing completed`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('TensorFlow error:', error);
      toast({
        title: "TensorFlow Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleLive555Execute = async () => {
    if (live555Mode === 'client' && !live555RtspUrl) {
      toast({
        title: "Error",
        description: "Please provide an RTSP URL for client mode",
        variant: "destructive"
      });
      return;
    }
    
    if (live555Mode === 'server' && !live555MediaFile) {
      toast({
        title: "Error",
        description: "Please provide a media file for server mode",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setResults(null);
    
    try {
      const result = await executeLive555({
        mode: live555Mode,
        rtspUrl: live555RtspUrl || undefined,
        serverPort: live555ServerPort ? parseInt(live555ServerPort) : undefined,
        mediaFile: live555MediaFile || undefined,
        outputFile: live555OutputFile || undefined,
        duration: live555Duration ? parseInt(live555Duration) : undefined
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "Live555 Executed",
          description: `Mode: ${live555Mode} - ${live555Mode === 'server' ? 'Server started' : 'Stream processed'}`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Live555 error:', error);
      toast({
        title: "Live555 Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGoCVExecute = async () => {
    if (!gocvInputSource) {
      toast({
        title: "Error",
        description: "Please provide an input source",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setResults(null);
    
    try {
      const result = await executeGoCV({
        mode: gocvMode,
        inputSource: gocvInputSource, // Fixed: Changed source to inputSource
        outputFile: gocvOutputFile || undefined,
        threshold: gocvThreshold / 100,
        showWindows: gocvShowWindows,
        modelPath: gocvModelPath || undefined
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "GoCV Executed",
          description: `Mode: ${gocvMode} - Processing completed`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('GoCV error:', error);
      toast({
        title: "GoCV Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleEyeWitnessExecute = async () => {
    if (!eyewitnessTargets) {
      toast({
        title: "Error",
        description: "Please provide at least one target",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setResults(null);
    
    try {
      // Parse the targets and ports
      const targets = eyewitnessTargets.split(',').map(t => t.trim());
      const ports = eyewitnessPorts.split(',').map(p => parseInt(p.trim()));
      
      const result = await executeEyeWitness({
        targets: targets,
        port: ports.length === 1 ? ports[0] : ports,
        timeout: eyewitnessTimeout,
        threads: eyewitnessThreads,
        headless: eyewitnessHeadless,
        reportFormat: eyewitnessReportFormat
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "EyeWitness Executed",
          description: `Scanned ${targets.length} targets across ${ports.length} ports`
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('EyeWitness error:', error);
      toast({
        title: "EyeWitness Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleProcessing = () => {
    switch (activeTab) {
      case 'openalpr':
        handleOpenALPRExecute();
        break;
      case 'darknet':
        handleDarknetExecute();
        break;
      case 'tensorflow':
        handleTensorFlowExecute();
        break;
      case 'live555':
        handleLive555Execute();
        break;
      case 'gocv':
        handleGoCVExecute();
        break;
      case 'eyewitness':
        handleEyeWitnessExecute(); // Fixed: Corrected function name to match definition
        break;
    }
  };
  
  // Tab content render functions
  const renderOpenALPRForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="alpr-image-path">Image Path (optional)</Label>
        <Input
          id="alpr-image-path"
          placeholder="Path to image file or URL"
          value={alprImagePath}
          onChange={(e) => setAlprImagePath(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="alpr-rtsp-url">RTSP URL (optional)</Label>
        <Input
          id="alpr-rtsp-url"
          placeholder="rtsp://username:password@camera-ip:554/stream"
          value={alprRtspUrl}
          onChange={(e) => setAlprRtspUrl(e.target.value)}
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500">Provide either an image path or RTSP URL</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="alpr-region">Region</Label>
          <Select
            value={alprRegion}
            onValueChange={setAlprRegion}
            disabled={isProcessing}
          >
            <SelectTrigger id="alpr-region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="gb">Great Britain</SelectItem>
              <SelectItem value="kr">Korea</SelectItem>
              <SelectItem value="mx">Mexico</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="alpr-format">Output Format</Label>
          <Select
            value={alprOutputFormat}
            onValueChange={(value: 'json' | 'text') => setAlprOutputFormat(value)}
            disabled={isProcessing}
          >
            <SelectTrigger id="alpr-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="alpr-confidence">Confidence Threshold ({alprConfidence}%)</Label>
        <Slider
          id="alpr-confidence"
          min={1}
          max={100}
          step={1}
          value={[alprConfidence]}
          onValueChange={(value) => setAlprConfidence(value[0])}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="alpr-top-results">Maximum Results</Label>
        <Input
          id="alpr-top-results"
          type="number"
          min={1}
          max={20}
          value={alprTopResults}
          onChange={(e) => setAlprTopResults(parseInt(e.target.value))}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
  
  const renderDarknetForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="darknet-input-source">Input Source</Label>
        <Input
          id="darknet-input-source"
          placeholder="Path to image/video or rtsp:// URL"
          value={darknetInputSource}
          onChange={(e) => setDarknetInputSource(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="darknet-model">YOLO Model</Label>
        <Select
          value={darknetModel}
          onValueChange={(value: 'yolov4' | 'yolov4-tiny' | 'yolov3' | 'yolov3-tiny') => setDarknetModel(value)}
          disabled={isProcessing}
        >
          <SelectTrigger id="darknet-model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yolov4">YOLOv4</SelectItem>
            <SelectItem value="yolov4-tiny">YOLOv4-Tiny</SelectItem>
            <SelectItem value="yolov3">YOLOv3</SelectItem>
            <SelectItem value="yolov3-tiny">YOLOv3-Tiny</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="darknet-output-file">Output File (optional)</Label>
        <Input
          id="darknet-output-file"
          placeholder="Path for output file"
          value={darknetOutputFile}
          onChange={(e) => setDarknetOutputFile(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="darknet-threshold">Detection Threshold ({darknetThreshold}%)</Label>
        <Slider
          id="darknet-threshold"
          min={1}
          max={100}
          step={1}
          value={[darknetThreshold]}
          onValueChange={(value) => setDarknetThreshold(value[0])}
          disabled={isProcessing}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="darknet-gpu"
          checked={darknetGpuAcceleration}
          onCheckedChange={(value) => setDarknetGpuAcceleration(value === true)}
          disabled={isProcessing}
        />
        <Label htmlFor="darknet-gpu">Enable GPU Acceleration</Label>
      </div>
    </div>
  );

  const renderTensorFlowForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tensorflow-input-source">Input Source</Label>
        <Input
          id="tensorflow-input-source"
          placeholder="Path to image/video or rtsp:// URL"
          value={tensorflowInputSource}
          onChange={(e) => setTensorflowInputSource(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tensorflow-model">Model</Label>
        <Select
          value={tensorflowModel}
          onValueChange={(value: 'coco-ssd' | 'mobilenet' | 'posenet' | 'face-landmarks' | 'custom') => setTensorflowModel(value)}
          disabled={isProcessing}
        >
          <SelectTrigger id="tensorflow-model">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coco-ssd">COCO-SSD (Object Detection)</SelectItem>
            <SelectItem value="mobilenet">MobileNet (Classification)</SelectItem>
            <SelectItem value="posenet">PoseNet (Pose Estimation)</SelectItem>
            <SelectItem value="face-landmarks">Face Landmarks</SelectItem>
            <SelectItem value="custom">Custom Model</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {tensorflowModel === 'custom' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="tensorflow-custom-model-path">Custom Model Path</Label>
            <Input
              id="tensorflow-custom-model-path"
              placeholder="Path to TensorFlow model"
              value={tensorflowCustomModelPath}
              onChange={(e) => setTensorflowCustomModelPath(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tensorflow-custom-model-labels">Custom Model Labels (comma-separated)</Label>
            <Input
              id="tensorflow-custom-model-labels"
              placeholder="label1,label2,label3"
              value={tensorflowCustomModelLabels}
              onChange={(e) => setTensorflowCustomModelLabels(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="tensorflow-threshold">Confidence Threshold ({tensorflowThreshold}%)</Label>
        <Slider
          id="tensorflow-threshold"
          min={1}
          max={100}
          step={1}
          value={[tensorflowThreshold]}
          onValueChange={(value) => setTensorflowThreshold(value[0])}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tensorflow-batch-size">Batch Size</Label>
        <Input
          id="tensorflow-batch-size"
          type="number"
          min={1}
          max={32}
          value={tensorflowBatchSize}
          onChange={(e) => setTensorflowBatchSize(parseInt(e.target.value))}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
  
  const renderLive555Form = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="live555-mode">Mode</Label>
        <Select
          value={live555Mode}
          onValueChange={(value: 'client' | 'server') => setLive555Mode(value)}
          disabled={isProcessing}
        >
          <SelectTrigger id="live555-mode">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Client (Receive RTSP)</SelectItem>
            <SelectItem value="server">Server (Serve RTSP)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {live555Mode === 'client' && (
        <div className="space-y-2">
          <Label htmlFor="live555-rtsp-url">RTSP URL</Label>
          <Input
            id="live555-rtsp-url"
            placeholder="rtsp://username:password@camera-ip:554/stream"
            value={live555RtspUrl}
            onChange={(e) => setLive555RtspUrl(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      )}
      
      {live555Mode === 'server' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="live555-server-port">Server Port</Label>
            <Input
              id="live555-server-port"
              placeholder="8554"
              value={live555ServerPort}
              onChange={(e) => setLive555ServerPort(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="live555-media-file">Media File</Label>
            <Input
              id="live555-media-file"
              placeholder="Path to media file"
              value={live555MediaFile}
              onChange={(e) => setLive555MediaFile(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="live555-output-file">Output File (optional)</Label>
        <Input
          id="live555-output-file"
          placeholder="Path for output file"
          value={live555OutputFile}
          onChange={(e) => setLive555OutputFile(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="live555-duration">Duration (seconds, 0 for continuous)</Label>
        <Input
          id="live555-duration"
          placeholder="60"
          value={live555Duration}
          onChange={(e) => setLive555Duration(e.target.value)}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
  
  const renderGoCVForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gocv-mode">Mode</Label>
        <Select
          value={gocvMode}
          onValueChange={(value: 'face-detection' | 'object-detection' | 'motion-detection' | 'feature-extraction') => setGocvMode(value)}
          disabled={isProcessing}
        >
          <SelectTrigger id="gocv-mode">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="face-detection">Face Detection</SelectItem>
            <SelectItem value="object-detection">Object Detection</SelectItem>
            <SelectItem value="motion-detection">Motion Detection</SelectItem>
            <SelectItem value="feature-extraction">Feature Extraction</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gocv-input-source">Input Source</Label>
        <Input
          id="gocv-input-source"
          placeholder="Path to image/video, rtsp:// URL, or camera index (0, 1, ...)"
          value={gocvInputSource}
          onChange={(e) => setGocvInputSource(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gocv-output-file">Output File (optional)</Label>
        <Input
          id="gocv-output-file"
          placeholder="Path for output file"
          value={gocvOutputFile}
          onChange={(e) => setGocvOutputFile(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gocv-threshold">Threshold ({gocvThreshold}%)</Label>
        <Slider
          id="gocv-threshold"
          min={1}
          max={100}
          step={1}
          value={[gocvThreshold]}
          onValueChange={(value) => setGocvThreshold(value[0])}
          disabled={isProcessing}
        />
      </div>
      
      {gocvMode === 'object-detection' && (
        <div className="space-y-2">
          <Label htmlFor="gocv-model-path">Model Path (optional)</Label>
          <Input
            id="gocv-model-path"
            placeholder="Path to model file (e.g., .caffemodel)"
            value={gocvModelPath}
            onChange={(e) => setGocvModelPath(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="gocv-show-windows"
          checked={gocvShowWindows}
          onCheckedChange={(value) => setGocvShowWindows(value === true)}
          disabled={isProcessing}
        />
        <Label htmlFor="gocv-show-windows">Show Processing Windows</Label>
      </div>
    </div>
  );
  
  const renderEyeWitnessForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eyewitness-targets">Target Hosts (comma-separated)</Label>
        <Textarea
          id="eyewitness-targets"
          placeholder="example.com,192.168.1.1,10.0.0.0/24"
          value={eyewitnessTargets}
          onChange={(e) => setEyewitnessTargets(e.target.value)}
          disabled={isProcessing}
          className="min-h-24"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eyewitness-ports">Ports (comma-separated)</Label>
        <Input
          id="eyewitness-ports"
          placeholder="80,443,8080,8443"
          value={eyewitnessPorts}
          onChange={(e) => setEyewitnessPorts(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eyewitness-timeout">Timeout (seconds)</Label>
          <Input
            id="eyewitness-timeout"
            type="number"
            min={1}
            max={60}
            value={eyewitnessTimeout}
            onChange={(e) => setEyewitnessTimeout(parseInt(e.target.value))}
            disabled={isProcessing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="eyewitness-threads">Threads</Label>
          <Input
            id="eyewitness-threads"
            type="number"
            min={1}
            max={100}
            value={eyewitnessThreads}
            onChange={(e) => setEyewitnessThreads(parseInt(e.target.value))}
            disabled={isProcessing}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eyewitness-report-format">Report Format</Label>
        <Select
          value={eyewitnessReportFormat}
          onValueChange={(value: 'html' | 'csv' | 'xml') => setEyewitnessReportFormat(value)}
          disabled={isProcessing}
        >
          <SelectTrigger id="eyewitness-report-format">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="eyewitness-headless"
          checked={eyewitnessHeadless}
          onCheckedChange={(value) => setEyewitnessHeadless(value === true)}
          disabled={isProcessing}
        />
        <Label htmlFor="eyewitness-headless">Headless Mode</Label>
      </div>
    </div>
  );

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webcam className="h-5 w-5" />
          Computer Vision Tools
        </CardTitle>
        <CardDescription>
          Advanced vision and recognition tools for surveillance cameras
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full mb-4">
            <TabsTrigger value="openalpr">
              <Car className="h-4 w-4 mr-2 hidden md:inline" />
              OpenALPR
            </TabsTrigger>
            <TabsTrigger value="darknet">
              <Eye className="h-4 w-4 mr-2 hidden md:inline" />
              YOLO
            </TabsTrigger>
            <TabsTrigger value="tensorflow">
              <BarChart className="h-4 w-4 mr-2 hidden md:inline" />
              TensorFlow
            </TabsTrigger>
            <TabsTrigger value="live555">
              <Video className="h-4 w-4 mr-2 hidden md:inline" />
              Live555
            </TabsTrigger>
            <TabsTrigger value="gocv">
              <Camera className="h-4 w-4 mr-2 hidden md:inline" />
              GoCV
            </TabsTrigger>
            <TabsTrigger value="eyewitness">
              <Scan className="h-4 w-4 mr-2 hidden md:inline" />
              EyeWitness
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="openalpr">{renderOpenALPRForm()}</TabsContent>
          <TabsContent value="darknet">{renderDarknetForm()}</TabsContent>
          <TabsContent value="tensorflow">{renderTensorFlowForm()}</TabsContent>
          <TabsContent value="live555">{renderLive555Form()}</TabsContent>
          <TabsContent value="gocv">{renderGoCVForm()}</TabsContent>
          <TabsContent value="eyewitness">{renderEyeWitnessForm()}</TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <FileSearch className="h-5 w-5 mr-2" />
              Results
            </h3>
            
            <Textarea
              readOnly
              value={JSON.stringify(results, null, 2)}
              className="min-h-48 font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleProcessing}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {activeTab === 'openalpr' && (
                <>
                  <Car className="h-4 w-4 mr-2" />
                  Recognize License Plates
                </>
              )}
              {activeTab === 'darknet' && (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Detect Objects with YOLO
                </>
              )}
              {activeTab === 'tensorflow' && (
                <>
                  <BarChart className="h-4 w-4 mr-2" />
                  Process with TensorFlow
                </>
              )}
              {activeTab === 'live555' && (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  {live555Mode === 'server' ? 'Start RTSP Server' : 'Process RTSP Stream'}
                </>
              )}
              {activeTab === 'gocv' && (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Process with GoCV
                </>
              )}
              {activeTab === 'eyewitness' && (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan with EyeWitness
                </>
              )}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComputerVisionTools;

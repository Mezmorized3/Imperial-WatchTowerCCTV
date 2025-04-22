
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Camera, Image, Video, Eye, Loader2, Car, FileImage, 
  User, Layers, Cpu, Terminal, Monitor
} from 'lucide-react';
import { 
  executeLive555,
  executeGoCV, 
  executeOpenALPR,
  executeTensorFlow,
  executeDarknet,
  executeEyeWitness,
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeMotionEye 
} from '@/utils/osintTools';

const ComputerVisionTools: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('opencv');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // OpenCV state
  const [opencvSource, setOpencvSource] = useState('');
  const [opencvOperation, setOpencvOperation] = useState<'detect_faces' | 'detect_objects' | 'motion_detection' | 'text_recognition'>('detect_objects');
  const [opencvConfidence, setOpencvConfidence] = useState(0.5);
  const [opencvShowProcessing, setOpencvShowProcessing] = useState(true);
  
  // OpenALPR state
  const [openalprImage, setOpenalprImage] = useState('');
  const [openalprCountry, setOpenalprCountry] = useState<'us' | 'eu' | 'gb' | 'au' | 'kr'>('us');
  const [openalprConfidence, setOpenalprConfidence] = useState(0.75);
  const [openalprTopN, setOpenalprTopN] = useState(10);
  
  // Darknet YOLO state
  const [darknetSource, setDarknetSource] = useState('');
  const [darknetModel, setDarknetModel] = useState<'yolov4' | 'yolov4-tiny' | 'yolov3' | 'yolov3-tiny'>('yolov4');
  const [darknetConfidence, setDarknetConfidence] = useState(0.25);
  const [darknetClasses, setDarknetClasses] = useState<string[]>(['person', 'car', 'truck', 'bicycle', 'motorcycle']);
  const [darknetContinuous, setDarknetContinuous] = useState(false);
  
  // TensorFlow state
  const [tensorflowSource, setTensorflowSource] = useState('');
  const [tensorflowModel, setTensorflowModel] = useState<'ssd_mobilenet' | 'faster_rcnn' | 'efficientdet' | 'centernet'>('ssd_mobilenet');
  const [tensorflowConfidence, setTensorflowConfidence] = useState(0.5);
  const [tensorflowContinuous, setTensorflowContinuous] = useState(false);
  
  // Deepstack state
  const [deepstackUrl, setDeepstackUrl] = useState('');
  const [deepstackType, setDeepstackType] = useState<'object' | 'face' | 'scene'>('object');
  const [deepstackConfidence, setDeepstackConfidence] = useState(0.7);
  const [deepstackInterval, setDeepstackInterval] = useState(1);
  
  // Face Recognition state
  const [faceImage, setFaceImage] = useState('');
  const [faceKnown, setFaceKnown] = useState(true);
  const [faceAge, setFaceAge] = useState(true);
  const [faceGender, setFaceGender] = useState(true);
  const [faceEmotion, setFaceEmotion] = useState(true);
  const [faceConfidence, setFaceConfidence] = useState(0.6);
  
  // Motion state
  const [motionStream, setMotionStream] = useState('');
  const [motionThreshold, setMotionThreshold] = useState(25);
  const [motionDetect, setMotionDetect] = useState(true);
  const [motionRecord, setMotionRecord] = useState(true);
  const [motionNotify, setMotionNotify] = useState(false);
  
  // MotionEye state
  const [motioneyeUrl, setMotioneyeUrl] = useState('');
  const [motioneyeResolution, setMotioneyeResolution] = useState<'hd' | 'full-hd' | '720p' | '1080p' | 'custom'>('hd');
  const [motioneyeFramerate, setMotioneyeFramerate] = useState(10);
  const [motioneyeMode, setMotioneyeMode] = useState<'motion' | 'continuous' | 'manual'>('motion');
  const [motioneyeRetention, setMotioneyeRetention] = useState(7);
  
  // Live555 state
  const [live555Source, setLive555Source] = useState('');
  const [live555Port, setLive555Port] = useState('8554');
  const [live555Transport, setLive555Transport] = useState<'udp' | 'tcp' | 'http'>('tcp');
  const [live555Record, setLive555Record] = useState(false);
  const [live555Path, setLive555Path] = useState('/tmp/recordings');
  
  // GoCV state
  const [gocvSource, setGocvSource] = useState('');
  const [gocvOperation, setGocvOperation] = useState<'detect' | 'track' | 'classify'>('detect');
  const [gocvDisplay, setGocvDisplay] = useState(true);
  const [gocvSave, setGocvSave] = useState(false);
  
  // EyeWitness state
  const [eyewitnessTargets, setEyewitnessTargets] = useState('');
  const [eyewitnessWeb, setEyewitnessWeb] = useState(true);
  const [eyewitnessRdp, setEyewitnessRdp] = useState(false);
  const [eyewitnessVnc, setEyewitnessVnc] = useState(false);
  const [eyewitnessThreads, setEyewitnessThreads] = useState(10);
  const [eyewitnessTimeout, setEyewitnessTimeout] = useState(30);
  
  const handleExecute = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch(activeTab) {
        case 'opencv':
          if (!opencvSource) {
            throw new Error('Please enter a source URL or file path');
          }
          
          result = await executeOpenCV({
            source: opencvSource,
            operation: opencvOperation,
            confidence: opencvConfidence,
            showProcessing: opencvShowProcessing,
            saveResults: true
          });
          
          if (result.success) {
            toast({
              title: "OpenCV Processing Complete",
              description: `Processed ${result.data.frames || 1} frames`
            });
          }
          break;
          
        case 'openalpr':
          if (!openalprImage) {
            throw new Error('Please enter an image URL or file path');
          }
          
          result = await executeOpenALPR({
            image: openalprImage,
            country: openalprCountry,
            confidence: openalprConfidence,
            topN: openalprTopN
          });
          
          if (result.success) {
            toast({
              title: "License Plate Recognition Complete",
              description: `Found ${result.data.plates?.length || 0} license plates`
            });
          }
          break;
          
        case 'darknet':
          if (!darknetSource) {
            throw new Error('Please enter a source URL or file path');
          }
          
          result = await executeDarknet({
            source: darknetSource,
            model: darknetModel,
            confidence: darknetConfidence,
            classes: darknetClasses,
            continuous: darknetContinuous
          });
          
          if (result.success) {
            toast({
              title: "YOLO Detection Complete",
              description: `Found ${result.data.detections?.length || 0} objects`
            });
          }
          break;
          
        case 'tensorflow':
          if (!tensorflowSource) {
            throw new Error('Please enter a source URL or file path');
          }
          
          result = await executeTensorFlow({
            source: tensorflowSource,
            model: tensorflowModel,
            confidence: tensorflowConfidence,
            continuous: tensorflowContinuous
          });
          
          if (result.success) {
            toast({
              title: "TensorFlow Detection Complete",
              description: `Found ${result.data.detections?.length || 0} objects`
            });
          }
          break;
          
        case 'deepstack':
          if (!deepstackUrl) {
            throw new Error('Please enter a stream URL');
          }
          
          result = await executeDeepstack({
            streamUrl: deepstackUrl,
            detectionType: deepstackType,
            confidence: deepstackConfidence,
            interval: deepstackInterval,
            returnImage: true,
            saveDetections: true
          });
          
          if (result.success) {
            toast({
              title: "Deepstack Analysis Complete",
              description: `Found ${result.data.detections?.length || 0} ${deepstackType}s`
            });
          }
          break;
          
        case 'face-recognition':
          if (!faceImage) {
            throw new Error('Please enter an image URL or file path');
          }
          
          result = await executeFaceRecognition({
            image: faceImage,
            knownFaces: faceKnown,
            detectAge: faceAge,
            detectGender: faceGender,
            detectEmotion: faceEmotion,
            minConfidence: faceConfidence
          });
          
          if (result.success) {
            toast({
              title: "Face Recognition Complete",
              description: `Found ${result.data.faces?.length || 0} faces`
            });
          }
          break;
          
        case 'motion':
          if (!motionStream) {
            throw new Error('Please enter a stream URL');
          }
          
          result = await executeMotion({
            streamUrl: motionStream,
            threshold: motionThreshold,
            detectMotion: motionDetect,
            recordOnMotion: motionRecord,
            notifyOnMotion: motionNotify,
            saveFrames: motionRecord
          });
          
          if (result.success) {
            toast({
              title: "Motion Detection Started",
              description: `Motion detection is now running on the stream`
            });
          }
          break;
          
        case 'motioneye':
          if (!motioneyeUrl) {
            throw new Error('Please enter a camera URL');
          }
          
          result = await executeMotionEye({
            streamUrl: motioneyeUrl,
            resolution: motioneyeResolution,
            framerate: motioneyeFramerate,
            recordingMode: motioneyeMode,
            retentionDays: motioneyeRetention
          });
          
          if (result.success) {
            toast({
              title: "MotionEye Configuration Complete",
              description: `Camera added to MotionEye system`
            });
          }
          break;
          
        case 'live555':
          if (!live555Source) {
            throw new Error('Please enter a source URL');
          }
          
          result = await executeLive555({
            source: live555Source,
            port: parseInt(live555Port),
            transport: live555Transport,
            record: live555Record,
            recordPath: live555Path
          });
          
          if (result.success) {
            toast({
              title: "Live555 Stream Started",
              description: `Stream is now available at rtsp://localhost:${live555Port}/stream`
            });
          }
          break;
          
        case 'gocv':
          if (!gocvSource) {
            throw new Error('Please enter a source URL or file path');
          }
          
          result = await executeGoCV({
            source: gocvSource,
            operation: gocvOperation,
            display: gocvDisplay,
            save: gocvSave
          });
          
          if (result.success) {
            toast({
              title: "GoCV Processing Complete",
              description: `Processed ${result.data.frames || 1} frames`
            });
          }
          break;
          
        case 'eyewitness':
          if (!eyewitnessTargets) {
            throw new Error('Please enter at least one target');
          }
          
          result = await executeEyeWitness({
            targets: eyewitnessTargets.split(','),
            web: eyewitnessWeb,
            rdp: eyewitnessRdp,
            vnc: eyewitnessVnc,
            threads: eyewitnessThreads,
            timeout: eyewitnessTimeout
          });
          
          if (result.success) {
            toast({
              title: "EyeWitness Scan Complete",
              description: `Captured ${result.data.captures?.length || 0} screenshots`
            });
          }
          break;
      }
      
      if (result && result.success) {
        setResults(result.data);
      } else if (result) {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error(`Error during ${activeTab} execution:`, error);
      toast({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Error`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderOpenCVForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="opencv-source">Source URL/File</Label>
        <Input
          id="opencv-source"
          placeholder="rtsp://camera.example.com/stream or /path/to/video.mp4"
          value={opencvSource}
          onChange={(e) => setOpencvSource(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP stream, webcam (0), video file, or image URL</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="opencv-operation">Operation</Label>
        <Select value={opencvOperation} onValueChange={(value: any) => setOpencvOperation(value)}>
          <SelectTrigger id="opencv-operation">
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="detect_objects">Object Detection</SelectItem>
            <SelectItem value="detect_faces">Face Detection</SelectItem>
            <SelectItem value="motion_detection">Motion Detection</SelectItem>
            <SelectItem value="text_recognition">Text Recognition (OCR)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="opencv-confidence">Confidence Threshold</Label>
          <span className="text-sm text-gray-500">{(opencvConfidence * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="opencv-confidence"
          value={[opencvConfidence]}
          min={0.1}
          max={0.9}
          step={0.05}
          onValueChange={(values) => setOpencvConfidence(values[0])}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="opencv-show-processing"
          checked={opencvShowProcessing}
          onCheckedChange={(checked) => setOpencvShowProcessing(!!checked)}
        />
        <Label htmlFor="opencv-show-processing">Show Processing Results</Label>
      </div>
    </div>
  );
  
  const renderOpenALPRForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="openalpr-image">Image URL/File</Label>
        <Input
          id="openalpr-image"
          placeholder="https://example.com/car.jpg or /path/to/image.jpg"
          value={openalprImage}
          onChange={(e) => setOpenalprImage(e.target.value)}
        />
        <p className="text-xs text-gray-500">Image URL or local file path containing license plates</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="openalpr-country">Country/Region</Label>
        <Select value={openalprCountry} onValueChange={(value: any) => setOpenalprCountry(value)}>
          <SelectTrigger id="openalpr-country">
            <SelectValue placeholder="Select country/region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="gb">Great Britain</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
            <SelectItem value="kr">South Korea</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="openalpr-confidence">Confidence Threshold</Label>
            <span className="text-sm text-gray-500">{(openalprConfidence * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="openalpr-confidence"
            value={[openalprConfidence]}
            min={0.1}
            max={0.95}
            step={0.05}
            onValueChange={(values) => setOpenalprConfidence(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="openalpr-topn">Top N Results</Label>
          <Input
            id="openalpr-topn"
            type="number"
            value={openalprTopN}
            onChange={(e) => setOpenalprTopN(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
  
  const renderDarknetForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="darknet-source">Source URL/File</Label>
        <Input
          id="darknet-source"
          placeholder="rtsp://camera.example.com/stream or /path/to/video.mp4"
          value={darknetSource}
          onChange={(e) => setDarknetSource(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP stream, webcam (0), video file, or image URL</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="darknet-model">YOLO Model</Label>
        <Select value={darknetModel} onValueChange={(value: any) => setDarknetModel(value)}>
          <SelectTrigger id="darknet-model">
            <SelectValue placeholder="Select YOLO model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yolov4">YOLOv4 (Accurate)</SelectItem>
            <SelectItem value="yolov4-tiny">YOLOv4-Tiny (Fast)</SelectItem>
            <SelectItem value="yolov3">YOLOv3 (Balanced)</SelectItem>
            <SelectItem value="yolov3-tiny">YOLOv3-Tiny (Fastest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="darknet-confidence">Confidence Threshold</Label>
          <span className="text-sm text-gray-500">{(darknetConfidence * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="darknet-confidence"
          value={[darknetConfidence]}
          min={0.1}
          max={0.9}
          step={0.05}
          onValueChange={(values) => setDarknetConfidence(values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Classes to Detect</Label>
        <div className="grid grid-cols-2 gap-2">
          {['person', 'car', 'truck', 'bicycle', 'motorcycle', 'bus', 'dog', 'cat', 'backpack', 'umbrella'].map((cls) => (
            <div key={cls} className="flex items-center space-x-2">
              <Checkbox
                id={`class-${cls}`}
                checked={darknetClasses.includes(cls)}
                onCheckedChange={(checked) => {
                  setDarknetClasses(checked 
                    ? [...darknetClasses, cls] 
                    : darknetClasses.filter(c => c !== cls)
                  );
                }}
              />
              <Label htmlFor={`class-${cls}`} className="capitalize">{cls}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="darknet-continuous"
          checked={darknetContinuous}
          onCheckedChange={(checked) => setDarknetContinuous(!!checked)}
        />
        <Label htmlFor="darknet-continuous">Continuous Detection</Label>
      </div>
    </div>
  );
  
  const renderTensorFlowForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tensorflow-source">Source URL/File</Label>
        <Input
          id="tensorflow-source"
          placeholder="rtsp://camera.example.com/stream or /path/to/video.mp4"
          value={tensorflowSource}
          onChange={(e) => setTensorflowSource(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP stream, webcam (0), video file, or image URL</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tensorflow-model">Object Detection Model</Label>
        <Select value={tensorflowModel} onValueChange={(value: any) => setTensorflowModel(value)}>
          <SelectTrigger id="tensorflow-model">
            <SelectValue placeholder="Select TensorFlow model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ssd_mobilenet">SSD MobileNet (Fast)</SelectItem>
            <SelectItem value="faster_rcnn">Faster R-CNN (Accurate)</SelectItem>
            <SelectItem value="efficientdet">EfficientDet (Balanced)</SelectItem>
            <SelectItem value="centernet">CenterNet (Experimental)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="tensorflow-confidence">Confidence Threshold</Label>
          <span className="text-sm text-gray-500">{(tensorflowConfidence * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="tensorflow-confidence"
          value={[tensorflowConfidence]}
          min={0.1}
          max={0.9}
          step={0.05}
          onValueChange={(values) => setTensorflowConfidence(values[0])}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="tensorflow-continuous"
          checked={tensorflowContinuous}
          onCheckedChange={(checked) => setTensorflowContinuous(!!checked)}
        />
        <Label htmlFor="tensorflow-continuous">Continuous Detection</Label>
      </div>
    </div>
  );
  
  const renderDeepstackForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deepstack-url">Stream URL</Label>
        <Input
          id="deepstack-url"
          placeholder="rtsp://camera.example.com/stream"
          value={deepstackUrl}
          onChange={(e) => setDeepstackUrl(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP or HTTP video stream URL</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deepstack-type">Detection Type</Label>
        <Select value={deepstackType} onValueChange={(value: any) => setDeepstackType(value)}>
          <SelectTrigger id="deepstack-type">
            <SelectValue placeholder="Select detection type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="object">Object Detection</SelectItem>
            <SelectItem value="face">Face Detection</SelectItem>
            <SelectItem value="scene">Scene Recognition</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="deepstack-confidence">Confidence Threshold</Label>
            <span className="text-sm text-gray-500">{(deepstackConfidence * 100).toFixed(0)}%</span>
          </div>
          <Slider
            id="deepstack-confidence"
            value={[deepstackConfidence]}
            min={0.1}
            max={0.95}
            step={0.05}
            onValueChange={(values) => setDeepstackConfidence(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deepstack-interval">Processing Interval (seconds)</Label>
          <Input
            id="deepstack-interval"
            type="number"
            value={deepstackInterval}
            onChange={(e) => setDeepstackInterval(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
  
  const renderFaceRecognitionForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="face-image">Image URL/File</Label>
        <Input
          id="face-image"
          placeholder="https://example.com/person.jpg or /path/to/image.jpg"
          value={faceImage}
          onChange={(e) => setFaceImage(e.target.value)}
        />
        <p className="text-xs text-gray-500">Image URL or local file path containing faces</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="face-known"
            checked={faceKnown}
            onCheckedChange={(checked) => setFaceKnown(!!checked)}
          />
          <Label htmlFor="face-known">Match Known Faces</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="face-age"
            checked={faceAge}
            onCheckedChange={(checked) => setFaceAge(!!checked)}
          />
          <Label htmlFor="face-age">Detect Age</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="face-gender"
            checked={faceGender}
            onCheckedChange={(checked) => setFaceGender(!!checked)}
          />
          <Label htmlFor="face-gender">Detect Gender</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="face-emotion"
            checked={faceEmotion}
            onCheckedChange={(checked) => setFaceEmotion(!!checked)}
          />
          <Label htmlFor="face-emotion">Detect Emotion</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="face-confidence">Confidence Threshold</Label>
          <span className="text-sm text-gray-500">{(faceConfidence * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="face-confidence"
          value={[faceConfidence]}
          min={0.1}
          max={0.95}
          step={0.05}
          onValueChange={(values) => setFaceConfidence(values[0])}
        />
      </div>
    </div>
  );
  
  const renderMotionForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="motion-stream">Stream URL</Label>
        <Input
          id="motion-stream"
          placeholder="rtsp://camera.example.com/stream"
          value={motionStream}
          onChange={(e) => setMotionStream(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP or HTTP video stream URL</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="motion-threshold">Motion Threshold</Label>
          <span className="text-sm text-gray-500">{motionThreshold}</span>
        </div>
        <Slider
          id="motion-threshold"
          value={[motionThreshold]}
          min={5}
          max={50}
          step={1}
          onValueChange={(values) => setMotionThreshold(values[0])}
        />
        <p className="text-xs text-gray-500">Lower values are more sensitive (detect smaller movements)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="motion-detect"
            checked={motionDetect}
            onCheckedChange={(checked) => setMotionDetect(!!checked)}
          />
          <Label htmlFor="motion-detect">Detect Motion</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="motion-record"
            checked={motionRecord}
            onCheckedChange={(checked) => setMotionRecord(!!checked)}
          />
          <Label htmlFor="motion-record">Record on Motion</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="motion-notify"
            checked={motionNotify}
            onCheckedChange={(checked) => setMotionNotify(!!checked)}
          />
          <Label htmlFor="motion-notify">Notify on Motion</Label>
        </div>
      </div>
    </div>
  );
  
  const renderMotionEyeForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="motioneye-url">Camera URL</Label>
        <Input
          id="motioneye-url"
          placeholder="rtsp://camera.example.com/stream"
          value={motioneyeUrl}
          onChange={(e) => setMotioneyeUrl(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP, HTTP, or local device path (e.g. /dev/video0)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="motioneye-resolution">Resolution</Label>
          <Select value={motioneyeResolution} onValueChange={(value: any) => setMotioneyeResolution(value)}>
            <SelectTrigger id="motioneye-resolution">
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hd">HD (1280x720)</SelectItem>
              <SelectItem value="full-hd">Full HD (1920x1080)</SelectItem>
              <SelectItem value="720p">720p (1280x720)</SelectItem>
              <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="motioneye-framerate">Framerate (FPS)</Label>
          <Input
            id="motioneye-framerate"
            type="number"
            value={motioneyeFramerate}
            onChange={(e) => setMotioneyeFramerate(parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="motioneye-mode">Recording Mode</Label>
          <Select value={motioneyeMode} onValueChange={(value: any) => setMotioneyeMode(value)}>
            <SelectTrigger id="motioneye-mode">
              <SelectValue placeholder="Select recording mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="motion">Motion-Triggered</SelectItem>
              <SelectItem value="continuous">Continuous</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="motioneye-retention">Retention Days</Label>
          <Input
            id="motioneye-retention"
            type="number"
            value={motioneyeRetention}
            onChange={(e) => setMotioneyeRetention(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
  
  const renderLive555Form = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="live555-source">Source URL/File</Label>
        <Input
          id="live555-source"
          placeholder="rtsp://source.example.com/stream or /path/to/video.mp4"
          value={live555Source}
          onChange={(e) => setLive555Source(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP stream, video file, or device (/dev/video0)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="live555-port">RTSP Port</Label>
          <Input
            id="live555-port"
            placeholder="8554"
            value={live555Port}
            onChange={(e) => setLive555Port(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="live555-transport">Transport Protocol</Label>
          <Select value={live555Transport} onValueChange={(value: any) => setLive555Transport(value)}>
            <SelectTrigger id="live555-transport">
              <SelectValue placeholder="Select transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tcp">TCP (Reliable)</SelectItem>
              <SelectItem value="udp">UDP (Fast)</SelectItem>
              <SelectItem value="http">HTTP (Tunneled)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="live555-record"
          checked={live555Record}
          onCheckedChange={(checked) => setLive555Record(!!checked)}
        />
        <Label htmlFor="live555-record">Record Stream</Label>
      </div>
      
      {live555Record && (
        <div className="space-y-2">
          <Label htmlFor="live555-path">Recording Path</Label>
          <Input
            id="live555-path"
            placeholder="/tmp/recordings"
            value={live555Path}
            onChange={(e) => setLive555Path(e.target.value)}
          />
        </div>
      )}
    </div>
  );
  
  const renderGoCVForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="gocv-source">Source URL/File</Label>
        <Input
          id="gocv-source"
          placeholder="rtsp://camera.example.com/stream or /path/to/video.mp4"
          value={gocvSource}
          onChange={(e) => setGocvSource(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP stream, webcam (0), or video file</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gocv-operation">Operation</Label>
        <Select value={gocvOperation} onValueChange={(value: any) => setGocvOperation(value)}>
          <SelectTrigger id="gocv-operation">
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="detect">Object Detection</SelectItem>
            <SelectItem value="track">Object Tracking</SelectItem>
            <SelectItem value="classify">Image Classification</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="gocv-display"
            checked={gocvDisplay}
            onCheckedChange={(checked) => setGocvDisplay(!!checked)}
          />
          <Label htmlFor="gocv-display">Display Output</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="gocv-save"
            checked={gocvSave}
            onCheckedChange={(checked) => setGocvSave(!!checked)}
          />
          <Label htmlFor="gocv-save">Save Results</Label>
        </div>
      </div>
    </div>
  );
  
  const renderEyeWitnessForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eyewitness-targets">Target IPs/Hostnames</Label>
        <Textarea
          id="eyewitness-targets"
          placeholder="192.168.1.0/24,camera.example.com"
          value={eyewitnessTargets}
          onChange={(e) => setEyewitnessTargets(e.target.value)}
        />
        <p className="text-xs text-gray-500">Comma-separated IPs, hostnames, CIDR ranges, or URLs</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="eyewitness-web"
            checked={eyewitnessWeb}
            onCheckedChange={(checked) => setEyewitnessWeb(!!checked)}
          />
          <Label htmlFor="eyewitness-web">Web (HTTP/HTTPS)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="eyewitness-rdp"
            checked={eyewitnessRdp}
            onCheckedChange={(checked) => setEyewitnessRdp(!!checked)}
          />
          <Label htmlFor="eyewitness-rdp">RDP</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="eyewitness-vnc"
            checked={eyewitnessVnc}
            onCheckedChange={(checked) => setEyewitnessVnc(!!checked)}
          />
          <Label htmlFor="eyewitness-vnc">VNC</Label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eyewitness-threads">Threads</Label>
          <Input
            id="eyewitness-threads"
            type="number"
            placeholder="10"
            value={eyewitnessThreads}
            onChange={(e) => setEyewitnessThreads(parseInt(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="eyewitness-timeout">Timeout (seconds)</Label>
          <Input
            id="eyewitness-timeout"
            type="number"
            placeholder="30"
            value={eyewitnessTimeout}
            onChange={(e) => setEyewitnessTimeout(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
  
  const renderDetections = (detections: any[]) => {
    return (
      <div className="border rounded overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Label</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bounding Box</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {detections.map((detection, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-3 py-2 whitespace-nowrap text-sm">{detection.label || detection.class}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {typeof detection.confidence === 'number' 
                    ? `${(detection.confidence * 100).toFixed(1)}%` 
                    : detection.confidence || 'N/A'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {detection.box 
                    ? `[${detection.box.x}, ${detection.box.y}, ${detection.box.width}, ${detection.box.height}]`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Computer Vision Tools
        </CardTitle>
        <CardDescription>
          Advanced tools for image analysis, object detection, and motion tracking
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 w-full mb-4 overflow-auto">
            <TabsTrigger value="opencv" className="text-xs">
              <Image className="h-4 w-4 mr-1 hidden sm:inline" />
              OpenCV
            </TabsTrigger>
            <TabsTrigger value="openalpr" className="text-xs">
              <Car className="h-4 w-4 mr-1 hidden sm:inline" />
              OpenALPR
            </TabsTrigger>
            <TabsTrigger value="darknet" className="text-xs">
              <Video className="h-4 w-4 mr-1 hidden sm:inline" />
              Darknet
            </TabsTrigger>
            <TabsTrigger value="tensorflow" className="text-xs">
              <Layers className="h-4 w-4 mr-1 hidden sm:inline" />
              TensorFlow
            </TabsTrigger>
            <TabsTrigger value="deepstack" className="text-xs">
              <Cpu className="h-4 w-4 mr-1 hidden sm:inline" />
              Deepstack
            </TabsTrigger>
            <TabsTrigger value="face-recognition" className="text-xs">
              <User className="h-4 w-4 mr-1 hidden sm:inline" />
              Face
            </TabsTrigger>
            <TabsTrigger value="motion" className="text-xs">
              <Video className="h-4 w-4 mr-1 hidden sm:inline" />
              Motion
            </TabsTrigger>
            <TabsTrigger value="motioneye" className="text-xs">
              <Camera className="h-4 w-4 mr-1 hidden sm:inline" />
              MotionEye
            </TabsTrigger>
            <TabsTrigger value="live555" className="text-xs">
              <Monitor className="h-4 w-4 mr-1 hidden sm:inline" />
              Live555
            </TabsTrigger>
            <TabsTrigger value="gocv" className="text-xs">
              <FileImage className="h-4 w-4 mr-1 hidden sm:inline" />
              GoCV
            </TabsTrigger>
            <TabsTrigger value="eyewitness" className="text-xs">
              <Monitor className="h-4 w-4 mr-1 hidden sm:inline" />
              EyeWitness
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="opencv">{renderOpenCVForm()}</TabsContent>
          <TabsContent value="openalpr">{renderOpenALPRForm()}</TabsContent>
          <TabsContent value="darknet">{renderDarknetForm()}</TabsContent>
          <TabsContent value="tensorflow">{renderTensorFlowForm()}</TabsContent>
          <TabsContent value="deepstack">{renderDeepstackForm()}</TabsContent>
          <TabsContent value="face-recognition">{renderFaceRecognitionForm()}</TabsContent>
          <TabsContent value="motion">{renderMotionForm()}</TabsContent>
          <TabsContent value="motioneye">{renderMotionEyeForm()}</TabsContent>
          <TabsContent value="live555">{renderLive555Form()}</TabsContent>
          <TabsContent value="gocv">{renderGoCVForm()}</TabsContent>
          <TabsContent value="eyewitness">{renderEyewitnessForm()}</TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Results
            </h3>
            
            {results.detections && results.detections.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Detections ({results.detections.length})</h4>
                {renderDetections(results.detections)}
              </div>
            )}
            
            {results.faces && results.faces.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Faces ({results.faces.length})</h4>
                {renderDetections(results.faces)}
              </div>
            )}
            
            {results.plates && results.plates.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">License Plates ({results.plates.length})</h4>
                <div className="space-y-2">
                  {results.plates.map((plate: any, index: number) => (
                    <div key={index} className="border rounded p-3">
                      <div className="font-medium">{plate.plate || plate.value || 'Unknown Plate'}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                        <div>
                          <span className="text-gray-500">Confidence:</span> {(plate.confidence * 100).toFixed(1)}%
                        </div>
                        {plate.region && (
                          <div>
                            <span className="text-gray-500">Region:</span> {plate.region}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {results.imageData && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Processed Image</h4>
                <div className="max-w-md mx-auto border rounded overflow-hidden">
                  {results.imageData.startsWith('data:') ? (
                    <img src={results.imageData} className="w-full h-auto" alt="Processed" />
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 text-center">
                      Image data available but cannot be displayed directly
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {results.captures && results.captures.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Screenshots ({results.captures.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.captures.map((capture: any, index: number) => (
                    <div key={index} className="border rounded overflow-hidden">
                      {capture.thumbnail ? (
                        <img src={capture.thumbnail} className="w-full h-auto" alt={capture.target} />
                      ) : (
                        <div className="h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Monitor className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="p-2 text-xs truncate">{capture.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(!results.detections || results.detections.length === 0) && 
             (!results.faces || results.faces.length === 0) &&
             (!results.plates || results.plates.length === 0) &&
             !results.imageData &&
             (!results.captures || results.captures.length === 0) && (
              <Textarea
                readOnly
                value={JSON.stringify(results, null, 2)}
                className="min-h-48 font-mono text-sm"
              />
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Run {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComputerVisionTools;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Play, Film, Camera } from 'lucide-react';
import { FFmpegParams } from '@/utils/types/osintToolTypes';
import { executeFFmpeg } from '@/utils/osintUtilsConnector';

interface FFmpegToolProps {
  onResult?: (result: any) => void;
}

const FFmpegTool: React.FC<FFmpegToolProps> = ({ onResult }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [outputFileName, setOutputFileName] = useState('output.mp4');
  const [activeTab, setActiveTab] = useState('converter');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Conversion settings
  const [duration, setDuration] = useState('');
  const [videoCodec, setVideoCodec] = useState('copy');
  const [audioCodec, setAudioCodec] = useState('copy');
  const [resolution, setResolution] = useState('');
  const [bitrate, setBitrate] = useState('');
  const [framerate, setFramerate] = useState('');
  const [applyFilters, setApplyFilters] = useState(false);
  
  const executeConverter = async () => {
    if (!inputUrl) return;
    
    setIsExecuting(true);
    
    try {
      const params: FFmpegParams = {
        tool: 'ffmpeg',
        operation: 'convert',
        input: inputUrl,
        output: outputFileName,
        duration: duration || undefined,
        videoCodec,
        audioCodec,
        resolution: resolution || undefined,
        bitrate: bitrate || undefined,
        framerate: framerate || undefined
      };
      
      const result = await executeFFmpeg(params);
      setResult(result);
      
      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error('Error executing FFmpeg:', error);
      setResult({ success: false, error: String(error) });
    } finally {
      setIsExecuting(false);
    }
  };
  
  const executeCameraCapture = async () => {
    if (!inputUrl) return;
    
    setIsExecuting(true);
    
    try {
      const params: FFmpegParams = {
        tool: 'ffmpeg',
        operation: 'record',
        input: inputUrl,
        output: outputFileName,
        duration: duration || undefined,
        videoCodec,
        audioCodec,
        resolution: resolution || undefined
      };
      
      const result = await executeFFmpeg(params);
      setResult(result);
      
      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error('Error executing camera capture:', error);
      setResult({ success: false, error: String(error) });
    } finally {
      setIsExecuting(false);
    }
  };
  
  const executeStreamProcessor = async () => {
    if (!inputUrl) return;
    
    setIsExecuting(true);
    
    try {
      const params: FFmpegParams = {
        tool: 'ffmpeg',
        operation: 'stream',
        input: inputUrl,
        output: outputFileName,
        videoCodec,
        audioCodec,
        resolution: resolution || undefined,
        bitrate: bitrate || undefined,
        framerate: framerate || undefined,
        filters: applyFilters ? ['denoise'] : undefined
      };
      
      const result = await executeFFmpeg(params);
      setResult(result);
      
      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error('Error processing stream:', error);
      setResult({ success: false, error: String(error) });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Film className="h-5 w-5 text-purple-400 mr-2" />
          FFmpeg Toolkit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-scanner-dark-alt">
            <TabsTrigger value="converter">
              <Video className="h-4 w-4 mr-2" />
              Converter
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="processor">
              <Play className="h-4 w-4 mr-2" />
              Stream
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="converter" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="input-url">Input URL/File</Label>
              <Input
                id="input-url"
                placeholder="rtsp://username:password@192.168.1.100:554/stream"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="output-file">Output Filename</Label>
              <Input
                id="output-file"
                placeholder="output.mp4"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (optional)</Label>
                <Input
                  id="duration"
                  placeholder="30s, 1m, 2h"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution (optional)</Label>
                <Input
                  id="resolution"
                  placeholder="1280x720"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video-codec">Video Codec</Label>
                <Select value={videoCodec} onValueChange={setVideoCodec}>
                  <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                    <SelectValue placeholder="Select codec" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copy">copy (passthrough)</SelectItem>
                    <SelectItem value="h264">h264</SelectItem>
                    <SelectItem value="h265">h265</SelectItem>
                    <SelectItem value="vp9">vp9</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audio-codec">Audio Codec</Label>
                <Select value={audioCodec} onValueChange={setAudioCodec}>
                  <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                    <SelectValue placeholder="Select codec" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copy">copy (passthrough)</SelectItem>
                    <SelectItem value="aac">aac</SelectItem>
                    <SelectItem value="mp3">mp3</SelectItem>
                    <SelectItem value="opus">opus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={executeConverter}
              disabled={isExecuting || !inputUrl}
              className="w-full"
            >
              {isExecuting ? "Processing..." : "Convert Video"}
            </Button>
          </TabsContent>
          
          <TabsContent value="camera" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="camera-url">Camera URL</Label>
              <Input
                id="camera-url"
                placeholder="rtsp://username:password@192.168.1.100:554/stream"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recording-file">Recording Filename</Label>
              <Input
                id="recording-file"
                placeholder="camera_recording.mp4"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recording-duration">Recording Duration</Label>
              <Input
                id="recording-duration"
                placeholder="30s, 1m, 1h"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <Button
              onClick={executeCameraCapture}
              disabled={isExecuting || !inputUrl}
              className="w-full"
            >
              {isExecuting ? "Recording..." : "Record Camera Feed"}
            </Button>
          </TabsContent>
          
          <TabsContent value="processor" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="stream-url">Stream URL</Label>
              <Input
                id="stream-url"
                placeholder="rtsp://username:password@192.168.1.100:554/stream"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="output-stream">Output Stream</Label>
              <Input
                id="output-stream"
                placeholder="processed.m3u8"
                value={outputFileName}
                onChange={(e) => setOutputFileName(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stream-bitrate">Bitrate (optional)</Label>
                <Input
                  id="stream-bitrate"
                  placeholder="1M"
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stream-framerate">Framerate (optional)</Label>
                <Input
                  id="stream-framerate"
                  placeholder="30"
                  value={framerate}
                  onChange={(e) => setFramerate(e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="apply-filters"
                checked={applyFilters}
                onCheckedChange={(checked) => setApplyFilters(checked === true)}
              />
              <Label htmlFor="apply-filters">Apply denoising filter</Label>
            </div>
            
            <Button
              onClick={executeStreamProcessor}
              disabled={isExecuting || !inputUrl}
              className="w-full"
            >
              {isExecuting ? "Processing..." : "Process Stream"}
            </Button>
          </TabsContent>
        </Tabs>
        
        {result && (
          <div className="mt-4 p-4 bg-scanner-dark-alt border border-gray-700 rounded">
            <h3 className="text-sm font-semibold mb-2">Result:</h3>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FFmpegTool;

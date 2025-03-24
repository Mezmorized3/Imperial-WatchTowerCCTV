import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Play, Download, Video } from 'lucide-react';
import { executeFFmpeg } from '@/utils/osintTools';
import { FFmpegParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const ffmpegConvertRtspToHls = async (inputStream: string) => {
  const params: FFmpegParams = {
    input: inputStream,
    output: `output_${Date.now()}.m3u8`,
    videoCodec: 'h264',
    outputFormat: 'hls'
  };
  return executeFFmpeg(params);
};

const ffmpegRecordStream = async (inputStream: string) => {
  const params: FFmpegParams = {
    input: inputStream,
    output: `recording_${Date.now()}.mp4`,
    videoCodec: 'h264',
    outputFormat: 'mp4'
  };
  return executeFFmpeg(params);
};

const applyMotionDetection = async (inputStream: string) => {
  const params: FFmpegParams = {
    input: inputStream,
    output: `motion_${Date.now()}.mp4`,
    filters: ['motion=0.5'],
    options: { detectMotion: true }
  };
  return executeFFmpeg(params);
};

const FFmpegTool: React.FC = () => {
  const [inputStream, setInputStream] = useState<string>('rtsp://admin:admin@192.168.1.10:554/stream1');
  const [outputFormat, setOutputFormat] = useState<string>('mp4');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isDetectingMotion, setIsDetectingMotion] = useState<boolean>(false);
  const [results, setResults] = useState<string | null>(null);
  const [enableHighQuality, setEnableHighQuality] = useState<boolean>(false);
  const { toast } = useToast();

  const handleConvertStream = async () => {
    try {
      setIsConverting(true);
      setResults(null);
      
      const result = await ffmpegConvertRtspToHls(inputStream);
      
      if (result.success) {
        toast({
          title: "Conversion Started",
          description: "Stream conversion to HLS format initiated",
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Conversion Failed",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error converting stream:", error);
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleRecordStream = async () => {
    try {
      setIsRecording(true);
      setResults(null);
      
      const result = await ffmpegRecordStream(inputStream);
      
      if (result.success) {
        toast({
          title: "Recording Started",
          description: "Stream recording initiated",
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Recording Failed",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error recording stream:", error);
      toast({
        title: "Recording Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  const handleMotionDetection = async () => {
    try {
      setIsDetectingMotion(true);
      setResults(null);
      
      const result = await applyMotionDetection(inputStream);
      
      if (result.success) {
        toast({
          title: "Motion Detection Active",
          description: "Motion detection analysis started",
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Motion Detection Failed",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error with motion detection:", error);
      toast({
        title: "Motion Detection Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDetectingMotion(false);
    }
  };

  const handleCustomFFmpeg = async () => {
    try {
      setIsConverting(true);
      setResults(null);
      
      const params: FFmpegParams = {
        input: inputStream,
        output: `output_${Date.now()}.${outputFormat}`,
        videoCodec: enableHighQuality ? 'libx264' : 'h264_nvenc',
        bitrate: enableHighQuality ? '2000k' : '800k'
      };
      
      const result = await executeFFmpeg(params);
      
      if (result.success) {
        toast({
          title: "FFmpeg Execution Started",
          description: "Custom FFmpeg command execution initiated",
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "FFmpeg Execution Failed",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing FFmpeg:", error);
      toast({
        title: "FFmpeg Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Video className="mr-2 h-5 w-5" />
          FFmpeg Video Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="inputStream">RTSP Stream URL</Label>
          <Input
            id="inputStream"
            placeholder="rtsp://username:password@192.168.1.10:554/stream1"
            className="bg-scanner-dark border-gray-700"
            value={inputStream}
            onChange={(e) => setInputStream(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="outputFormat">Output Format</Label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="mkv">MKV</SelectItem>
                <SelectItem value="avi">AVI</SelectItem>
                <SelectItem value="mov">MOV</SelectItem>
                <SelectItem value="hls">HLS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-6">
            <Switch 
              id="high-quality" 
              checked={enableHighQuality}
              onCheckedChange={setEnableHighQuality}
            />
            <Label htmlFor="high-quality">High Quality Encoding</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={handleConvertStream}
            disabled={isConverting || !inputStream}
            className={`${isConverting ? 'bg-scanner-info/20' : 'bg-scanner-dark-alt'} border-scanner-info text-scanner-info`}
          >
            {isConverting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Convert to HLS
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRecordStream}
            disabled={isRecording || !inputStream}
            className={`${isRecording ? 'bg-scanner-info/20' : 'bg-scanner-dark-alt'} border-scanner-info text-scanner-info`}
          >
            {isRecording ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Record Stream
          </Button>
          
          <Button
            variant="outline"
            onClick={handleMotionDetection}
            disabled={isDetectingMotion || !inputStream}
            className={`${isDetectingMotion ? 'bg-scanner-info/20' : 'bg-scanner-dark-alt'} border-scanner-info text-scanner-info`}
          >
            {isDetectingMotion ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
            Motion Detection
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCustomFFmpeg}
            disabled={isConverting || !inputStream}
            className={`${isConverting ? 'bg-scanner-info/20' : 'bg-scanner-dark-alt'} border-scanner-info text-scanner-info`}
          >
            {isConverting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Custom FFmpeg
          </Button>
        </div>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Result:</h3>
            <pre className="bg-scanner-dark p-3 rounded text-xs overflow-x-auto">
              {results}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FFmpegTool;

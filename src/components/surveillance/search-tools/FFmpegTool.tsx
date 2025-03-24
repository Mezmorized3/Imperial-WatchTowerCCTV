import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Camera, Download, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeFFmpeg, ffmpegConvertRtspToHls, ffmpegRecordStream, applyMotionDetection } from '@/utils/osintTools';

interface FFmpegToolProps {
  onProcessComplete?: (outputPath: string) => void;
}

const FFmpegTool: React.FC<FFmpegToolProps> = ({ onProcessComplete }) => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [hlsOutput, setHlsOutput] = useState('output.m3u8');
  const [recordOutput, setRecordOutput] = useState('recorded_stream.mp4');
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [customOptions, setCustomOptions] = useState('');
  const [videoCodec, setVideoCodec] = useState('libx264');
  const [audioCodec, setAudioCodec] = useState('aac');
  const [customFormat, setCustomFormat] = useState('mp4');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleConvertRtspToHls = async () => {
    if (!rtspUrl) {
      toast({
        title: "Error",
        description: "Please enter an RTSP URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await ffmpegConvertRtspToHls({
        input: rtspUrl,
        output: hlsOutput || "output.m3u8",
        format: "hls",
        options: [`-c:v ${videoCodec}`, `-c:a ${audioCodec}`]
      });
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onProcessComplete) {
          onProcessComplete(hlsOutput || "output.m3u8");
        }
        
        toast({
          title: "Conversion Complete",
          description: `RTSP stream converted to HLS successfully`
        });
      } else {
        toast({
          title: "Conversion Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during conversion:", error);
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRecord = async () => {
    if (!rtspUrl) {
      toast({
        title: "Error",
        description: "Please enter an RTSP URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await ffmpegRecordStream({
        input: rtspUrl,
        output: recordOutput || "recorded_stream.mp4",
        options: ["detectMotion" as any] // Use a string option
      });
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onProcessComplete) {
          onProcessComplete(recordOutput || "recorded_stream.mp4");
        }
        
        toast({
          title: "Recording Complete",
          description: `Stream recorded successfully`
        });
      } else {
        toast({
          title: "Recording Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during recording:", error);
      toast({
        title: "Recording Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCustomCommand = async () => {
    if (!customInput || !customOutput) {
      toast({
        title: "Error",
        description: "Please enter both input and output paths",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await executeFFmpeg({
        input: customInput,
        output: customOutput,
        options: customOptions.split(' '),
        videoCodec,
        audioCodec,
        format: customFormat
        // Remove bitrate property
      });
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onProcessComplete) {
          onProcessComplete(customOutput);
        }
        
        toast({
          title: "FFmpeg Command Complete",
          description: `Command executed successfully`
        });
      } else {
        toast({
          title: "Command Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during command execution:", error);
      toast({
        title: "Command Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="h-5 w-5 text-scanner-success mr-2" />
          FFmpeg Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rtsp-url">RTSP URL</Label>
          <Input
            id="rtsp-url"
            placeholder="rtsp://example.com/live"
            value={rtspUrl}
            onChange={(e) => setRtspUrl(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hls-output">HLS Output</Label>
            <Input
              id="hls-output"
              placeholder="output.m3u8"
              value={hlsOutput}
              onChange={(e) => setHlsOutput(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div>
            <Label htmlFor="record-output">Record Output</Label>
            <Input
              id="record-output"
              placeholder="recorded_stream.mp4"
              value={recordOutput}
              onChange={(e) => setRecordOutput(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="video-codec">Video Codec</Label>
            <Select value={videoCodec} onValueChange={setVideoCodec}>
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select video codec" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="libx264">H.264 (libx264)</SelectItem>
                <SelectItem value="libx265">H.265 (libx265)</SelectItem>
                <SelectItem value="copy">Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="audio-codec">Audio Codec</Label>
            <Select value={audioCodec} onValueChange={setAudioCodec}>
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select audio codec" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="aac">AAC</SelectItem>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="copy">Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={handleConvertRtspToHls}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Convert to HLS
          </Button>
          
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-scanner-dark-alt"
            onClick={handleRecord}
            disabled={isLoading}
          >
            <Camera className="h-4 w-4 mr-2" />
            Record Stream
          </Button>
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold mb-2">Custom Command</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-input">Input Path</Label>
              <Input
                id="custom-input"
                placeholder="/path/to/input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div>
              <Label htmlFor="custom-output">Output Path</Label>
              <Input
                id="custom-output"
                placeholder="/path/to/output"
                value={customOutput}
                onChange={(e) => setCustomOutput(e.target.value)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-format">Format</Label>
              <Select value={customFormat} onValueChange={setCustomFormat}>
                <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="avi">AVI</SelectItem>
                  <SelectItem value="mkv">MKV</SelectItem>
                  <SelectItem value="flv">FLV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="custom-options">Options</Label>
            <Input
              id="custom-options"
              placeholder="-c:v libx264 -c:a aac"
              value={customOptions}
              onChange={(e) => setCustomOptions(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <Button
            variant="default"
            className="bg-scanner-primary"
            onClick={handleCustomCommand}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Execute Command
          </Button>
        </div>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Results</h3>
            <pre className="text-xs text-gray-400 bg-scanner-dark-alt border border-gray-700 rounded-md p-2">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FFmpegTool;

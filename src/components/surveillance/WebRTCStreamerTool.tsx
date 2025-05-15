// @ts-nocheck // TODO: FIX TYPES
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play, StopCircle, Settings, Loader2, LinkIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeWebRTCStreamer } from '@/utils/osintImplementations/streamingTools'; // Corrected import path
import { WebRTCStreamerParams, WebRTCStreamerResult, WebRTCStreamerData } from '@/utils/types/streamingToolTypes'; // Assuming types exist

const WebRTCStreamerTool: React.FC = () => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [streamName, setStreamName] = useState('live/stream1');
  const [isLoading, setIsLoading] = useState(false);
  const [streamData, setStreamData] = useState<WebRTCStreamerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartStream = async () => {
    if (!rtspUrl) {
      toast({ title: 'Error', description: 'RTSP URL is required.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setStreamData(null);
    setError(null);

    const params: WebRTCStreamerParams = {
      action: 'start',
      rtsp_url: rtspUrl,
      stream_name: streamName,
      options: {
        video_codec: 'h264', // Example option
        audio_codec: 'aac',  // Example option
      }
    };

    try {
      const response: WebRTCStreamerResult = await executeWebRTCStreamer(params);
      if (response.success) {
        setStreamData(response.data);
        toast({
          title: 'Stream Started',
          description: `WebRTC stream available at ${response.data.webrtc_url}`,
        });
        // Attempt to play if videoRef and URL exist
        if (videoRef.current && response.data.webrtc_url) {
          // This is a conceptual step. Actual WebRTC connection is more complex.
          // For a real player, you'd use a WebRTC client library.
          // For now, we just show the URL.
          console.log("WebRTC URL for manual connection:", response.data.webrtc_url);
        }
      } else {
        setError(response.error || 'Failed to start WebRTC stream.');
        toast({
          title: 'Stream Error',
          description: response.error || 'Failed to start WebRTC stream.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: 'Stream Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopStream = async () => {
    // Similar logic for stopping, using action: 'stop'
    if (!streamData?.stream_id) {
        toast({ title: 'Info', description: 'No active stream to stop.' });
        return;
    }
    setIsLoading(true);
    const params: WebRTCStreamerParams = {
      action: 'stop',
      stream_id: streamData.stream_id,
    };
    try {
        const response = await executeWebRTCStreamer(params);
        if (response.success) {
            setStreamData(null);
            toast({ title: 'Stream Stopped', description: 'WebRTC stream has been stopped.' });
        } else {
            setError(response.error || 'Failed to stop stream.');
            toast({ title: 'Error Stopping Stream', description: response.error || 'Failed to stop stream.', variant: 'destructive'});
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(errorMessage);
        toast({ title: 'Error Stopping Stream', description: errorMessage, variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }

  };


  return (
    <Card className="w-full shadow-lg border-gray-700 bg-scanner-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Play className="mr-2 h-5 w-5 text-green-500" />
          WebRTC Streamer
        </CardTitle>
        <CardDescription>
          Convert an RTSP stream to WebRTC for low-latency browser playback.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="rtsp-url">RTSP URL</Label>
          <Input 
            id="rtsp-url" 
            placeholder="rtsp://user:pass@ip_address:port/path" 
            value={rtspUrl} 
            onChange={(e) => setRtspUrl(e.target.value)} 
            className="bg-scanner-dark-alt border-gray-600" 
          />
        </div>
        <div>
          <Label htmlFor="stream-name">Stream Name/Path (for WebRTC server)</Label>
          <Input 
            id="stream-name" 
            placeholder="e.g., live/stream1 or mycam" 
            value={streamName} 
            onChange={(e) => setStreamName(e.target.value)} 
            className="bg-scanner-dark-alt border-gray-600" 
          />
        </div>
        
        {/* Placeholder for advanced options like codecs, resolution etc. */}
        {/* 
        <div>
          <Label htmlFor="advanced-options">Advanced Options (JSON)</Label>
          <Textarea id="advanced-options" placeholder='{ "video_codec": "vp9", "resolution": "1280x720" }' className="min-h-[80px] bg-scanner-dark-alt border-gray-600 font-mono text-sm" />
        </div>
        */}

        <div className="flex space-x-2">
            <Button onClick={handleStartStream} disabled={isLoading || !rtspUrl} className="flex-1 bg-green-600 hover:bg-green-700">
            {isLoading && !streamData ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Play className="mr-2 h-4 w-4" />
            )}
            Start Stream
            </Button>
            <Button onClick={handleStopStream} disabled={isLoading || !streamData} variant="destructive" className="flex-1">
            {isLoading && streamData ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <StopCircle className="mr-2 h-4 w-4" />
            )}
            Stop Stream
            </Button>
        </div>
      </CardContent>

      {error && (
        <CardFooter className="border-t border-gray-700 pt-4">
          <div className="text-red-400 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardFooter>
      )}

      {streamData && (
        <CardFooter className="flex flex-col items-start space-y-4 mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-200">Stream Active</h3>
          <div className="w-full space-y-2">
            <p className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4 text-blue-400" />
              <span className="font-medium">WebRTC URL:</span> 
              <Input readOnly value={streamData.webrtc_url || 'N/A'} className="ml-2 flex-1 bg-gray-800 border-gray-700 text-xs" />
            </p>
            <p><span className="font-medium">Stream ID:</span> {streamData.stream_id || 'N/A'}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-400">{streamData.status || 'Unknown'}</span></p>
            
            {/* Basic Video Player Placeholder - A real WebRTC player is needed for actual playback */}
            <div className="mt-4 border border-gray-600 rounded bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} controls muted autoPlay playsInline className="w-full h-full" onError={(e) => console.error("Video error:", e)}>
                    {/* WebRTC connection is handled by JavaScript, not source tags typically */}
                </video>
                {!videoRef.current?.srcObject && <p className="text-gray-500">WebRTC stream connection requires client-side JS.</p>}
            </div>
            <p className="text-xs text-gray-400 mt-1">
                Note: Direct playback in this preview requires a WebRTC client. Use the URL with a compatible player.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default WebRTCStreamerTool;


import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WebRTCPlayerProps {
  rtspUrl: string;
  webrtcPort?: number;
  iceServers?: string[];
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  onError?: (error: any) => void;
  onConnected?: () => void;
}

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({
  rtspUrl,
  webrtcPort = 8889,
  iceServers = ['stun:stun.l.google.com:19302'],
  autoplay = true,
  muted = true,
  controls = true,
  width = '100%',
  height = 'auto',
  onError,
  onConnected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    
    const setupWebRTC = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Close any existing peer connection
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
        }
        
        // Create a new RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: iceServers.map(server => ({ urls: server }))
        });
        peerConnectionRef.current = pc;
        
        // Set up event handlers
        pc.ontrack = (event) => {
          if (videoRef.current && event.streams && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setIsLoading(false);
            if (onConnected) onConnected();
          }
        };
        
        pc.onicecandidate = (event) => {
          if (event.candidate === null) {
            // ICE gathering completed
            console.log('ICE gathering complete');
          }
        };
        
        pc.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', pc.iceConnectionState);
          if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
            setError('WebRTC connection failed or disconnected');
            setIsLoading(false);
            if (onError) onError(new Error('ICE connection failed'));
          }
        };
        
        // Create offer
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await pc.setLocalDescription(offer);
        
        // In a real implementation, this would send the offer to a WebRTC streamer server
        // that handles the RTSP-to-WebRTC conversion
        const streamerUrl = `http://localhost:${webrtcPort}/api/v1/stream?url=${encodeURIComponent(rtspUrl)}`;
        
        console.log('Connecting to WebRTC streamer:', streamerUrl);
        console.log('Since this is a demo, we are simulating the WebRTC setup');
        
        // Simulate receiving an answer and ICE candidates
        setTimeout(() => {
          // This is just a simulation since we don't have a real WebRTC server
          // In a real implementation, you would fetch the answer from the server
          if (!peerConnectionRef.current) return;
          
          // In a real scenario, this would be the SDP answer from the server
          // For demo purposes, we'll simulate a connection failure after a short delay
          setTimeout(() => {
            setError('WebRTC streamer not available (demo only)');
            setIsLoading(false);
            if (onError) onError(new Error('WebRTC streamer not available'));
          }, 3000);
        }, 1000);
        
      } catch (err) {
        console.error('Error setting up WebRTC:', err);
        setError(`Failed to initialize WebRTC: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
        if (onError) onError(err);
      }
    };
    
    setupWebRTC();
    
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [rtspUrl, webrtcPort, iceServers]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          {isLoading ? 'Connecting to WebRTC stream...' : error ? 'Stream Error' : 'WebRTC Stream'}
          {isLoading && (
            <div className="ml-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {error && (
          <Alert variant="destructive" className="m-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        <div className={`relative ${error ? 'opacity-50' : ''}`}>
          <video
            ref={videoRef}
            autoPlay={autoplay}
            controls={controls}
            muted={muted}
            style={{ width, height, display: 'block' }}
            className="bg-black aspect-video"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebRTCPlayer;

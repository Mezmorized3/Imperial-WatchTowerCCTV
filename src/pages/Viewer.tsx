
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RtspPlayer from '@/components/RtspPlayer';

const Viewer = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const location = useLocation();
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const streamUrl = searchParams.get('url');
  const cameraName = searchParams.get('name') || 'Camera Stream';
  
  const handleFullScreen = () => {
    const viewer = document.getElementById('stream-viewer');
    
    if (!isFullScreen) {
      if (viewer?.requestFullscreen) {
        viewer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };
  
  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-card border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <h1 className="text-lg font-medium flex items-center gap-2">
              <Camera className="h-5 w-5 text-scanner-primary" />
              {cameraName}
            </h1>
            <Badge className="bg-scanner-primary">RTSP Stream</Badge>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFullScreen}>
              {isFullScreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-1" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-1" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div id="stream-viewer" className="bg-black rounded-lg shadow-lg overflow-hidden aspect-video relative">
          {streamUrl ? (
            <RtspPlayer rtspUrl={streamUrl} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">No stream URL provided</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Stream Information</h2>
          <div className="bg-scanner-card border border-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Stream URL</p>
                <p className="font-mono bg-gray-800 p-2 rounded mt-1 text-sm break-all">
                  {streamUrl || 'No URL provided'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Stream Type</p>
                <p className="mt-1">RTSP converted to HLS (HTTP Live Streaming)</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Player Information</p>
              <p className="mt-1 text-sm">
                Using HLS player technology to convert RTSP streams for browser playback.
                For demonstration purposes, this player is using a sample stream.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Viewer;

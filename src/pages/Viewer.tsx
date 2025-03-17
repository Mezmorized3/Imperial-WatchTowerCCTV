
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Viewer = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const location = useLocation();
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const streamUrl = searchParams.get('url');
  const cameraName = searchParams.get('name') || 'Camera Stream';
  
  useEffect(() => {
    // Simulate stream loading
    const timer = setTimeout(() => {
      // For demo purposes, we'll simulate a successful stream 80% of the time
      if (Math.random() > 0.2) {
        setIsLoading(false);
      } else {
        setStreamError('Unable to connect to the stream. Check if the camera is online and the credentials are correct.');
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [streamUrl]);
  
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
  
  const handleRefresh = () => {
    setIsLoading(true);
    setStreamError(null);
    
    // Simulate refreshing the stream
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setIsLoading(false);
      } else {
        setStreamError('Unable to connect to the stream. Check if the camera is online and the credentials are correct.');
        setIsLoading(false);
      }
    }, 1500);
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
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
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
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-scanner-primary mb-4"></div>
                <p className="text-gray-400">Connecting to stream...</p>
                <p className="text-gray-500 text-sm mt-2 font-mono">{streamUrl}</p>
              </div>
            </div>
          ) : streamError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md p-6">
                <svg className="h-12 w-12 text-scanner-danger mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-scanner-danger font-medium mb-2">Stream Error</p>
                <p className="text-gray-400 text-sm">{streamError}</p>
                <Button className="mt-4" variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            // This is a placeholder for the actual video stream
            // In a real app, you'd use a video player library that supports RTSP
            <div className="absolute inset-0 flex items-center justify-center bg-scanner-card-hover">
              <div className="text-center">
                <p className="text-gray-300">
                  {/* In a real implementation, you would use a proper player here */}
                  Stream preview (simulated)
                </p>
                <p className="text-gray-500 text-sm mt-2 font-mono">{streamUrl}</p>
                <p className="text-gray-500 text-xs mt-4">
                  Note: Actual RTSP streaming requires a specialized player or proxy service
                </p>
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
                <p className="font-mono bg-gray-800 p-2 rounded mt-1 text-sm">{streamUrl}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Stream Type</p>
                <p className="mt-1">RTSP (Real Time Streaming Protocol)</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Connection Status</p>
              <div className="mt-1">
                {isLoading ? (
                  <Badge className="bg-scanner-warning">Connecting</Badge>
                ) : streamError ? (
                  <Badge className="bg-scanner-danger">Failed</Badge>
                ) : (
                  <Badge className="bg-scanner-success">Connected</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Viewer;

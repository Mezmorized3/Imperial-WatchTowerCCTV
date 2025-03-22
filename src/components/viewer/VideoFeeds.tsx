
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Video, Eye, Film, Play, Square, Clock } from 'lucide-react';
import { CameraResult } from '@/types/scanner';
import CameraList from './camera-feeds/CameraList';
import CustomStreamInput from './camera-feeds/CustomStreamInput';
import CameraSearch from './camera-feeds/CameraSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { imperialServerService } from '@/utils/imperialServerService';

interface VideoFeedsProps {
  cameras: CameraResult[];
}

const VideoFeeds: React.FC<VideoFeedsProps> = ({ cameras }) => {
  const { toast } = useToast();
  const [selectedCamera, setSelectedCamera] = useState<CameraResult | null>(null);
  const [customRtspUrl, setCustomRtspUrl] = useState<string>('rtsp://admin:admin@192.168.1.100:554/stream1');
  const [showCustomStream, setShowCustomStream] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('cameralist');
  const [savedFeeds, setSavedFeeds] = useState<{ name: string; url: string }[]>([]);
  
  // Stream controls
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');
  const [hlsStreamUrl, setHlsStreamUrl] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  // Recording controls
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingId, setRecordingId] = useState<string>('');
  const [recordingDuration, setRecordingDuration] = useState<number>(60);
  const [recordings, setRecordings] = useState<any[]>([]);
  
  // Media server settings
  const [mediaServerUrl, setMediaServerUrl] = useState<string>('http://localhost:8000');
  
  useEffect(() => {
    const savedFeedsData = localStorage.getItem('savedVideoFeeds');
    if (savedFeedsData) {
      try {
        setSavedFeeds(JSON.parse(savedFeedsData));
      } catch (e) {
        console.error('Error loading saved feeds:', e);
      }
    }
    
    // Load recordings if authenticated
    if (imperialServerService.isAuthenticated()) {
      loadRecordings();
    }
  }, []);
  
  const loadRecordings = async () => {
    try {
      const result = await imperialServerService.getRecordings();
      if (result.success) {
        // Combine active and completed recordings
        const allRecordings = [
          ...result.activeRecordings.map((rec: any) => ({
            ...rec,
            status: 'active',
            created: new Date()
          })),
          ...result.completedRecordings.map((rec: any) => ({
            ...rec,
            status: 'completed'
          }))
        ];
        setRecordings(allRecordings);
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
      toast({
        title: "Error Loading Recordings",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleConvertStream = async () => {
    try {
      setIsConverting(true);
      
      const streamUrl = selectedCamera?.rtspUrl || customRtspUrl;
      setCurrentStreamUrl(streamUrl);
      
      if (!streamUrl) {
        toast({
          title: "Stream URL Required",
          description: "Please select a camera or enter a stream URL",
          variant: "destructive",
        });
        setIsConverting(false);
        return;
      }
      
      toast({
        title: "Starting Stream Conversion",
        description: "Converting RTSP to HLS format...",
      });
      
      const result = await imperialServerService.convertRtspToHls(streamUrl);
      
      if (result.success) {
        setHlsStreamUrl(result.fullUrl);
        toast({
          title: "Stream Conversion Ready",
          description: "Stream converted and ready to play",
        });
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
  
  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      
      const streamUrl = selectedCamera?.rtspUrl || customRtspUrl || currentStreamUrl;
      
      if (!streamUrl) {
        toast({
          title: "Stream URL Required",
          description: "Please select a camera or enter a stream URL",
          variant: "destructive",
        });
        setIsRecording(false);
        return;
      }
      
      toast({
        title: "Starting Recording",
        description: `Recording stream for ${recordingDuration} seconds...`,
      });
      
      const result = await imperialServerService.startRecording(streamUrl, recordingDuration);
      
      if (result.success) {
        setRecordingId(result.recordingId);
        toast({
          title: "Recording Started",
          description: result.message || "Recording in progress",
        });
        
        // Refresh recordings list
        loadRecordings();
      } else {
        toast({
          title: "Recording Failed",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
        setIsRecording(false);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };
  
  const handleStopRecording = async () => {
    if (!recordingId) {
      setIsRecording(false);
      return;
    }
    
    try {
      const result = await imperialServerService.stopRecording(recordingId);
      
      if (result.success) {
        toast({
          title: "Recording Stopped",
          description: `Recording saved: ${result.recordingId}`,
        });
        
        // Refresh recordings list
        loadRecordings();
      } else {
        toast({
          title: "Stop Recording Failed",
          description: result.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast({
        title: "Recording Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
      setRecordingId('');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cameralist">
            <Camera className="h-4 w-4 mr-2" />
            Camera List
          </TabsTrigger>
          <TabsTrigger value="customstream">
            <Video className="h-4 w-4 mr-2" />
            Custom Stream
          </TabsTrigger>
          <TabsTrigger value="search">
            <Eye className="h-4 w-4 mr-2" />
            Find Cameras
          </TabsTrigger>
          <TabsTrigger value="recordings">
            <Film className="h-4 w-4 mr-2" />
            Recordings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cameralist">
          <CameraList 
            cameras={cameras}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
          />
        </TabsContent>
        
        <TabsContent value="customstream">
          <CustomStreamInput
            customRtspUrl={customRtspUrl}
            setCustomRtspUrl={setCustomRtspUrl}
            showCustomStream={showCustomStream}
            setShowCustomStream={setShowCustomStream}
            savedFeeds={savedFeeds}
            setSavedFeeds={setSavedFeeds}
          />
        </TabsContent>
        
        <TabsContent value="search">
          <CameraSearch 
            setCustomRtspUrl={setCustomRtspUrl}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="recordings">
          <Card className="border-gray-700 bg-scanner-dark-alt">
            <CardHeader>
              <CardTitle className="text-scanner-primary flex items-center">
                <Film className="mr-2 h-5 w-5" />
                Stream Recordings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Record and manage video feeds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="recording-duration">Recording Duration (seconds)</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="recording-duration"
                      min={10}
                      max={3600}
                      step={10}
                      value={[recordingDuration]}
                      onValueChange={(values) => setRecordingDuration(values[0])}
                      className="flex-1"
                      disabled={isRecording}
                    />
                    <span className="w-12 text-right">{recordingDuration}s</span>
                  </div>
                </div>
                
                <div className="flex gap-2 md:self-end">
                  {!isRecording ? (
                    <Button 
                      variant="default" 
                      onClick={handleStartRecording}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleStopRecording}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={loadRecordings}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Recording List</h3>
                
                {recordings.length === 0 ? (
                  <p className="text-gray-400 italic">No recordings found.</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {recordings.map((recording, index) => (
                      <Card key={index} className="bg-scanner-dark border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{recording.filename}</h4>
                              <p className="text-sm text-gray-400">
                                {recording.status === 'active' ? (
                                  <span className="text-green-500">● Recording in progress</span>
                                ) : (
                                  <span>Completed: {new Date(recording.created).toLocaleString()}</span>
                                )}
                              </p>
                              {recording.size && (
                                <p className="text-sm text-gray-400">
                                  Size: {Math.round(recording.size / 1024 / 1024 * 100) / 100} MB
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {recording.status !== 'active' && (
                                <Button variant="outline" size="sm" className="text-scanner-primary border-scanner-primary">
                                  <a 
                                    href={`${mediaServerUrl}/media/recordings/${recording.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Download
                                  </a>
                                </Button>
                              )}
                              {recording.status === 'active' && recording.recordingId && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 border-red-500"
                                  onClick={() => imperialServerService.stopRecording(recording.recordingId)
                                    .then(() => loadRecordings())
                                    .catch(error => {
                                      console.error("Error stopping recording:", error);
                                      toast({
                                        title: "Error",
                                        description: `Failed to stop recording: ${error.message}`,
                                        variant: "destructive",
                                      });
                                    })
                                  }
                                >
                                  Stop
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* HLS Player Section */}
      {(showCustomStream || selectedCamera) && (
        <Card className="border-gray-700 bg-scanner-dark-alt mt-6">
          <CardHeader>
            <CardTitle className="text-scanner-primary flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Video Stream
            </CardTitle>
            <CardDescription className="text-gray-400">
              {currentStreamUrl ? `Source: ${currentStreamUrl}` : 'Convert RTSP stream to view in browser'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Button
                  onClick={handleConvertStream}
                  disabled={isConverting || (!selectedCamera && !customRtspUrl)}
                  className={`w-full ${isConverting ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isConverting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Converting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Convert & View Stream
                    </>
                  )}
                </Button>
              </div>
              
              {!isRecording ? (
                <Button 
                  onClick={handleStartRecording}
                  disabled={isRecording || (!selectedCamera && !customRtspUrl && !currentStreamUrl)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Record
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleStopRecording}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
            
            {hlsStreamUrl && (
              <div className="mt-6">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`/player.html?url=${encodeURIComponent(hlsStreamUrl)}`}
                    className="absolute top-0 left-0 w-full h-full border-0 rounded-md"
                    allow="autoplay; fullscreen"
                    title="Stream Player"
                  ></iframe>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Stream URL: {hlsStreamUrl}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoFeeds;

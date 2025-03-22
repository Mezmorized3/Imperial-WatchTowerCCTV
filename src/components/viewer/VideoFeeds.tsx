
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Video, Eye } from 'lucide-react';
import { CameraResult } from '@/types/scanner';
import CameraList from './camera-feeds/CameraList';
import CustomStreamInput from './camera-feeds/CustomStreamInput';
import CameraSearch from './camera-feeds/CameraSearch';

interface VideoFeedsProps {
  cameras: CameraResult[];
}

const VideoFeeds: React.FC<VideoFeedsProps> = ({ cameras }) => {
  const [selectedCamera, setSelectedCamera] = useState<CameraResult | null>(null);
  const [customRtspUrl, setCustomRtspUrl] = useState<string>('');
  const [showCustomStream, setShowCustomStream] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('cameralist');
  const [savedFeeds, setSavedFeeds] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const savedFeedsData = localStorage.getItem('savedVideoFeeds');
    if (savedFeedsData) {
      try {
        setSavedFeeds(JSON.parse(savedFeedsData));
      } catch (e) {
        console.error('Error loading saved feeds:', e);
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
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
      </Tabs>
    </div>
  );
};

export default VideoFeeds;

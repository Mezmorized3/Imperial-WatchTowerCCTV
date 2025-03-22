
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, RefreshCw, Save, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { testRtspConnection } from '@/utils/rtspUtils';
import RtspPlayer from '@/components/RtspPlayer';

interface CustomStreamInputProps {
  customRtspUrl: string;
  setCustomRtspUrl: (url: string) => void;
  showCustomStream: boolean;
  setShowCustomStream: (show: boolean) => void;
  savedFeeds: { name: string; url: string }[];
  setSavedFeeds: (feeds: { name: string; url: string }[]) => void;
}

const CustomStreamInput: React.FC<CustomStreamInputProps> = ({
  customRtspUrl,
  setCustomRtspUrl,
  showCustomStream,
  setShowCustomStream,
  savedFeeds,
  setSavedFeeds,
}) => {
  const [newFeedName, setNewFeedName] = useState<string>('');
  const { toast } = useToast();

  const handleCustomStreamPlay = () => {
    if (!customRtspUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid RTSP URL",
        variant: "destructive"
      });
      return;
    }
    setShowCustomStream(true);
  };

  const handleSaveFeed = () => {
    if (!customRtspUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid RTSP URL to save",
        variant: "destructive"
      });
      return;
    }

    const feedName = newFeedName || `Feed ${savedFeeds.length + 1}`;
    const newSavedFeeds = [...savedFeeds, { name: feedName, url: customRtspUrl }];
    setSavedFeeds(newSavedFeeds);
    localStorage.setItem('savedVideoFeeds', JSON.stringify(newSavedFeeds));
    
    toast({
      title: "Feed Saved",
      description: `Feed "${feedName}" has been saved to your list`
    });
    
    setNewFeedName('');
  };

  const handleLoadSavedFeed = (url: string) => {
    setCustomRtspUrl(url);
    setShowCustomStream(true);
  };

  const handleTestConnection = async () => {
    if (!customRtspUrl) {
      toast({
        title: "Error",
        description: "Please enter a RTSP URL to test",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Testing Connection",
      description: "Please wait while we test the connection..."
    });
    
    try {
      const isConnected = await testRtspConnection(customRtspUrl);
      
      if (isConnected) {
        toast({
          title: "Connection Successful",
          description: "The RTSP stream is accessible"
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to the RTSP stream",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: error instanceof Error ? error.message : 'Error testing connection',
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {!showCustomStream ? (
        <>
          <Card className="bg-scanner-dark-alt border-gray-700 mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Custom RTSP Stream</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter RTSP URL (e.g. rtsp://admin:admin@192.168.1.100:554/Streaming/Channels/101)"
                  value={customRtspUrl}
                  onChange={(e) => setCustomRtspUrl(e.target.value)}
                  className="flex-grow"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCustomStreamPlay}>
                    <Play className="h-4 w-4 mr-2" />
                    Play Stream
                  </Button>
                  <Button variant="outline" onClick={handleTestConnection}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-700">
                <Input
                  placeholder="Enter a name for this feed"
                  value={newFeedName}
                  onChange={(e) => setNewFeedName(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="secondary" onClick={handleSaveFeed}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Feed
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {savedFeeds.length > 0 && (
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">Saved Feeds</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedFeeds.map((feed, index) => (
                    <Card 
                      key={index} 
                      className="bg-scanner-dark border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                      onClick={() => handleLoadSavedFeed(feed.url)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-scanner-dark-alt flex items-center justify-center">
                            <Video className="h-4 w-4 text-scanner-info" />
                          </div>
                          <div>
                            <h3 className="font-medium">{feed.name}</h3>
                            <p className="text-sm text-gray-400 truncate max-w-[200px]">
                              {feed.url}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4 text-scanner-info" />
                Custom RTSP Stream
              </div>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCustomStream(false)}
            >
              Back to Input
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <RtspPlayer 
                rtspUrl={customRtspUrl} 
                autoPlay={true}
                onError={(error) => console.error("Stream error:", error)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p><span className="font-semibold">URL:</span> {customRtspUrl}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CustomStreamInput;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Volume2, Maximize2 } from 'lucide-react';
import RtspPlayer from '@/components/RtspPlayer';

interface QuickStreamPlayerProps {
  className?: string;
}

const QuickStreamPlayer: React.FC<QuickStreamPlayerProps> = ({ className }) => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayStream = () => {
    if (streamUrl) {
      setIsPlaying(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreamUrl(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePlayStream();
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="text-sm text-gray-400 mb-2">Preview and control any type of video stream</div>
      
      <div className="w-full aspect-video bg-black rounded-md overflow-hidden mb-4 flex items-center justify-center">
        {isPlaying ? (
          <RtspPlayer 
            rtspUrl={streamUrl} 
            autoPlay={true}
            onError={() => setIsPlaying(false)}
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <span className="text-lg mb-4">No stream playing</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder="Enter stream URL..."
          value={streamUrl}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          onClick={handlePlayStream}
          disabled={!streamUrl}
          className="bg-scanner-primary hover:bg-scanner-primary/80"
        >
          <Play className="h-4 w-4 mr-2" />
          Play
        </Button>
      </div>
    </div>
  );
};

export default QuickStreamPlayer;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, Play, Pause, StopCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileCentipedeProps {
  onDownloadComplete?: (result: any) => void;
}

const FileCentipede: React.FC<FileCentipedeProps> = ({ onDownloadComplete }) => {
  const [url, setUrl] = useState('');
  const [downloadPath, setDownloadPath] = useState('/downloads');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('0 KB/s');
  const [timeRemaining, setTimeRemaining] = useState('--:--');

  const startDownload = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to download",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    
    try {
      // Simulate download progress
      const downloadInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(downloadInterval);
            setIsDownloading(false);
            setDownloadSpeed('0 KB/s');
            setTimeRemaining('00:00');
            
            toast({
              title: "Download Complete",
              description: `File downloaded successfully to ${downloadPath}`,
            });
            
            if (onDownloadComplete) {
              onDownloadComplete({
                url,
                path: downloadPath,
                size: Math.floor(Math.random() * 100) + 1 + ' MB',
                duration: Math.floor(Math.random() * 300) + 30 + ' seconds'
              });
            }
            
            return 100;
          }
          
          // Update simulated stats
          setDownloadSpeed(Math.floor(Math.random() * 1000) + 100 + ' KB/s');
          setTimeRemaining(Math.floor((100 - newProgress) / 10) + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'));
          
          return newProgress;
        });
      }, 500);
      
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setIsDownloading(false);
    }
  };

  const pauseDownload = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Download Resumed" : "Download Paused",
      description: isPaused ? "Download has been resumed" : "Download has been paused",
    });
  };

  const stopDownload = () => {
    setIsDownloading(false);
    setIsPaused(false);
    setProgress(0);
    setDownloadSpeed('0 KB/s');
    setTimeRemaining('--:--');
    
    toast({
      title: "Download Stopped",
      description: "Download has been cancelled",
      variant: "destructive"
    });
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 text-blue-400 mr-2" />
          File Centipede Download Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="url">Download URL</Label>
          <Input
            id="url"
            placeholder="https://example.com/file.zip"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
            disabled={isDownloading}
          />
        </div>
        
        <div>
          <Label htmlFor="path">Download Path</Label>
          <Input
            id="path"
            placeholder="/downloads"
            value={downloadPath}
            onChange={(e) => setDownloadPath(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
            disabled={isDownloading}
          />
        </div>
        
        {!isDownloading ? (
          <Button
            onClick={startDownload}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Start Download
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={pauseDownload}
                variant="outline"
                className="flex-1"
              >
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button
                onClick={stopDownload}
                variant="destructive"
                className="flex-1"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {Math.round(progress)}%</span>
                <span>Speed: {downloadSpeed}</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Time remaining: {timeRemaining}</span>
                <span>{isPaused ? 'Paused' : 'Downloading...'}</span>
              </div>
            </div>
          </div>
        )}
        
        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-950/20 border border-green-500/30 rounded-md">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-sm text-green-400">Download completed successfully!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileCentipede;

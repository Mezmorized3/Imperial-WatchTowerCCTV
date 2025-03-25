import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Eye, 
  Globe, 
  Loader2, 
  Mail, 
  ArrowRight, 
  Key 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { executePhoton } from '@/utils/osintTools';

interface PhotonToolProps {
  onScanComplete?: (results: any) => void;
}

const PhotonTool: React.FC<PhotonToolProps> = ({ onScanComplete }) => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState('2');
  const [timeout, setTimeout] = useState('10');
  const [threads, setThreads] = useState('5');
  const [delay, setDelay] = useState('1');
  const [userAgent, setUserAgent] = useState('');
  const [saveResults, setSaveResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('urls');
  
  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    setResults(null);
    
    try {
      // Call executePhoton with just the URL parameter
      const result = await executePhoton(url);
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "Scan Complete",
          description: `Found ${result.data?.urls?.length || 0} URLs and ${result.data?.emails?.length || 0} emails`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during Photon scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photon Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleScan}>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="depth">Depth</Label>
            <Input id="depth" value={depth} onChange={(e) => setDepth(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="timeout">Timeout</Label>
            <Input id="timeout" value={timeout} onChange={(e) => setTimeout(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="threads">Threads</Label>
            <Input id="threads" value={threads} onChange={(e) => setThreads(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="delay">Delay</Label>
            <Input id="delay" value={delay} onChange={(e) => setDelay(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="userAgent">User Agent</Label>
            <Input id="userAgent" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="saveResults">Save Results</Label>
            <Switch id="saveResults" checked={saveResults} onChange={(e) => setSaveResults(e.target.checked)} />
          </div>
          <Button type="submit" disabled={isScanning}>
            {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            Scan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhotonTool;

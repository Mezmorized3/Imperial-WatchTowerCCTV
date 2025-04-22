
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RTSPServerTools from './RTSPServerTools';
import TitanRTSPTool from './TitanRTSPTool';
import { Video, Server, Globe, Zap } from 'lucide-react';

const StreamingTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ffmpeg');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Video className="mr-2 text-blue-500" />
          Streaming Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="ffmpeg">
              <Video className="h-4 w-4 mr-2" />
              FFmpeg
            </TabsTrigger>
            <TabsTrigger value="rtspserver">
              <Server className="h-4 w-4 mr-2" />
              RTSP Servers
            </TabsTrigger>
            <TabsTrigger value="titanrtsp">
              <Zap className="h-4 w-4 mr-2" />
              TITAN-RTSP
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ffmpeg" className="mt-4">
            <div className="text-center p-8">
              <Globe className="h-10 w-10 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">FFmpeg Tools</h3>
              <p className="text-gray-500 mb-4">
                Advanced video processing and conversion tools using FFmpeg.
              </p>
              <p className="text-xs text-gray-400">
                This tab is in development. RTSP Server tools are available in the next tab.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="rtspserver" className="mt-4">
            <RTSPServerTools />
          </TabsContent>
          
          <TabsContent value="titanrtsp" className="mt-4">
            <TitanRTSPTool />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StreamingTools;

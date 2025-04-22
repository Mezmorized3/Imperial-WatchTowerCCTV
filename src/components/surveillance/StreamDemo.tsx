
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerComparisonDemo } from './index';
import WebRTCStreamerTool from './WebRTCStreamerTool';
import ONVIFFuzzerTool from './ONVIFFuzzerTool';

const StreamDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('players');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Surveillance Stream Tools</CardTitle>
        <CardDescription>
          Tools for working with camera streams, including players, converters, and security tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="players">Player Comparison</TabsTrigger>
            <TabsTrigger value="webrtc">WebRTC Streamer</TabsTrigger>
            <TabsTrigger value="fuzzer">ONVIF Fuzzer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="players" className="mt-4">
            <PlayerComparisonDemo />
          </TabsContent>
          
          <TabsContent value="webrtc" className="mt-4">
            <WebRTCStreamerTool />
          </TabsContent>
          
          <TabsContent value="fuzzer" className="mt-4">
            <ONVIFFuzzerTool />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StreamDemo;

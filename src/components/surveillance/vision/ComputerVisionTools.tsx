
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaceRecognitionTool, ObjectDetectionTool, SurveillanceToolkit } from './index';
import { Camera, FileImage, Search } from 'lucide-react';

const ComputerVisionTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('face');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Computer Vision Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="face">
              <Camera className="h-4 w-4 mr-2" />
              Face Recognition
            </TabsTrigger>
            <TabsTrigger value="object">
              <FileImage className="h-4 w-4 mr-2" />
              Object Detection
            </TabsTrigger>
            <TabsTrigger value="toolkit">
              <Search className="h-4 w-4 mr-2" />
              Surveillance Toolkit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="face" className="mt-4">
            <FaceRecognitionTool />
          </TabsContent>
          
          <TabsContent value="object" className="mt-4">
            <ObjectDetectionTool />
          </TabsContent>
          
          <TabsContent value="toolkit" className="mt-4">
            <SurveillanceToolkit />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComputerVisionTools;

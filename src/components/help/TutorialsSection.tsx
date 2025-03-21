
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, ExternalLink } from 'lucide-react';

const TutorialsSection = () => {
  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Video Tutorials</CardTitle>
        <CardDescription className="text-gray-400">
          Learn visually with our comprehensive video guides
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-700" />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Getting Started with Watchtower</h3>
              <p className="text-sm text-gray-400 mb-3">10:24 • Complete overview for new users</p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-1" /> Watch Tutorial
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-700" />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Advanced Scanning Techniques</h3>
              <p className="text-sm text-gray-400 mb-3">15:37 • Master the scanning capabilities</p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-1" /> Watch Tutorial
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-700" />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Analyzing Vulnerability Reports</h3>
              <p className="text-sm text-gray-400 mb-3">12:45 • Understand your scan results</p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-1" /> Watch Tutorial
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-700" />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Securing CCTV Infrastructure</h3>
              <p className="text-sm text-gray-400 mb-3">18:22 • Best practices for CCTV security</p>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-1" /> Watch Tutorial
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorialsSection;

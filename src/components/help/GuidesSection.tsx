
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const GuidesSection = () => {
  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription className="text-gray-400">
          Basic guides to help you get started with Watchtower CCTV Scanner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                Introduction to Watchtower
              </h3>
              <p className="text-gray-400">
                Learn about the Watchtower CCTV Scanner platform and its capabilities for securing your surveillance systems.
              </p>
              <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                Setting Up Your First Scan
              </h3>
              <p className="text-gray-400">
                Learn how to configure and run your first CCTV security scan to identify potentially vulnerable cameras.
              </p>
              <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                Understanding Scan Results
              </h3>
              <p className="text-gray-400">
                Learn how to interpret scan results and vulnerability reports to secure your surveillance infrastructure.
              </p>
              <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                Globe View Navigation
              </h3>
              <p className="text-gray-400">
                Learn how to use the interactive globe to visualize and navigate camera locations around the world.
              </p>
              <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                Threat Intelligence Integration
              </h3>
              <p className="text-gray-400">
                Learn how Watchtower integrates with threat intelligence sources to provide context for your scan results.
              </p>
              <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                Configuration and Settings
              </h3>
              <p className="text-gray-400">
                Detailed guide on configuring Watchtower settings to match your security requirements and preferences.
              </p>
              <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GuidesSection;

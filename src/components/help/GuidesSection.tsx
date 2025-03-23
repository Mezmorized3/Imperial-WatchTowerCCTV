
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Globe, Network, Lock, AlertTriangle, Search, Server, Settings, Database, Users } from 'lucide-react';

const GuidesSection = () => {
  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription className="text-gray-400">
          Comprehensive guides to help you navigate and utilize all features of the Imperial Scanner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {/* Core Functionality Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-scanner-primary border-b border-gray-700 pb-2">Core Functionality</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-scanner-primary" />
                    Introduction to Imperial Scanner
                  </h3>
                  <p className="text-gray-400">
                    Learn about the Imperial Scanner platform and its capabilities for securing surveillance systems and conducting OSINT operations.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Search className="h-5 w-5 mr-2 text-scanner-primary" />
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
                    <Globe className="h-5 w-5 mr-2 text-scanner-primary" />
                    Globe View Navigation
                  </h3>
                  <p className="text-gray-400">
                    Learn how to use the interactive globe to visualize and navigate camera locations around the world.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>
              </div>
            </div>

            {/* Advanced Features Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-scanner-primary border-b border-gray-700 pb-2">Advanced Features</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-scanner-primary" />
                    Threat Intelligence Integration
                  </h3>
                  <p className="text-gray-400">
                    Learn how Imperial Scanner integrates with threat intelligence sources to provide context for your scan results.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-scanner-primary" />
                    Configuration and Settings
                  </h3>
                  <p className="text-gray-400">
                    Detailed guide on configuring Imperial Scanner settings to match your security requirements and preferences.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-scanner-primary" />
                    Enhanced Security Features
                  </h3>
                  <p className="text-gray-400">
                    Explore advanced security features including anomaly detection, firmware analysis, and vulnerability assessment.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Database className="h-5 w-5 mr-2 text-scanner-primary" />
                    Working with Scan Data
                  </h3>
                  <p className="text-gray-400">
                    Learn how to export, analyze, and visualize your scan data for better security insights and reporting.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>
              </div>
            </div>

            {/* OSINT Tools Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-scanner-primary border-b border-gray-700 pb-2">OSINT Tools</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Users className="h-5 w-5 mr-2 text-scanner-primary" />
                    Username Research Tools
                  </h3>
                  <p className="text-gray-400">
                    Guide to using the integrated username search tools to conduct open-source intelligence gathering.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Network className="h-5 w-5 mr-2 text-scanner-primary" />
                    Network Reconnaissance
                  </h3>
                  <p className="text-gray-400">
                    Detailed guide on using Imperial Scanner's network tools for comprehensive security reconnaissance.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Server className="h-5 w-5 mr-2 text-scanner-primary" />
                    Web Intelligence
                  </h3>
                  <p className="text-gray-400">
                    Learn how to use web intelligence tools to gather information about websites, domains, and online services.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>
              </div>
            </div>

            {/* Proxy & Security Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-scanner-primary border-b border-gray-700 pb-2">Proxy & Security</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-scanner-primary" />
                    Proxy Configuration
                  </h3>
                  <p className="text-gray-400">
                    Learn how to configure and use the advanced proxy features for anonymous scanning and enhanced security.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-scanner-primary" />
                    Operational Security
                  </h3>
                  <p className="text-gray-400">
                    Best practices for maintaining operational security while using Imperial Scanner for reconnaissance.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>
              </div>
            </div>

            {/* Imperial Server Management */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-scanner-primary border-b border-gray-700 pb-2">Imperial Server</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Server className="h-5 w-5 mr-2 text-scanner-primary" />
                    Server Setup & Configuration
                  </h3>
                  <p className="text-gray-400">
                    Comprehensive guide to setting up and configuring the Imperial Server for enhanced functionality.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-scanner-primary" />
                    Imperial Control Panel
                  </h3>
                  <p className="text-gray-400">
                    Guide to using the Imperial Control Panel for managing server operations and modules.
                  </p>
                  <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GuidesSection;

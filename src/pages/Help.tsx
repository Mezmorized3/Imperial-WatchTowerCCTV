
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Shield, Smartphone, Globe, FileText, Search, Camera, ShieldAlert } from 'lucide-react';

const Help = () => {
  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <DashboardHeader />
      
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Info className="mr-2 h-6 w-6 text-scanner-info" />
          Help & Documentation
        </h1>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-scanner-dark-alt">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scanning">Scanning</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="desktop">Desktop App</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle>WatchTower Scanner</CardTitle>
                <CardDescription className="text-gray-400">
                  Camera discovery and security assessment tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  WatchTower Scanner is a powerful security tool designed to discover, analyze and monitor
                  network cameras. The application helps security professionals identify vulnerable cameras
                  and provides detailed security assessments.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Network camera discovery with multiple scanning methods</li>
                  <li>Vulnerability assessment and security analysis</li>
                  <li>Threat intelligence integration</li>
                  <li>Geolocation tracking with interactive globe visualization</li>
                  <li>Real-time monitoring of discovered devices</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scanning" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-scanner-info" />
                  Scanning Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Scan Types</h3>
                      <Separator className="my-2 bg-gray-700" />
                      <ul className="space-y-4">
                        <li>
                          <h4 className="font-medium text-scanner-info">IP Address</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Scan a single IP address for camera devices.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium text-scanner-info">IP Range</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Scan a range of IP addresses using CIDR notation (e.g., 192.168.1.0/24).
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium text-scanner-info">Search Engines</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Use Shodan, ZoomEye, or Censys to discover cameras based on search queries.
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Scan Settings</h3>
                      <Separator className="my-2 bg-gray-700" />
                      <ul className="space-y-4">
                        <li>
                          <h4 className="font-medium text-scanner-info">Aggressive Mode</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Increases scanning speed but may be more easily detected.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium text-scanner-info">Test Credentials</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Attempts to authenticate with common default credentials.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium text-scanner-info">Check Vulnerabilities</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Tests discovered cameras for known security vulnerabilities.
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Interpreting Results</h3>
                      <Separator className="my-2 bg-gray-700" />
                      <p className="text-sm text-gray-300 mb-3">
                        The results table shows all discovered cameras with their status:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
                          <span className="font-medium">Online</span>
                          <span className="text-sm text-gray-300 ml-2">- Camera is accessible but not vulnerable</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="font-medium">Vulnerable</span>
                          <span className="text-sm text-gray-300 ml-2">- Camera has security issues</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="font-medium">Authenticated</span>
                          <span className="text-sm text-gray-300 ml-2">- Successfully logged into camera</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-scanner-info" />
                  Security Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Usage Policy</h3>
                      <Separator className="my-2 bg-gray-700" />
                      <div className="text-sm text-gray-300 space-y-2">
                        <p>
                          This tool is intended for legitimate security research and assessment purposes only.
                          You MUST have permission to scan any network or device.
                        </p>
                        <p className="text-scanner-danger font-medium">
                          Unauthorized scanning of networks may violate computer crime laws in many jurisdictions.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Camera Security Best Practices</h3>
                      <Separator className="my-2 bg-gray-700" />
                      <ul className="space-y-3">
                        <li className="flex">
                          <ShieldAlert className="h-5 w-5 text-scanner-info mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Change Default Credentials</h4>
                            <p className="text-sm text-gray-300">Always change factory default usernames and passwords.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <ShieldAlert className="h-5 w-5 text-scanner-info mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Regular Firmware Updates</h4>
                            <p className="text-sm text-gray-300">Keep camera firmware updated to patch security vulnerabilities.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <ShieldAlert className="h-5 w-5 text-scanner-info mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Network Isolation</h4>
                            <p className="text-sm text-gray-300">Place cameras on a separate network segment with firewall protection.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <ShieldAlert className="h-5 w-5 text-scanner-info mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Disable Unused Services</h4>
                            <p className="text-sm text-gray-300">Turn off unnecessary protocols and services on camera devices.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <ShieldAlert className="h-5 w-5 text-scanner-info mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Use HTTPS/TLS</h4>
                            <p className="text-sm text-gray-300">Enable encrypted communications when available.</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="desktop" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5 text-scanner-info" />
                  Desktop Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    The web version of WatchTower Scanner simulates network scanning, as browsers cannot perform
                    actual network scans due to security restrictions. For full functionality, use the desktop application.
                  </p>
                  
                  <h3 className="text-lg font-semibold">Desktop App Features</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>Actual network scanning capabilities without simulation</li>
                    <li>Advanced vulnerability testing tools</li>
                    <li>Deeper OSINT integration</li>
                    <li>Local storage of scan results and reports</li>
                    <li>No browser security restrictions</li>
                  </ul>
                  
                  <div className="p-4 bg-scanner-dark-alt rounded-md mt-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-scanner-info" />
                      Desktop App Installation
                    </h4>
                    <p className="text-sm text-gray-300">
                      The desktop version can be downloaded from our GitHub repository. It's available for
                      Windows, macOS, and Linux.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Help;

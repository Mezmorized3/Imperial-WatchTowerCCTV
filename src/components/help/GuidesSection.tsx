
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Globe, Network, Lock, AlertTriangle, Search, Server, Settings, Database, Users, Zap, Eye, Code, Radio, Wifi, GitMerge, Map, Key, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                    Learn about the Imperial Scanner platform and its capabilities for securing surveillance systems and conducting OSINT operations. This guide covers the main interface, navigation, and key features.
                  </p>
                  <Link to="/imperial-scanner">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Search className="h-5 w-5 mr-2 text-scanner-primary" />
                    Setting Up Your First Scan
                  </h3>
                  <p className="text-gray-400">
                    Learn how to configure and run your first CCTV security scan to identify potentially vulnerable cameras. Understand scan parameters, targeting options, and performance settings.
                  </p>
                  <Link to="/imperial-scanner?section=scan-setup">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-scanner-primary" />
                    Understanding Scan Results
                  </h3>
                  <p className="text-gray-400">
                    Learn how to interpret scan results and vulnerability reports to secure your surveillance infrastructure. This guide explains the dashboard visualization, camera details, and security metrics.
                  </p>
                  <Link to="/viewer">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-scanner-primary" />
                    Globe View Navigation
                  </h3>
                  <p className="text-gray-400">
                    Learn how to use the interactive globe to visualize and navigate camera locations around the world. Master the controls, filters, and geolocation tools to identify surveillance systems.
                  </p>
                  <Link to="/imperial-scanner?section=globe">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Map className="h-5 w-5 mr-2 text-scanner-primary" />
                    Map Interface
                  </h3>
                  <p className="text-gray-400">
                    Navigate the map interface to locate and analyze camera systems by geographic region. Learn about heatmap overlays, clustering, and location-based filtering.
                  </p>
                  <Link to="/imperial-scanner?section=map">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
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
                    Learn how Imperial Scanner integrates with threat intelligence sources to provide context for your scan results. This guide covers API integrations, data sources, and intelligence application.
                  </p>
                  <Link to="/imperial-shield?panel=threat">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-scanner-primary" />
                    Configuration and Settings
                  </h3>
                  <p className="text-gray-400">
                    Detailed guide on configuring Imperial Scanner settings to match your security requirements and preferences. Learn about scan parameters, proxy settings, and application customization.
                  </p>
                  <Link to="/settings">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-scanner-primary" />
                    Enhanced Security Features
                  </h3>
                  <p className="text-gray-400">
                    Explore advanced security features including anomaly detection, firmware analysis, and vulnerability assessment. Learn how to implement comprehensive security reviews for camera systems.
                  </p>
                  <Link to="/imperial-shield">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Database className="h-5 w-5 mr-2 text-scanner-primary" />
                    Working with Scan Data
                  </h3>
                  <p className="text-gray-400">
                    Learn how to export, analyze, and visualize your scan data for better security insights and reporting. Master data filtering, custom reports, and trend analysis tools.
                  </p>
                  <Link to="/imperial-scanner?section=reports">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-scanner-primary" />
                    Anomaly Detection System
                  </h3>
                  <p className="text-gray-400">
                    Master the anomaly detection system to identify unusual camera behavior, suspicious connections, and potential security breaches in your surveillance network.
                  </p>
                  <Link to="/imperial-shield?panel=anomaly">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <GitMerge className="h-5 w-5 mr-2 text-scanner-primary" />
                    Firmware Analysis Tools
                  </h3>
                  <p className="text-gray-400">
                    Learn to use the firmware analysis tools to identify vulnerable camera firmware, outdated versions, and potential security flaws in surveillance system software.
                  </p>
                  <Link to="/imperial-shield?panel=firmware">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
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
                    Guide to using the integrated username search tools to conduct open-source intelligence gathering. Learn to track username presence across platforms and correlate user activity.
                  </p>
                  <Link to="/osint-tools?tool=username">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Network className="h-5 w-5 mr-2 text-scanner-primary" />
                    Network Reconnaissance
                  </h3>
                  <p className="text-gray-400">
                    Detailed guide on using Imperial Scanner's network tools for comprehensive security reconnaissance. Master port scanning, service detection, and network mapping capabilities.
                  </p>
                  <Link to="/osint-tools?tool=network">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Server className="h-5 w-5 mr-2 text-scanner-primary" />
                    Web Intelligence
                  </h3>
                  <p className="text-gray-400">
                    Learn how to use web intelligence tools to gather information about websites, domains, and online services. Discover techniques for technology stack analysis and security evaluation.
                  </p>
                  <Link to="/osint-tools?tool=web">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Code className="h-5 w-5 mr-2 text-scanner-primary" />
                    Scrapy Web Crawler
                  </h3>
                  <p className="text-gray-400">
                    Master the Scrapy web crawler integration to extract structured data from websites, map site architecture, and identify information relevant to security analysis.
                  </p>
                  <Link to="/osint-tools?tool=scrapy">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Terminal className="h-5 w-5 mr-2 text-scanner-primary" />
                    TorBot Dark Web Scanner
                  </h3>
                  <p className="text-gray-400">
                    Learn to use the TorBot tool for secure, anonymous scanning of dark web resources related to camera systems, credentials, and security information.
                  </p>
                  <Link to="/osint-tools?tool=torbot">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
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
                    Learn how to configure and use the advanced proxy features for anonymous scanning and enhanced security. This guide covers HTTP, SOCKS, and TOR proxies with authentication.
                  </p>
                  <Link to="/settings?section=proxy">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-scanner-primary" />
                    Operational Security
                  </h3>
                  <p className="text-gray-400">
                    Best practices for maintaining operational security while using Imperial Scanner for reconnaissance. Learn techniques for secure scanning and data protection.
                  </p>
                  <Link to="/imperial-shield?panel=operations">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Wifi className="h-5 w-5 mr-2 text-scanner-primary" />
                    Proxy Rotation and Chaining
                  </h3>
                  <p className="text-gray-400">
                    Master advanced proxy techniques including rotation, chaining, and connection encryption to maintain anonymity during extended scanning operations.
                  </p>
                  <Link to="/settings?section=advanced-proxy">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Radio className="h-5 w-5 mr-2 text-scanner-primary" />
                    DNS Protection Features
                  </h3>
                  <p className="text-gray-400">
                    Configure DNS protection to prevent leaks, use secure DNS services, and maintain privacy during network reconnaissance operations.
                  </p>
                  <Link to="/settings?section=dns-protection">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
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
                    Comprehensive guide to setting up and configuring the Imperial Server for enhanced functionality. Learn about deployment options, service configuration, and system requirements.
                  </p>
                  <Link to="/imperial-control?panel=setup">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-scanner-primary" />
                    Imperial Control Panel
                  </h3>
                  <p className="text-gray-400">
                    Guide to using the Imperial Control Panel for managing server operations and modules. Learn about service management, monitoring, and system health tracking.
                  </p>
                  <Link to="/imperial-control">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Key className="h-5 w-5 mr-2 text-scanner-primary" />
                    Authentication and API Keys
                  </h3>
                  <p className="text-gray-400">
                    Configure authentication for the Imperial Server and manage API keys for integrating with external services and tools.
                  </p>
                  <Link to="/settings?section=api-keys">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Terminal className="h-5 w-5 mr-2 text-scanner-primary" />
                    Legion Services Management
                  </h3>
                  <p className="text-gray-400">
                    Learn to manage the different Legion services that power the Imperial Server, including start/stop operations, health checks, and configuration options.
                  </p>
                  <Link to="/imperial-control?panel=legions">
                    <Button variant="link" className="px-0 text-scanner-primary">Read more</Button>
                  </Link>
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

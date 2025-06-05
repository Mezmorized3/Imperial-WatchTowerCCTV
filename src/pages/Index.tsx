
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  Camera, 
  Shield, 
  Globe, 
  Eye, 
  Server, 
  Settings,
  Terminal,
  Search,
  Radar,
  Lock,
  AlertTriangle,
  Activity,
  Database,
  Network
} from 'lucide-react';

const Index: React.FC = () => {
  const mainFeatures = [
    {
      title: "Imperial Scanner",
      description: "Advanced surveillance scanning and network reconnaissance",
      icon: Radar,
      path: "/imperial",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      features: ["Network Scanning", "ONVIF Discovery", "RTSP Detection", "Vulnerability Assessment"]
    },
    {
      title: "Camera Viewer", 
      description: "Real-time surveillance camera monitoring and stream management",
      icon: Camera,
      path: "/viewer",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      features: ["Live Streams", "Multi-Camera Grid", "Recording", "Stream Analysis"]
    },
    {
      title: "OSINT Tools",
      description: "Open source intelligence gathering and reconnaissance",
      icon: Globe,
      path: "/osint-tools", 
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      features: ["Social Media OSINT", "Data Analysis", "Document Search", "Camera Intelligence"]
    },
    {
      title: "Hacking Tools",
      description: "Security testing and penetration testing framework",
      icon: Terminal,
      path: "/hacking-tool",
      color: "text-purple-500", 
      bgColor: "bg-purple-500/10",
      features: ["Payload Generation", "SQL Injection", "XSS Testing", "Password Tools"]
    }
  ];

  const imperialModules = [
    {
      title: "Imperial Control",
      description: "Main control panel for Imperial operations",
      icon: Shield,
      path: "/imperial-control",
      color: "text-red-600",
      status: "Active"
    },
    {
      title: "Imperial Shinobi", 
      description: "Advanced surveillance modules and stealth operations",
      icon: Eye,
      path: "/imperial-shinobi",
      color: "text-orange-500",
      status: "Ready"
    },
    {
      title: "Imperial Shield",
      description: "Security modules and vulnerability assessment",
      icon: Lock,
      path: "/imperial-shield", 
      color: "text-yellow-500",
      status: "Monitoring"
    }
  ];

  const quickStats = [
    { label: "Active Scans", value: "12", icon: Activity, color: "text-green-500" },
    { label: "Cameras Found", value: "847", icon: Camera, color: "text-blue-500" },
    { label: "Vulnerabilities", value: "23", icon: AlertTriangle, color: "text-red-500" },
    { label: "Networks", value: "156", icon: Network, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <DashboardHeader />
      
      <main className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            IMPERIAL WATCHTOWER
          </h1>
          <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto">
            Advanced Surveillance, Intelligence & Security Operations Platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-red-500 border-red-500/30 bg-red-500/10">
              Surveillance Active
            </Badge>
            <Badge variant="secondary" className="text-green-500 border-green-500/30 bg-green-500/10">
              Systems Online
            </Badge>
            <Badge variant="secondary" className="text-blue-500 border-blue-500/30 bg-blue-500/10">
              OSINT Ready
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-scanner-dark-alt border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Database className="mr-2 text-blue-500" />
            Main Operations Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="bg-scanner-dark-alt border-gray-800 hover:border-gray-600 transition-colors group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${feature.bgColor} mb-3`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Button 
                      asChild 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link to={feature.path}>
                        <Search className="h-4 w-4 mr-2" />
                        Launch
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feature.features.map((feat, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link to={feature.path} className="flex items-center justify-center">
                      Access {feature.title}
                      <feature.icon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Imperial Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Shield className="mr-2 text-red-500" />
            Imperial Command Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {imperialModules.map((module, index) => (
              <Card key={index} className="bg-scanner-dark-alt border-gray-800 hover:border-red-500/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <module.icon className={`h-8 w-8 ${module.color}`} />
                    <Badge variant="outline" className={`${module.color} border-current`}>
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="secondary">
                    <Link to={module.path} className="flex items-center justify-center">
                      Access Module
                      <module.icon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button asChild size="lg" className="h-16" variant="outline">
            <Link to="/settings" className="flex flex-col items-center">
              <Settings className="h-6 w-6 mb-1" />
              Settings
            </Link>
          </Button>
          <Button asChild size="lg" className="h-16" variant="outline">
            <Link to="/help" className="flex flex-col items-center">
              <Search className="h-6 w-6 mb-1" />
              Help & Docs
            </Link>
          </Button>
          <Button asChild size="lg" className="h-16 md:col-span-1 col-span-2" variant="outline">
            <Link to="/imperial" className="flex flex-col items-center">
              <Radar className="h-6 w-6 mb-1" />
              Quick Scan
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, FileText, BookOpen, MessageSquare, Video, ExternalLink } from 'lucide-react';

const Help = () => {
  const imperialDirectiveBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗         ██████╗ ██╗██████╗ ███████╗ ██████╗████████╗██╗██╗   ██╗███████╗
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔══██╗██║██╔══██╗██╔════╝██╔════╝╚══██╔══╝██║██║   ██║██╔════╝
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ██║  ██║██║██████╔╝█████╗  ██║        ██║   ██║██║   ██║█████╗  
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██║  ██║██║██╔══██╗██╔══╝  ██║        ██║   ██║╚██╗ ██╔╝██╔══╝  
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ██████╔╝██║██║  ██║███████╗╚██████╗   ██║   ██║ ╚████╔╝ ███████╗
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝
  `;

  return (
    <div className="flex flex-col min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
              <pre className="text-[#ea384c] text-xs font-mono">{imperialDirectiveBanner}</pre>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <HelpCircle className="h-8 w-8 mr-3 text-scanner-primary" />
          <h1 className="text-3xl font-bold">Imperial Directive</h1>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search help topics..." 
              className="w-full pl-10 bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="guides">User Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription className="text-gray-400">
                  Common questions and answers about using Watchtower
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-scanner-primary">
                      Is Watchtower legal to use?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      Watchtower is designed for ethical security professionals and researchers. Always ensure you have proper authorization before scanning any networks or systems. The tool is meant for defensive security purposes, and users are responsible for complying with all applicable laws and regulations in their jurisdiction.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-scanner-primary">
                      How does Watchtower discover CCTV cameras?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      Watchtower uses a combination of network scanning techniques, device fingerprinting, and protocol detection to identify CCTV cameras. It looks for common RTSP streams, web interfaces, and manufacturer-specific signatures to locate and classify surveillance devices on networks.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-scanner-primary">
                      Can Watchtower detect all vulnerabilities?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      While Watchtower is designed to identify common vulnerabilities in CCTV systems, no security tool can detect 100% of all possible vulnerabilities. The scanner focuses on known security issues, default credentials, outdated firmware, and misconfiguration. Regular updates help ensure the detection capabilities remain current.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-scanner-primary">
                      Is my scan data kept private?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      Yes, all scan data is processed locally and remains private. Watchtower does not send your scan results to any external servers unless you explicitly enable the threat intelligence integration feature, which shares only anonymized data needed for analysis.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-scanner-primary">
                      How often should I scan my surveillance systems?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      For optimal security, we recommend scanning your surveillance systems at least monthly, after any system changes, and whenever new security advisories are published for your equipment. You can also set up automated periodic scanning in the settings panel.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-scanner-primary">
                      Can Watchtower help secure my cameras?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      Yes, Watchtower not only identifies vulnerabilities but also provides remediation guidance. For each issue detected, the platform offers specific recommendations to address the security concern, such as firmware update links, configuration changes, or best practices documentation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription className="text-gray-400">
                  Need additional help? Our support team is here to help you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <BookOpen className="h-8 w-8 text-scanner-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Documentation</h3>
                    <p className="text-gray-400 mb-4">
                      Explore our comprehensive documentation for detailed guides and references.
                    </p>
                    <Button className="w-full">Browse Documentation</Button>
                  </div>
                  
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-scanner-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                    <p className="text-gray-400 mb-4">
                      Chat with our support team for immediate assistance with your questions.
                    </p>
                    <Button className="w-full">Start Chat</Button>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Submit a Support Ticket</h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input id="name" className="bg-gray-700" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input id="email" className="bg-gray-700" placeholder="Your email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input id="subject" className="bg-gray-700" placeholder="Brief description of your issue" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea 
                        id="message" 
                        rows={5} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white"
                        placeholder="Describe your issue in detail..."
                      ></textarea>
                    </div>
                    <Button className="w-full">Submit Ticket</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Help;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FaqSection = () => {
  return (
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
  );
};

export default FaqSection;

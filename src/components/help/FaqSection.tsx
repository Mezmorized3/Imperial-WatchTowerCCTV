
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FaqSection = () => {
  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription className="text-gray-400">
          Common questions and answers about using Imperial Scanner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {/* General Questions */}
          <AccordionItem value="section-1-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              General Questions
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-1" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Is Imperial Scanner legal to use?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner is designed for ethical security professionals and researchers. Always ensure you have proper authorization before scanning any networks or systems. The tool is meant for defensive security purposes, and users are responsible for complying with all applicable laws and regulations in their jurisdiction.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How does Imperial Scanner discover CCTV cameras?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner uses a combination of network scanning techniques, device fingerprinting, and protocol detection to identify CCTV cameras. It looks for common RTSP streams, web interfaces, and manufacturer-specific signatures to locate and classify surveillance devices on networks.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Is my scan data kept private?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, all scan data is processed locally and remains private. Imperial Scanner does not send your scan results to any external servers unless you explicitly enable the threat intelligence integration feature, which shares only anonymized data needed for analysis.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How often should I scan my surveillance systems?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    For optimal security, we recommend scanning your surveillance systems at least monthly, after any system changes, and whenever new security advisories are published for your equipment. You can also set up automated periodic scanning in the settings panel.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* Security & Vulnerability Questions */}
          <AccordionItem value="section-2-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              Security & Vulnerabilities
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-5" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can Imperial Scanner detect all vulnerabilities?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    While Imperial Scanner is designed to identify common vulnerabilities in CCTV systems, no security tool can detect 100% of all possible vulnerabilities. The scanner focuses on known security issues, default credentials, outdated firmware, and misconfiguration. Regular updates help ensure the detection capabilities remain current.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can Imperial Scanner help secure my cameras?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, Imperial Scanner not only identifies vulnerabilities but also provides remediation guidance. For each issue detected, the platform offers specific recommendations to address the security concern, such as firmware update links, configuration changes, or best practices documentation.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What types of vulnerabilities can be detected?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner can detect numerous vulnerability types including default credentials, outdated firmware, open telnet/SSH ports, insecure web interfaces, unencrypted RTSP streams, buffer overflow vulnerabilities, command injection flaws, and more depending on the camera model and firmware version.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How accurate is the vulnerability assessment?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner's vulnerability assessment employs multiple validation techniques to minimize false positives. However, some assessments are based on fingerprinting and version detection, which may occasionally result in false positives or negatives. Critical vulnerabilities are verified when possible to ensure accuracy.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* OSINT Tools Questions */}
          <AccordionItem value="section-3-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              OSINT Tools
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-9" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What OSINT tools are included in Imperial Scanner?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner integrates multiple OSINT tools including Sherlock for username searches, Cameradar for RTSP stream discovery, WebCheck for website analysis, Photon for web crawling, TorBot for darkweb scanning, and custom tools for camera discovery and social media analysis.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Are the OSINT results saved locally?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, all OSINT results are saved locally by default. You can find your saved results in the Reports section. The application does not share your search queries or results unless you explicitly configure external integrations.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-11" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I interpret the OSINT results?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Each OSINT tool provides results in a structured format with clear indicators of relevance and confidence. The system uses color coding to highlight potential security concerns, and detailed explanations are provided for each finding. For more complex analyses, consult the specific tool documentation in the Help section.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* Proxy & Privacy Questions */}
          <AccordionItem value="section-4-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              Proxies & Privacy
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-12" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do proxies enhance my security when scanning?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Proxies route your scan traffic through intermediate servers, concealing your actual IP address. This provides anonymity, prevents direct connections to targets, and helps bypass some geographic restrictions. Imperial Scanner supports various proxy types including HTTP, SOCKS, and specialized options like TOR for maximum privacy.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-13" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What types of proxies does Imperial Scanner support?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner supports HTTP, HTTPS, SOCKS4, and SOCKS5 proxies. It also includes special integrations for TOR networks, proxy chaining, and rotating proxies. Both authenticated and non-authenticated proxies are supported, with options for connection encryption.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-14" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How can I test if my proxy is working correctly?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner includes a built-in proxy testing tool in the Proxy Manager section. This tool checks your connection through the configured proxy and displays your apparent external IP address, latency, and DNS leak test results. You can also use the advanced proxy diagnostics for more detailed connection information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-15" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is proxy rotation and when should I use it?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Proxy rotation automatically switches between multiple proxy servers at defined intervals. This feature is useful for extensive scanning operations to prevent IP blocking, distribute traffic, and enhance anonymity. Use this feature when conducting large-scale scans or when you need an additional layer of privacy protection.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* Imperial Server Questions */}
          <AccordionItem value="section-5-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              Imperial Server
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-16" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is the Imperial Server?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    The Imperial Server is a backend component that enhances the capabilities of Imperial Scanner. It provides additional services like distributed scanning, media streaming for camera feeds, centralized reporting, and advanced OSINT tool integration. The server runs on your local machine or network and communicates with the Imperial Scanner frontend.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-17" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I set up the Imperial Server?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    To set up the Imperial Server, navigate to the server directory and run `npm install` followed by `npm start`. The server requires Node.js v16 or later and several dependencies listed in the SETUP_GUIDE.md document. For production environments, use `npm run start:production` with the appropriate configuration in server/config.json.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-18" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What ports does the Imperial Server use?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    The Imperial Server uses several ports for different services: 7443 for the administrative API, 8080 for the web application, 8000 for the ticker HTML server, 5000 for the SocketIO/ticker server, 5001 for the control panel API, and 3000 for the HLS Restream Server. These port assignments can be configured in server/config.json.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-19" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I access the Imperial Server Control Panel?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    You can access the Imperial Server Control Panel either through the web interface at http://localhost:7443/v1/court/ after starting the server, or directly within the Imperial Scanner application through the "Imperial Control" tab. Authentication is required using the admin token configured in server/config.json.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          {/* Troubleshooting Questions */}
          <AccordionItem value="section-6-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              Troubleshooting
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-20" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Imperial Scanner isn't finding any cameras on my network
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    This could be due to several factors: 1) Firewall or network restrictions blocking scan traffic, 2) Incorrect subnet configuration, 3) Cameras using non-standard ports or protocols, or 4) Security measures on the cameras blocking discovery. Try adjusting scan settings to use a more aggressive scan mode, verify network permissions, and ensure you're scanning the correct IP range.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-21" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Camera streams aren't loading in the viewer
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If camera streams aren't loading, check the following: 1) Verify the camera is online and accessible, 2) Ensure correct credentials are provided, 3) Check if the RTSP URL format is correct for the camera model, 4) Verify that FFmpeg is properly installed and configured, 5) Check browser console for errors related to stream loading or CORS issues.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-22" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    OSINT tools are not returning results
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If OSINT tools aren't returning results: 1) Check your internet connection, 2) Verify that required dependencies are installed, 3) Ensure path configurations are correct in the .toolpaths file, 4) Check if API rate limits have been reached for external services, 5) Try using a proxy if the target service might be blocking your requests.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-23" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Imperial Server won't start properly
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If the Imperial Server fails to start: 1) Check for conflicting port usage, 2) Verify Node.js version (v16+ required), 3) Ensure all dependencies are installed correctly, 4) Check server logs for specific error messages in server/imperial-audit.log, 5) Verify that config.json has valid settings, 6) Run with elevated permissions if accessing restricted system features.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FaqSection;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

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
                    Imperial Scanner uses a combination of network scanning techniques, device fingerprinting, and protocol detection to identify CCTV cameras. It looks for common RTSP streams, web interfaces, and manufacturer-specific signatures to locate and classify surveillance devices on networks. The <Link to="/imperial-scanner?section=scan-setup" className="text-scanner-primary">scan configuration</Link> allows you to customize discovery methods.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Is my scan data kept private?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, all scan data is processed locally and remains private. Imperial Scanner does not send your scan results to any external servers unless you explicitly enable the threat intelligence integration feature, which shares only anonymized data needed for analysis. You can verify and configure these settings in the <Link to="/settings?section=security" className="text-scanner-primary">Security Settings</Link> panel.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How often should I scan my surveillance systems?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    For optimal security, we recommend scanning your surveillance systems at least monthly, after any system changes, and whenever new security advisories are published for your equipment. You can also set up automated periodic scanning in the <Link to="/settings?section=general" className="text-scanner-primary">settings panel</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is the difference between Imperial Scanner and Imperial Shield?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner is the core reconnaissance tool for discovering and analyzing camera systems. Imperial Shield is the defensive module that provides threat intelligence, vulnerability assessment, and security monitoring for discovered cameras. Together they form a complete surveillance security solution. Access Imperial Shield through the <Link to="/imperial-shield" className="text-scanner-primary">Imperial Shield</Link> page.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can I export my discovered camera data?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, Imperial Scanner supports exporting discovered camera data in multiple formats including JSON, CSV, and PDF reports. You can access export options from the results dashboard after completing a scan. For detailed reports, visit the <Link to="/imperial-scanner?section=reports" className="text-scanner-primary">Reports section</Link>.
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
                    While Imperial Scanner is designed to identify common vulnerabilities in CCTV systems, no security tool can detect 100% of all possible vulnerabilities. The scanner focuses on known security issues, default credentials, outdated firmware, and misconfiguration. Regular updates help ensure the detection capabilities remain current. Visit <Link to="/imperial-shield?panel=vulnerability" className="text-scanner-primary">Vulnerability Assessment</Link> for detailed information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can Imperial Scanner help secure my cameras?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, Imperial Scanner not only identifies vulnerabilities but also provides remediation guidance. For each issue detected, the platform offers specific recommendations to address the security concern, such as firmware update links, configuration changes, or best practices documentation. Check the <Link to="/imperial-shield?panel=remediation" className="text-scanner-primary">Remediation Recommendations</Link> section after scanning.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What types of vulnerabilities can be detected?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner can detect numerous vulnerability types including default credentials, outdated firmware, open telnet/SSH ports, insecure web interfaces, unencrypted RTSP streams, buffer overflow vulnerabilities, command injection flaws, and more depending on the camera model and firmware version. The <Link to="/imperial-shield?panel=threat-database" className="text-scanner-primary">Threat Database</Link> contains comprehensive information about detectable vulnerabilities.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How accurate is the vulnerability assessment?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner's vulnerability assessment employs multiple validation techniques to minimize false positives. However, some assessments are based on fingerprinting and version detection, which may occasionally result in false positives or negatives. Critical vulnerabilities are verified when possible to ensure accuracy. You can adjust verification settings in <Link to="/settings?section=scanning" className="text-scanner-primary">Scan Settings</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How does the Anomaly Detection System work?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    The Anomaly Detection System uses machine learning algorithms to identify unusual patterns in camera behavior, network traffic, and access patterns. It establishes baseline behavior and flags deviations that might indicate compromise or misuse. You can configure sensitivity and monitoring parameters in the <Link to="/imperial-shield?panel=anomaly" className="text-scanner-primary">Anomaly Detection</Link> section.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What's included in the firmware analysis?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner's firmware analysis includes version identification, known vulnerability matching, binary analysis for suspicious code patterns, and configuration assessment. For supported camera models, it can also verify firmware integrity and detect unauthorized modifications. Access the <Link to="/imperial-shield?panel=firmware" className="text-scanner-primary">Firmware Analysis</Link> tools for detailed reports.
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
                    Imperial Scanner integrates multiple OSINT tools including Sherlock for username searches, Cameradar for RTSP stream discovery, WebCheck for website analysis, Photon for web crawling, TorBot for darkweb scanning, Scrapy for structured data extraction, and custom tools for camera discovery and social media analysis. Access these tools from the <Link to="/osint-tools" className="text-scanner-primary">OSINT Tools</Link> page.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Are the OSINT results saved locally?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, all OSINT results are saved locally by default. You can find your saved results in the Reports section. The application does not share your search queries or results unless you explicitly configure external integrations. Manage data storage settings in <Link to="/settings?section=data" className="text-scanner-primary">Data Management</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-11" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I interpret the OSINT results?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Each OSINT tool provides results in a structured format with clear indicators of relevance and confidence. The system uses color coding to highlight potential security concerns, and detailed explanations are provided for each finding. For more complex analyses, consult the specific <Link to="/osint-tools?section=guides" className="text-scanner-primary">tool documentation</Link> in the OSINT Tools section.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-12" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can I use OSINT tools with proxies for anonymity?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, all OSINT tools in Imperial Scanner can be configured to use proxy connections for enhanced anonymity. Set up proxy configurations in the <Link to="/settings?section=proxy" className="text-scanner-primary">Proxy Settings</Link> panel, and then enable them when running OSINT operations. Each tool respects the global proxy settings with tool-specific overrides available.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-13" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is the Imperial Shinobi module?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Shinobi is the advanced OSINT module that combines multiple intelligence gathering tools into unified workflows. It can correlate data from various sources, create intelligence maps, and identify connections between different entities. Access this module from the <Link to="/imperial-shinobi" className="text-scanner-primary">Imperial Shinobi</Link> page.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-14" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can I integrate custom OSINT tools?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, Imperial Scanner supports plugin architecture for custom OSINT tools and data sources. Advanced users can integrate additional tools by following the developer documentation and using the tool integration framework. Configure custom tools in the <Link to="/settings?section=integrations" className="text-scanner-primary">Integrations Panel</Link>.
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
                    Proxies route your scan traffic through intermediate servers, concealing your actual IP address. This provides anonymity, prevents direct connections to targets, and helps bypass some geographic restrictions. Imperial Scanner supports various proxy types including HTTP, SOCKS, and specialized options like TOR for maximum privacy. Configure these options in <Link to="/settings?section=proxy" className="text-scanner-primary">Proxy Settings</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-13" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What types of proxies does Imperial Scanner support?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner supports HTTP, HTTPS, SOCKS4, and SOCKS5 proxies. It also includes special integrations for TOR networks, proxy chaining, and rotating proxies. Both authenticated and non-authenticated proxies are supported, with options for connection encryption. The <Link to="/settings?section=advanced-proxy" className="text-scanner-primary">Advanced Proxy Settings</Link> provide comprehensive configuration options.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-14" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How can I test if my proxy is working correctly?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner includes a built-in proxy testing tool in the <Link to="/settings?section=proxy" className="text-scanner-primary">Proxy Manager</Link> section. This tool checks your connection through the configured proxy and displays your apparent external IP address, latency, and DNS leak test results. You can also use the advanced proxy diagnostics for more detailed connection information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-15" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is proxy rotation and when should I use it?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Proxy rotation automatically switches between multiple proxy servers at defined intervals. This feature is useful for extensive scanning operations to prevent IP blocking, distribute traffic, and enhance anonymity. Use this feature when conducting large-scale scans or when you need an additional layer of privacy protection. Configure rotation settings in <Link to="/settings?section=proxy-rotation" className="text-scanner-primary">Proxy Rotation</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-16" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How does DNS protection work with proxies?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    The DNS protection feature encrypts DNS queries and routes them through secure DNS servers or your proxy connection, preventing DNS leaks that could reveal your actual location or identity. This is particularly important when conducting sensitive reconnaissance. Enable and configure this feature in <Link to="/settings?section=dns-protection" className="text-scanner-primary">DNS Protection Settings</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-17" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is Force TLS mode in proxy settings?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Force TLS mode ensures that all connections between your system and the proxy server are encrypted using Transport Layer Security, even if the proxy type normally uses unencrypted connections. This adds an additional layer of security by preventing interception of your proxy authentication and traffic details. Enable this feature in <Link to="/settings?section=advanced-proxy" className="text-scanner-primary">Advanced Proxy Settings</Link>.
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
                    The Imperial Server is a backend component that enhances the capabilities of Imperial Scanner. It provides additional services like distributed scanning, media streaming for camera feeds, centralized reporting, and advanced OSINT tool integration. The server runs on your local machine or network and communicates with the Imperial Scanner frontend. Learn more in the <Link to="/imperial-control?panel=about" className="text-scanner-primary">Imperial Server Overview</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-17" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I set up the Imperial Server?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    To set up the Imperial Server, navigate to the server directory and run `npm install` followed by `npm start`. The server requires Node.js v16 or later and several dependencies listed in the SETUP_GUIDE.md document. For production environments, use `npm run start:production` with the appropriate configuration in server/config.json. Detailed instructions are available in <Link to="/imperial-control?panel=setup" className="text-scanner-primary">Server Setup</Link>.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-18" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What ports does the Imperial Server use?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    The Imperial Server uses several ports for different services: 7443 for the administrative API, 8080 for the web application, 8000 for the ticker HTML server, 5000 for the SocketIO/ticker server, 5001 for the control panel API, and 3000 for the HLS Restream Server. These port assignments can be configured in server/config.json through the <Link to="/imperial-control?panel=ports" className="text-scanner-primary">Port Configuration</Link> panel.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-19" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I access the Imperial Server Control Panel?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    You can access the Imperial Server Control Panel either through the web interface at http://localhost:7443/v1/court/ after starting the server, or directly within the Imperial Scanner application through the <Link to="/imperial-control" className="text-scanner-primary">Imperial Control</Link> tab. Authentication is required using the admin token configured in server/config.json.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-20" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What are Imperial Legions?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Legions are the individual service components that make up the Imperial Server ecosystem. Each Legion handles specific functionality such as scanning, streaming, OSINT operations, or administration. Legions can be started, stopped, and monitored independently through the <Link to="/imperial-control?panel=legions" className="text-scanner-primary">Legion Management</Link> interface.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-21" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How do I update the Imperial Server?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Updates to the Imperial Server can be applied through the <Link to="/imperial-control?panel=updates" className="text-scanner-primary">Server Update</Link> panel. The system will download and apply updates while preserving your configuration. Always back up your config.json file before updating. For manual updates, pull the latest code from the repository and restart the server.
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
                    This could be due to several factors: 1) Firewall or network restrictions blocking scan traffic, 2) Incorrect subnet configuration, 3) Cameras using non-standard ports or protocols, or 4) Security measures on the cameras blocking discovery. Try adjusting scan settings in <Link to="/imperial-scanner?section=scan-settings" className="text-scanner-primary">Scan Configuration</Link> to use a more aggressive scan mode, verify network permissions, and ensure you're scanning the correct IP range.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-21" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Camera streams aren't loading in the viewer
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If camera streams aren't loading, check the following: 1) Verify the camera is online and accessible, 2) Ensure correct credentials are provided, 3) Check if the RTSP URL format is correct for the camera model, 4) Verify that FFmpeg is properly installed and configured, 5) Check browser console for errors related to stream loading or CORS issues. The <Link to="/viewer?section=troubleshooting" className="text-scanner-primary">Stream Troubleshooter</Link> can help diagnose specific issues.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-22" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    OSINT tools are not returning results
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If OSINT tools aren't returning results: 1) Check your internet connection, 2) Verify that required dependencies are installed, 3) Ensure path configurations are correct in the .toolpaths file, 4) Check if API rate limits have been reached for external services, 5) Try using a proxy if the target service might be blocking your requests. The <Link to="/osint-tools?section=diagnostics" className="text-scanner-primary">OSINT Diagnostics</Link> tool can help identify specific issues.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-23" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Imperial Server won't start properly
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If the Imperial Server fails to start: 1) Check for conflicting port usage, 2) Verify Node.js version (v16+ required), 3) Ensure all dependencies are installed correctly, 4) Check server logs for specific error messages in server/imperial-audit.log, 5) Verify that config.json has valid settings, 6) Run with elevated permissions if accessing restricted system features. The <Link to="/imperial-control?panel=diagnostics" className="text-scanner-primary">Server Diagnostics</Link> tool can help troubleshoot startup issues.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-24" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Proxy connections are failing or unstable
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    For proxy connection issues: 1) Verify the proxy server is online and accessible, 2) Check that authentication credentials are correct, 3) Ensure your proxy type setting (HTTP, SOCKS) matches the proxy server, 4) Test with multiple proxy servers to identify if it's a specific server issue, 5) Check if your ISP or network is blocking proxy connections. Use the <Link to="/settings?section=proxy-diagnostics" className="text-scanner-primary">Proxy Diagnostics</Link> tool to test connections.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-25" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    The globe view isn't loading or displaying cameras
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    If the globe view isn't loading: 1) Check that your browser supports WebGL, 2) Ensure you have completed a scan with geolocation data, 3) Verify that the globe assets have loaded correctly (check console for errors), 4) Try clearing browser cache and reloading, 5) Check if hardware acceleration is enabled in your browser. If some cameras don't appear, they may lack valid geolocation data. Check the <Link to="/imperial-scanner?section=map-settings" className="text-scanner-primary">Globe Settings</Link> for additional troubleshooting options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          
          {/* Advanced Usage Questions */}
          <AccordionItem value="section-7-header" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-scanner-primary font-semibold text-lg">
              Advanced Usage
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full ml-4">
                <AccordionItem value="item-26" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How can I integrate with external security tools?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Imperial Scanner supports integration with external security tools through its API and export features. You can configure integrations in the <Link to="/settings?section=integrations" className="text-scanner-primary">Integrations panel</Link>, which supports common security platforms, SIEM systems, and vulnerability management tools. Data can be shared via webhooks, API calls, or exported files.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-27" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    Can I customize scan modules and detection rules?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, advanced users can customize scan modules and detection rules through the <Link to="/settings?section=custom-modules" className="text-scanner-primary">Custom Modules</Link> interface. This allows you to create specialized detection logic for proprietary systems, add detection for new vulnerabilities, or modify existing scan behaviors to meet specific requirements.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-28" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    What is the Imperial Pawn system?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    The Imperial Pawn system is an advanced distributed scanning architecture that allows you to deploy lightweight scanner agents across multiple systems. These "pawns" report back to the central Imperial Server, enabling coordinated scanning operations from diverse network positions. Configure and monitor pawns through the <Link to="/imperial-control?panel=pawns" className="text-scanner-primary">Pawn Management</Link> interface.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-29" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-scanner-primary">
                    How can I use Imperial Scanner for continuous monitoring?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Set up continuous monitoring using the <Link to="/imperial-shield?panel=monitoring" className="text-scanner-primary">Continuous Monitoring</Link> feature. This configures scheduled scans, automatic vulnerability checks, and alert notifications when new issues are detected. You can define alert thresholds, notification methods, and scanning frequency for persistent surveillance of your camera security.
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

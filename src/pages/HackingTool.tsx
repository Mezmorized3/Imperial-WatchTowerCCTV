
import React, { useState, useEffect } from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Terminal, Download, ExternalLink, Code, Shield, AlertTriangle, Wrench, Copy, Check, Send, Bug, Settings2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { executeHackingTool, executeRapidPayload } from '@/utils/osintTools';
import { executeSecurityAdmin } from '@/utils/osintTools';

// Import the refactored components
import ReverseShellTab from '@/components/hacking-tools/ReverseShellTab';
import XssPayloadsTab from '@/components/hacking-tools/XssPayloadsTab';
import SqliPayloadsTab from '@/components/hacking-tools/SqliPayloadsTab';
import PayloadGeneratorTab from '@/components/hacking-tools/PayloadGeneratorTab';
import EncoderDecoderTab from '@/components/hacking-tools/EncoderDecoderTab';
import PasswordCrackerTab from '@/components/hacking-tools/PasswordCrackerTab';
import AdditionalTools from '@/components/hacking-tools/AdditionalTools';
import FileCentipede from '@/components/hacking-tools/FileCentipede';

const HackingToolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reverse-shell');
  const [isRealmode, setIsRealmode] = useState(false);
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Check for configuration in localStorage
  useEffect(() => {
    const realMode = localStorage.getItem('hacktools-realmode') === 'true';
    setIsRealmode(realMode);
  }, []);
  
  const toggleRealMode = () => {
    const newMode = !isRealmode;
    setIsRealmode(newMode);
    localStorage.setItem('hacktools-realmode', newMode.toString());
    
    toast({
      title: newMode ? "Real Mode Activated" : "Simulation Mode Activated",
      description: newMode ? 
        "Tools will execute real commands. Use with caution." : 
        "Tools will run in simulation mode with no real impact.",
      variant: newMode ? "destructive" : "default"
    });
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Cpu className="mr-2 h-6 w-6 text-scanner-primary" />
            Hacking Tool Framework
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Security testing and vulnerability assessment framework
            </p>
            <div className="flex items-center">
              <span className="text-xs mr-2">
                {isRealmode ? 'Real Mode' : 'Simulation Mode'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleRealMode}
                className={isRealmode ? "bg-red-900/20 hover:bg-red-900/30 text-red-400" : ""}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                {isRealmode ? 'Disable Real Mode' : 'Enable Real Mode'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-gray-700 bg-scanner-dark shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 text-scanner-primary mr-2" />
                  HackTools Implementation
                </CardTitle>
                <CardDescription className="text-gray-400">
                  The all-in-one Red Team toolkit for Web Pentesters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="reverse-shell" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-6 mb-4">
                    <TabsTrigger value="reverse-shell">Reverse Shell</TabsTrigger>
                    <TabsTrigger value="xss-payloads">XSS Payloads</TabsTrigger>
                    <TabsTrigger value="sqli-payloads">SQLi Payloads</TabsTrigger>
                    <TabsTrigger value="payload-gen">Payload Gen</TabsTrigger>
                    <TabsTrigger value="encode-decode">Encode/Decode</TabsTrigger>
                    <TabsTrigger value="password-cracker">Password Cracker</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reverse-shell">
                    <ReverseShellTab 
                      isRealmode={isRealmode}
                      isExecuting={isExecuting}
                      setIsExecuting={setIsExecuting}
                      setToolOutput={setToolOutput}
                    />
                  </TabsContent>
                  
                  <TabsContent value="xss-payloads">
                    <XssPayloadsTab />
                  </TabsContent>
                  
                  <TabsContent value="sqli-payloads">
                    <SqliPayloadsTab 
                      isExecuting={isExecuting}
                      setIsExecuting={setIsExecuting}
                      toolOutput={toolOutput}
                      activeTab={activeTab}
                      setToolOutput={setToolOutput}
                      executeSelectedTool={(type) => {
                        setIsExecuting(true);
                        setToolOutput(null);
                        
                        // Logic for executing SQLi tool is now in SqliPayloadsTab
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="payload-gen">
                    <PayloadGeneratorTab 
                      isExecuting={isExecuting}
                      setIsExecuting={setIsExecuting}
                      setToolOutput={setToolOutput}
                    />
                  </TabsContent>
                  
                  <TabsContent value="encode-decode">
                    <EncoderDecoderTab />
                  </TabsContent>
                  
                  <TabsContent value="password-cracker">
                    <PasswordCrackerTab 
                      isRealmode={isRealmode}
                      isExecuting={isExecuting}
                      setIsExecuting={setIsExecuting}
                      setToolOutput={setToolOutput}
                    />
                  </TabsContent>
                </Tabs>
                
                {toolOutput && (
                  <div className="mt-6 p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold">Tool Output</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-gray-700"
                        onClick={() => handleCopyToClipboard(toolOutput, 'output')}
                      >
                        {copySuccess === 'output' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {toolOutput}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <AdditionalTools 
              isRealmode={isRealmode} 
            />
            <FileCentipede />
          </div>
        </div>
      </main>
    </div>
  );
};

// Handle copy to clipboard functionality
const handleCopyToClipboard = (text: string, type: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast({
      title: "Copied to clipboard!",
      description: `The ${type} has been copied to your clipboard.`,
    });
  });
};

export default HackingToolPage;

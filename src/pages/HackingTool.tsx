
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Key, ShieldAlert, Code, Lock, ServerCrash, Bug } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

import EncoderDecoderTab from '@/components/hacking-tools/EncoderDecoderTab';
import ReverseShellTab from '@/components/hacking-tools/ReverseShellTab';
import PayloadGeneratorTab from '@/components/hacking-tools/PayloadGeneratorTab';
import SqliPayloadsTab from '@/components/hacking-tools/SqliPayloadsTab';
import XssPayloadsTab from '@/components/hacking-tools/XssPayloadsTab';
import AdditionalTools from '@/components/hacking-tools/AdditionalTools';

import PasswordCrackerTabShim from '@/components/hacking-tools/PasswordCrackerTabShim';

const HackingTool = () => {
  const [isRealmode, setIsRealmode] = useState(false);
  const [activeTab, setActiveTab] = useState('encoder');
  const [isExecuting, setIsExecuting] = useState(false);
  const [toolOutput, setToolOutput] = useState('');

  useEffect(() => {
    const realmode = localStorage.getItem('realmode') === 'true';
    setIsRealmode(realmode);
  }, []);

  const handleRealmodeToggle = (checked: boolean) => {
    setIsRealmode(checked);
    localStorage.setItem('realmode', checked.toString());
    toast({
      title: checked ? "Realmode Activated" : "Sandbox Mode Active",
      description: checked
        ? "Warning: Realmode allows execution of potentially harmful commands. Use with caution."
        : "Sandbox mode enabled. Commands are simulated for safety.",
      variant: checked ? "destructive" : "default"
    });
  };

  // Mock function to execute selected tool for SqliPayloadsTab
  const executeSelectedTool = async (tool: string) => {
    console.log(`Executing SQL tool: ${tool}`);
    setIsExecuting(true);
    
    try {
      // Simulate tool execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      setToolOutput(`${tool} executed successfully!\n\nResults:\n- Found 3 potential injection points\n- Tested parameter: id\n- Vulnerability detected: Boolean-based blind SQL injection`);
    } catch (error) {
      console.error('Tool execution error:', error);
      setToolOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const imperialProtocolBanner = `
    ██████╗  ██████╗ ██╗   ██╗███████╗██████╗  ██████╗ ███████╗
    ██╔══██╗██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔═══██╗██╔════╝
    ██████╔╝██║   ██║██║   ██║███████╗██████╔╝██║   ██║███████╗
    ██╔══██╗██║   ██║██║   ██║╚════██║██╔══██╗██║   ██║╚════██║
    ██████╔╝╚██████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝███████║
    ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
  `;

  return (
    <div className="min-h-screen bg-scanner-dark">
      <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Hacking Tools</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Label htmlFor="realmode-toggle" className="text-sm text-gray-400">
                Realmode
              </Label>
              <Switch
                id="realmode-toggle"
                checked={isRealmode}
                onCheckedChange={handleRealmodeToggle}
              />
            </div>
          </div>
        </div>
      </header>
      
      <div className="mx-auto mt-2 mb-4">
        <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
          <pre className="text-[#ea384c] text-xs font-mono">{imperialProtocolBanner}</pre>
        </div>
      </div>
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Tool Categories</CardTitle>
                <CardDescription className="text-gray-400">Select a category to begin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === 'encoder' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('encoder')}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Encoder/Decoder
                </Button>
                <Button
                  variant={activeTab === 'revshell' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('revshell')}
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  Reverse Shells
                </Button>
                <Button
                  variant={activeTab === 'passwords' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('passwords')}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Password Cracking
                </Button>
                <Button
                  variant={activeTab === 'payload' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('payload')}
                >
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Payload Generator
                </Button>
                <Button
                  variant={activeTab === 'sqli' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('sqli')}
                >
                  <ServerCrash className="mr-2 h-4 w-4" />
                  SQLi Payloads
                </Button>
                <Button
                  variant={activeTab === 'xss' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('xss')}
                >
                  <Bug className="mr-2 h-4 w-4" />
                  XSS Payloads
                </Button>
                <Button
                  variant={activeTab === 'additional' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('additional')}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Additional Tools
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <div className="bg-scanner-card rounded-lg border border-gray-700 overflow-hidden">
              <div className="border-b border-gray-700">
                <div className="flex overflow-x-auto">
                  
                </div>
              </div>
              
              <div className="p-4">
                {activeTab === 'encoder' && (
                  <EncoderDecoderTab 
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    setToolOutput={setToolOutput}
                    isRealmode={isRealmode}
                  />
                )}
                
                {activeTab === 'revshell' && (
                  <ReverseShellTab 
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    setToolOutput={setToolOutput}
                    isRealmode={isRealmode}
                  />
                )}
                
                {activeTab === 'passwords' && (
                  <PasswordCrackerTabShim
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    setToolOutput={setToolOutput}
                  />
                )}
                
                {activeTab === 'payload' && (
                  <PayloadGeneratorTab 
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    setToolOutput={setToolOutput}
                  />
                )}
                
                {activeTab === 'sqli' && (
                  <SqliPayloadsTab 
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    setToolOutput={setToolOutput}
                    executeSelectedTool={executeSelectedTool}
                    toolOutput={toolOutput}
                    activeTab={activeTab}
                  />
                )}
                
                {activeTab === 'xss' && (
                  <XssPayloadsTab 
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    setToolOutput={setToolOutput}
                    isRealmode={isRealmode}
                  />
                )}
                
                {activeTab === 'additional' && (
                  <AdditionalTools 
                    isRealmode={isRealmode}
                  />
                )}
              </div>
            </div>
            
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Tool Output</CardTitle>
                <CardDescription className="text-gray-400">Results and feedback from the tools</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  readOnly
                  className="bg-gray-800 text-white font-mono text-sm"
                  value={toolOutput}
                  placeholder="Tool output will appear here"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HackingTool;

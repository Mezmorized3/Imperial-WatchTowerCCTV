
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Terminal, Key, ShieldAlert, Code, Lock, ServerCrash, Bug } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

import HackingToolHeader from '@/components/hacking-tools/HackingToolHeader';
import HackingToolSidebar from '@/components/hacking-tools/HackingToolSidebar';
import ToolOutput from '@/components/hacking-tools/ToolOutput';
import TabContent from '@/components/hacking-tools/TabContent';

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

  return (
    <div className="min-h-screen bg-scanner-dark">
      <HackingToolHeader 
        isRealmode={isRealmode} 
        onRealmodeToggle={handleRealmodeToggle} 
      />
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-1 space-y-4">
            <HackingToolSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <div className="bg-scanner-card rounded-lg border border-gray-700 overflow-hidden">
              <div className="border-b border-gray-700">
                <div className="flex overflow-x-auto">
                  
                </div>
              </div>
              
              <div className="p-4">
                <TabContent 
                  activeTab={activeTab}
                  isExecuting={isExecuting}
                  setIsExecuting={setIsExecuting}
                  setToolOutput={setToolOutput}
                  toolOutput={toolOutput}
                  isRealmode={isRealmode}
                  executeSelectedTool={executeSelectedTool}
                />
              </div>
            </div>
            
            <ToolOutput toolOutput={toolOutput} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HackingTool;

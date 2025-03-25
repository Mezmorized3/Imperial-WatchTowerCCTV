
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Code, Terminal, Key, ShieldAlert, ServerCrash, Bug, Lock } from 'lucide-react';

interface HackingToolSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const HackingToolSidebar: React.FC<HackingToolSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default HackingToolSidebar;

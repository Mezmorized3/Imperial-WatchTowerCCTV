import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { executeRapidPayload } from '@/utils/osintUtilsConnector';
import { RapidPayloadParams } from '@/utils/types/osintToolTypes';

const RapidPayloadTool = () => {
  const { toast } = useToast();
  const [platform, setPlatform] = useState<"windows" | "linux" | "macos" | "android" | "php" | "python" | "bash" | "powershell">("windows");
  const [payloadType, setPayloadType] = useState("reverse_shell");
  const [lhost, setLhost] = useState("");
  const [lport, setLport] = useState(4444);
  const [format, setFormat] = useState("raw");
  const [generatedPayload, setGeneratedPayload] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePayload = async () => {
    if (!lhost) {
      toast({
        title: "Error",
        description: "LHOST is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setGeneratedPayload("");

    try {
      // Add the required 'tool' parameter to match RapidPayloadParams
      const params: RapidPayloadParams = {
        tool: 'rapidpayload',
        platform,
        payloadType,
        lhost,
        lport,
        format,
        encode: false
      };

      const result = await executeRapidPayload(params);

      if (result.success) {
        // Access payload correctly through results
        setGeneratedPayload(result.data.results.payload);
        toast({
          title: "Success",
          description: `${platform} ${payloadType} payload generated`
        });
      } else {
        // Fix error access
        const errorMessage = result.success === false ? result.error : "Failed to generate payload";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Payload generation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate payload",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rapid Payload Generator</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(value) => setPlatform(value as "windows" | "linux" | "macos" | "android" | "php" | "python" | "bash" | "powershell")}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
                <SelectItem value="macos">MacOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="bash">Bash</SelectItem>
                <SelectItem value="powershell">PowerShell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payloadType">Payload Type</Label>
            <Input
              type="text"
              id="payloadType"
              value={payloadType}
              onChange={(e) => setPayloadType(e.target.value)}
              placeholder="e.g., reverse_tcp"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lhost">LHOST</Label>
            <Input
              type="text"
              id="lhost"
              value={lhost}
              onChange={(e) => setLhost(e.target.value)}
              placeholder="e.g., 10.0.0.1"
            />
          </div>
          <div>
            <Label htmlFor="lport">LPORT</Label>
            <Input
              type="number"
              id="lport"
              value={lport}
              onChange={(e) => setLport(parseInt(e.target.value))}
              placeholder="e.g., 4444"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="format">Format</Label>
          <Select value={format} onValueChange={(value) => setFormat(value)}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raw">Raw</SelectItem>
              <SelectItem value="base64">Base64</SelectItem>
              <SelectItem value="hex">Hex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generatePayload} disabled={loading}>
          {loading ? "Generating..." : "Generate Payload"}
        </Button>
        {generatedPayload && (
          <div>
            <Label>Generated Payload</Label>
            <Input
              type="text"
              readOnly
              value={generatedPayload}
              className="mt-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RapidPayloadTool;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Lock, ShieldCheck, FileJson, FileText } from 'lucide-react';
import { executeSecurityAdmin } from '@/utils/osintImplementations';
import { SecurityAdminParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const SecurityAdminTool: React.FC = () => {
  const [scanType, setScanType] = useState<'permissions' | 'users' | 'services' | 'full'>('permissions');
  const [target, setTarget] = useState<string>('localhost');
  const [fixVulnerabilities, setFixVulnerabilities] = useState<boolean>(false);
  const [reportFormat, setReportFormat] = useState<'json' | 'html' | 'text'>('json');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [results, setResults] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setResults(null);
      
      const params = {
        tool: 'security-admin',
        command: `scan_${scanType}`,
        scanType: scanType as 'full' | 'users' | 'permissions' | 'services',
        target,
        fixVulnerabilities,
        reportFormat: 'json' as 'html' | 'text' | 'json'
      };
      
      const result = await executeSecurityAdmin(params);
      
      if (result.success) {
        toast({
          title: "Security Scan Complete",
          description: `${result.data.vulnerabilitiesFound} vulnerabilities detected`,
        });
        setResults(JSON.stringify(result.data, null, 2));
        
        if (fixVulnerabilities && result.data.mitigationsApplied > 0) {
          toast({
            title: "Vulnerabilities Mitigated",
            description: `${result.data.mitigationsApplied} issues have been automatically fixed`,
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "An error occurred during security scan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during security scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5" />
          Security Admin
        </CardTitle>
        <CardDescription>
          Advanced security assessment and hardening tool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scanType">Scan Type</Label>
            <Select 
              value={scanType} 
              onValueChange={(value: 'permissions' | 'users' | 'services' | 'full') => setScanType(value)}
            >
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                <SelectItem value="permissions">Permissions Audit</SelectItem>
                <SelectItem value="users">User Accounts Audit</SelectItem>
                <SelectItem value="services">Services Audit</SelectItem>
                <SelectItem value="full">Full System Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target">Target System</Label>
            <Input
              id="target"
              placeholder="localhost or IP address"
              className="bg-scanner-dark border-gray-700"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fixVulnerabilities" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Auto-fix Vulnerabilities
              </Label>
              <Switch 
                id="fixVulnerabilities" 
                checked={fixVulnerabilities}
                onCheckedChange={setFixVulnerabilities}
              />
            </div>
            <p className="text-xs text-gray-400">
              Automatically apply security fixes for discovered vulnerabilities
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reportFormat">Report Format</Label>
            <Select 
              value={reportFormat} 
              onValueChange={(value: 'json' | 'html' | 'text') => setReportFormat(value)}
            >
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select report format" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                <SelectItem value="json" className="flex items-center">
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </SelectItem>
                <SelectItem value="html" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  HTML
                </SelectItem>
                <SelectItem value="text" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-scanner-success hover:bg-scanner-success/90"
          >
            {isScanning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4 mr-2" />
            )}
            {isScanning ? 'Scanning...' : 'Run Security Scan'}
          </Button>
        </div>
        
        {results && (
          <div className="mt-4">
            <Label>Security Assessment Results</Label>
            <div className="bg-black rounded p-2 mt-1 overflow-auto max-h-80 text-xs font-mono">
              <pre>{results}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAdminTool;

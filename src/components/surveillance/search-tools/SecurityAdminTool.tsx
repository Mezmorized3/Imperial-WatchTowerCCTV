import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Check, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SecurityAdminParams } from '@/utils/types/osintToolTypes';
import { executeSecurityAdmin } from '@/utils/osintUtilsConnector';

interface SecurityAdminToolProps {
  onResult?: (result: any) => void;
}

const SecurityAdminTool: React.FC<SecurityAdminToolProps> = ({ onResult }) => {
  const [target, setTarget] = useState('');
  const [action, setAction] = useState<'check' | 'patch' | 'report'>('check');
  const [scope, setScope] = useState<'system' | 'network' | 'application'>('system');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleExecute = async () => {
    if (!target) {
      toast({
        title: "Validation Error",
        description: "Please enter a target system",
        variant: "destructive"
      });
      return;
    }
    
    setIsExecuting(true);
    
    try {
      const params: SecurityAdminParams = {
        tool: 'securityAdmin',
        target,
        action,
        scope,
        operation: 'scan',
        timeout: 30000
      };
      
      const result = await executeSecurityAdmin(params);
      setResults(result);
      
      if (onResult) {
        onResult(result);
      }
      
      toast({
        title: "Operation Complete",
        description: `Security ${action} completed for ${target}`
      });
    } catch (error) {
      console.error('Error executing security admin tool:', error);
      
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 text-green-400 mr-2" />
          Security Administration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target System</Label>
          <Input
            id="target"
            placeholder="IP address, hostname, or URL"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select
              value={action}
              onValueChange={(value: 'check' | 'patch' | 'report') => setAction(value)}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="check">Security Check</SelectItem>
                <SelectItem value="patch">Apply Patches</SelectItem>
                <SelectItem value="report">Generate Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scope">Scope</Label>
            <Select
              value={scope}
              onValueChange={(value: 'system' | 'network' | 'application') => setScope(value)}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="application">Application</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={handleExecute}
          disabled={isExecuting || !target}
          className="w-full"
        >
          {isExecuting ? "Executing..." : `Execute ${action}`}
        </Button>
        
        {results && (
          <div className="mt-4 p-4 bg-scanner-dark-alt border border-gray-700 rounded">
            <h3 className="text-sm font-semibold mb-3">Results:</h3>
            
            {results.findings && results.findings.length > 0 ? (
              <div className="space-y-3">
                {results.findings.map((finding: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 border rounded ${
                      finding.severity === 'high'
                        ? 'border-red-500 bg-red-500/10'
                        : finding.severity === 'medium'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-blue-500 bg-blue-500/10'
                    }`}
                  >
                    <div className="flex items-start">
                      {finding.severity === 'high' ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Check className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{finding.description}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Recommendation: {finding.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No issues found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAdminTool;


import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { executeCamerattack } from '@/utils/osintUtilsConnector';

const CamerattackTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('80');
  const [method, setMethod] = useState('GET');
  const [isAttacking, setIsAttacking] = useState(false);

  const executeAttack = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a target IP address or hostname",
        variant: "destructive"
      });
      return;
    }

    setIsAttacking(true);

    try {
      const result = await executeCamerattack({
        tool: 'camerattack',
        target,
        port: parseInt(port),
        method,
        timeout: 30
      });

      toast({
        title: "Attack Initiated",
        description: `Camerattack initiated on ${target}:${port} using ${method} method`,
      });
      console.log("Camerattack Results:", result);
    } catch (error) {
      console.error("Camerattack error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate camerattack",
        variant: "destructive"
      });
    } finally {
      setIsAttacking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Input
            placeholder="Target IP or Hostname"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div className="md:col-span-1">
          <Input
            placeholder="Port (default 80)"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div className="md:col-span-1">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="bg-scanner-dark">
              <SelectValue placeholder="Select Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="HEAD">HEAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            onClick={executeAttack}
            disabled={isAttacking || !target}
            className="w-full"
          >
            {isAttacking ? (
              <>Attacking...</> 
            ) : (
              <>
                Execute Camerattack
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="text-center py-8 text-gray-400">
            Camerattack is a tool to test the security of IP cameras.
            Enter the target IP, port, and select the HTTP method to use.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CamerattackTool;

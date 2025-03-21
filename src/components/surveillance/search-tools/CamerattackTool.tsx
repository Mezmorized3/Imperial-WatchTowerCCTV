import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { executeCamerattack } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';

export const CamerattackTool: React.FC = () => {
  const [targetIP, setTargetIP] = useState('');
  const [attackType, setAttackType] = useState('rtsp_fuzzing');
  const [duration, setDuration] = useState('60');
  const [rate, setRate] = useState('100');
  const [isAttacking, setIsAttacking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAttack = async () => {
    if (!targetIP) {
      toast({
        title: "Target IP Required",
        description: "Please enter a target IP address",
        variant: "destructive"
      });
      return;
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a valid duration in seconds",
        variant: "destructive"
      });
      return;
    }

    if (!rate || isNaN(Number(rate)) || Number(rate) <= 0) {
      toast({
        title: "Invalid Rate",
        description: "Please enter a valid rate",
        variant: "destructive"
      });
      return;
    }
    
    setIsAttacking(true);
    toast({
      title: "Camerattack Initiated",
      description: `Attacking ${targetIP} with ${attackType}...`,
    });
    
    try {
      const formattedIP = targetIP.trim();
      const scanResults = await executeCamerattack({
        target: formattedIP,
        method: attackType,  // Change 'mode' to 'method' to match the CamerattackParams type
        duration: parseInt(duration),
        rate: parseInt(rate)
      });
      
      setResults(scanResults);
      toast({
        title: "Attack Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "Camerattack completed successfully",
      });
    } catch (error) {
      console.error('Camerattack error:', error);
      toast({
        title: "Attack Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAttacking(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter Target IP Address"
            value={targetIP}
            onChange={(e) => setTargetIP(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button
            onClick={handleAttack}
            disabled={isAttacking || !targetIP}
            className="w-full"
          >
            {isAttacking ? (
              <>Attacking...</>
            ) : (
              <>
                Attack Camera
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Attack Type</label>
              <select
                value={attackType}
                onChange={(e) => setAttackType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 bg-scanner-dark border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="rtsp_fuzzing">RTSP Fuzzing</option>
                <option value="credential_bruteforce">Credential Bruteforce</option>
                <option value="command_injection">Command Injection</option>
                <option value="denial_of_service">Denial of Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Duration (seconds)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full bg-scanner-dark border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Rate</label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="mt-1 block w-full bg-scanner-dark border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            {results.success ? (
              <div>
                <h3 className="text-lg font-medium text-green-500">Attack Successful</h3>
                <p className="text-sm text-gray-400">
                  Target: {results.target}, Method: {results.method}, Duration: {results.duration}s
                </p>
                {results.findings && results.findings.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-300 mt-2">Findings:</h4>
                    <ul>
                      {results.findings.map((finding: any, index: number) => (
                        <li key={index} className="text-sm text-gray-400">
                          {finding.type}: {finding.details || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-red-500">Attack Failed</h3>
                <p className="text-sm text-gray-400">
                  Target: {results.target}, Method: {results.method}, Duration: {results.duration}s
                </p>
                {results.error && (
                  <p className="text-sm text-red-400">Error: {results.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

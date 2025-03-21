
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Radar, ShieldAlert, Key, Network, Lock, Unlock, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { executeImperialPawn } from '@/utils/pythonIntegration';

interface BruteForceResult {
  ip: string;
  username: string;
  password: string;
  timestamp: string;
}

const ImperialPawn: React.FC = () => {
  const [targetInput, setTargetInput] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('admin,root,Admin,user');
  const [passwordInput, setPasswordInput] = useState<string>('admin,12345,password,123456,root');
  const [threads, setThreads] = useState<number>(50);
  const [timeout, setTimeout] = useState<number>(10);
  const [generateLoginCombos, setGenerateLoginCombos] = useState<boolean>(true);
  const [skipCameraCheck, setSkipCameraCheck] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<BruteForceResult[]>([]);

  const handleExecute = async () => {
    if (!targetInput.trim()) {
      toast.error("Please enter at least one target IP or range");
      return;
    }

    // Parse inputs
    const targets = targetInput.split(',').map(t => t.trim()).filter(Boolean);
    const usernames = usernameInput.split(',').map(u => u.trim()).filter(Boolean);
    const passwords = passwordInput.split(',').map(p => p.trim()).filter(Boolean);

    if (usernames.length === 0 || passwords.length === 0) {
      toast.error("Please provide at least one username and password");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResults([]);

    // Create a progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 800);

    try {
      toast.info(`Imperial Pawn deployed. Scanning ${targets.length} target(s)...`);

      const response = await executeImperialPawn({
        targets,
        usernames,
        passwords,
        generateLoginCombos,
        threads,
        timeout,
        skipCameraCheck
      });

      clearInterval(progressInterval);

      if (response.success) {
        setProgress(100);
        
        // Process the results
        const processedResults: BruteForceResult[] = response.data.results?.map((result: any) => ({
          ip: result.ip,
          username: result.username,
          password: result.password,
          timestamp: new Date().toISOString()
        })) || [];
        
        setResults(processedResults);
        
        if (processedResults.length > 0) {
          toast.success(`Operation complete! Found ${processedResults.length} vulnerable cameras.`);
        } else {
          toast.info("Operation complete. No vulnerable cameras found.");
        }
      } else {
        toast.error(`Operation failed: ${response.error || 'Unknown error'}`);
        setProgress(100);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Imperial Pawn execution error:", error);
      toast.error("Failed to execute Imperial Pawn operation");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
            Imperial Pawn: CCTV Bruteforce
          </CardTitle>
          <CardDescription>
            Advanced reconnaissance tool specialized for Hikvision camera vulnerabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Target IPs (comma-separated)</label>
              <Textarea
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="192.168.1.1,192.168.1.0/24,10.0.0.1-10.0.0.10"
                className="bg-scanner-dark border-gray-700 text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Usernames (comma-separated)</label>
                <Textarea
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin,root,Admin,user"
                  className="bg-scanner-dark border-gray-700 text-white h-24"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Passwords (comma-separated)</label>
                <Textarea
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="admin,12345,password,123456"
                  className="bg-scanner-dark border-gray-700 text-white h-24"
                />
              </div>
            </div>
            
            <Separator className="border-gray-700" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Threads</label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={threads}
                  onChange={(e) => setThreads(Number(e.target.value))}
                  className="bg-scanner-dark border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Timeout (seconds)</label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={timeout}
                  onChange={(e) => setTimeout(Number(e.target.value))}
                  className="bg-scanner-dark border-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col justify-end space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="genLoginCombos" 
                    checked={generateLoginCombos}
                    onCheckedChange={(checked) => setGenerateLoginCombos(!!checked)}
                  />
                  <label htmlFor="genLoginCombos" className="text-sm text-gray-300">
                    Generate login:login combos
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="skipCameraCheck" 
                    checked={skipCameraCheck}
                    onCheckedChange={(checked) => setSkipCameraCheck(!!checked)}
                  />
                  <label htmlFor="skipCameraCheck" className="text-sm text-gray-300">
                    Skip camera detection
                  </label>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleExecute}
              disabled={isLoading || !targetInput.trim()}
              className="w-full"
              variant="destructive"
            >
              <Radar className="mr-2 h-4 w-4" />
              {isLoading ? "Operation in Progress..." : "Execute Imperial Pawn"}
            </Button>
            
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Operation in progress...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Results Display */}
      {results.length > 0 && (
        <Card className="bg-scanner-dark border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Lock className="mr-2 h-5 w-5 text-green-500" />
              Imperial Pawn Results ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-scanner-dark-alt border border-gray-700 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-green-400 flex items-center">
                      <Unlock className="mr-2 h-4 w-4" />
                      {result.ip}
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-green-900 text-green-400 rounded-full">
                      Compromised
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-gray-400">Username:</span> {result.username}
                    </div>
                    <div>
                      <span className="text-gray-400">Password:</span> {result.password}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                    <Button size="sm" variant="outline" className="text-xs">
                      <FileCheck className="mr-1 h-3 w-3" />
                      Add to Loot
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImperialPawn;


import React, { useState } from 'react';
import { Shield, Lock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { imperialShieldProtocol } from '@/utils/imperial/imperialShieldProtocol';
import { toast } from 'sonner';

const ImperialShieldMatrix: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shieldStatus, setShieldStatus] = useState<Record<string, string>>({});

  const analyzeShieldProtocol = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setShieldStatus({});
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Use request method instead of simulateRequest
      const result = await imperialShieldProtocol.request({
        targetUrl: 'shield-status',
        method: 'GET'
      });
      
      if (result) {
        setShieldStatus({
          'Authentication Layer': 'ACTIVE',
          'Encryption Protocol': 'ACTIVE',
          'Firewall Status': 'ACTIVE',
          'Intrusion Detection': 'ACTIVE',
          'Anomaly Detection': 'ACTIVE'
        });
        toast.success('Shield Protocol Analysis Complete');
      }
    } catch (error) {
      console.error('Shield protocol analysis error:', error);
      toast.error('Shield Protocol Analysis Failed');
      
      // For development, provide simulated results
      setShieldStatus({
        'Authentication Layer': 'ACTIVE',
        'Encryption Protocol': 'ACTIVE',
        'Firewall Status': 'WARNING',
        'Intrusion Detection': 'ACTIVE',
        'Anomaly Detection': 'ACTIVE'
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border-gray-700">
        <CardHeader>
          <CardTitle className="text-md flex items-center">
            <Shield className="mr-2 text-red-500" /> Imperial Shield Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">
            Advanced security protocol management for Imperial infrastructure.
          </p>
          
          {isAnalyzing ? (
            <div className="space-y-2">
              <p className="text-sm">Analyzing shield protocols...</p>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <Button 
              onClick={analyzeShieldProtocol}
              className="w-full bg-scanner-primary hover:bg-scanner-primary/80"
            >
              <Lock className="h-4 w-4 mr-2" />
              Analyze Shield Protocols
            </Button>
          )}
          
          {Object.keys(shieldStatus).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Shield Status:</h4>
              <ul className="space-y-1">
                {Object.entries(shieldStatus).map(([key, value]) => (
                  <li key={key} className="flex justify-between text-sm">
                    <span>{key}</span>
                    <span className={
                      value === 'ACTIVE' ? 'text-green-400' : 
                      value === 'WARNING' ? 'text-yellow-400' : 
                      'text-red-400'
                    }>
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialShieldMatrix;

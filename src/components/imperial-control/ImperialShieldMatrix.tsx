
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, Network, Activity, Lock, RefreshCw } from 'lucide-react';
import { imperialShieldProtocol } from '@/utils/imperial/imperialShieldProtocol';
import { toast } from 'sonner';

const ImperialShieldMatrix: React.FC = () => {
  const [shieldStatus, setShieldStatus] = useState<'active' | 'inactive' | 'breached'>('inactive');
  const [integrity, setIntegrity] = useState(0);
  const [activeProtections, setActiveProtections] = useState(0);
  const [lastSecurityEvent, setLastSecurityEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Shield systems
  const [systems, setSystems] = useState([
    { id: 'quantum-shield', name: 'Quantum Shield', status: 'inactive', integrity: 0 },
    { id: 'neural-firewall', name: 'Neural Firewall', status: 'inactive', integrity: 0 },
    { id: 'void-cloak', name: 'Void Cloak', status: 'inactive', integrity: 0 },
    { id: 'temporal-barrier', name: 'Temporal Barrier', status: 'inactive', integrity: 0 }
  ]);
  
  useEffect(() => {
    checkShieldStatus();
    
    // Poll for shield status every 30 seconds
    const interval = setInterval(checkShieldStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const checkShieldStatus = async () => {
    try {
      // Use the imperialShieldProtocol to simulate a request
      const result = await imperialShieldProtocol.simulateRequest({
        targetUrl: 'imperial.shield/status',
        protocol: 'https'
      });
      
      if (result.success) {
        // Update shield status based on the response
        setShieldStatus(result.shieldStatus || 'inactive');
        
        // Calculate integrity from the security rating
        const newIntegrity = result.securityRating || 0;
        setIntegrity(newIntegrity);
        
        // Update systems
        updateSystems(newIntegrity);
        
        // Set last security event
        if (newIntegrity < 50) {
          setLastSecurityEvent(`Security breach detected at ${new Date().toLocaleTimeString()}`);
        } else {
          setLastSecurityEvent(`Shield scan completed at ${new Date().toLocaleTimeString()}`);
        }
      } else {
        // Handle failure
        setShieldStatus('breached');
        setIntegrity(0);
        setLastSecurityEvent(`Shield failure at ${new Date().toLocaleTimeString()}`);
      }
    } catch (error) {
      console.error('Error checking shield status:', error);
      setShieldStatus('breached');
      setIntegrity(0);
      setLastSecurityEvent(`Shield communication error at ${new Date().toLocaleTimeString()}`);
    }
  };
  
  const updateSystems = (overallIntegrity: number) => {
    // Update individual systems with randomized but coherent statuses
    const newSystems = systems.map(system => {
      // Generate a random integrity value that's within 20% of the overall integrity
      const integrityVariance = Math.floor(Math.random() * 40) - 20;
      const newIntegrity = Math.max(0, Math.min(100, overallIntegrity + integrityVariance));
      
      // Determine status based on integrity
      let status: 'active' | 'inactive' | 'breached' = 'inactive';
      if (newIntegrity > 70) status = 'active';
      else if (newIntegrity < 30) status = 'breached';
      else status = Math.random() > 0.5 ? 'active' : 'inactive';
      
      return {
        ...system,
        status,
        integrity: newIntegrity
      };
    });
    
    setSystems(newSystems);
    
    // Count active protections
    const active = newSystems.filter(s => s.status === 'active').length;
    setActiveProtections(active);
  };
  
  const activateShield = async () => {
    setIsLoading(true);
    toast.info('Activating Imperial Shield...');
    
    // Simulate activation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update status
    setShieldStatus('active');
    setIntegrity(85 + Math.floor(Math.random() * 15));
    setLastSecurityEvent(`Shield activated at ${new Date().toLocaleTimeString()}`);
    
    // Update systems
    updateSystems(90);
    setIsLoading(false);
    
    toast.success('Imperial Shield activated successfully');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-yellow-500';
      case 'breached': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  const getProgressColor = (value: number) => {
    if (value > 75) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl">
            <Shield className="mr-2 h-5 w-5 text-blue-400" />
            Imperial Shield Matrix
          </CardTitle>
          <CardDescription>
            Quantum shielding technology for Imperial operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${
                shieldStatus === 'active' ? 'bg-green-500 animate-pulse' : 
                shieldStatus === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium capitalize">{shieldStatus} - {activeProtections}/4 systems online</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={checkShieldStatus}
              disabled={isLoading}
              className="h-8 px-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Shield Integrity</span>
              <span>{integrity}%</span>
            </div>
            <Progress 
              value={integrity} 
              className={`h-2 ${getProgressColor(integrity)}`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {systems.map(system => (
              <div key={system.id} className="bg-scanner-dark p-3 rounded-md border border-gray-700">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{system.name}</span>
                  <span className={`text-xs ${getStatusColor(system.status)}`}>
                    {system.status.toUpperCase()}
                  </span>
                </div>
                <Progress 
                  value={system.integrity} 
                  className={`h-1.5 ${getProgressColor(system.integrity)}`}
                />
              </div>
            ))}
          </div>
          
          {shieldStatus !== 'active' && (
            <Button 
              onClick={activateShield} 
              className="w-full"
              disabled={isLoading}
            >
              <Shield className="mr-2 h-4 w-4" />
              {isLoading ? 'Activating Shield...' : 'Activate Imperial Shield'}
            </Button>
          )}
          
          {lastSecurityEvent && (
            <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
              <div className="flex items-center">
                <Activity className="h-3 w-3 mr-1" />
                Last event: {lastSecurityEvent}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialShieldMatrix;


import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Lock, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ImperialShieldMatrix = () => {
  const [securityScore, setSecurityScore] = useState(0);
  const [threatLevel, setThreatLevel] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading security data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSecurityScore(Math.floor(Math.random() * 30) + 65); // 65-95
      setThreatLevel(Math.floor(Math.random() * 15) + 5); // 5-20
      setVulnerabilities(Math.floor(Math.random() * 5) + 1); // 1-5
      setLastUpdate(new Date().toLocaleString());
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    
    toast({
      title: "Refreshing Security Matrix",
      description: "Scanning surveillance network for threats...",
    });
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update values
    setSecurityScore(Math.floor(Math.random() * 30) + 65);
    setThreatLevel(Math.floor(Math.random() * 15) + 5);
    setVulnerabilities(Math.floor(Math.random() * 5) + 1);
    setLastUpdate(new Date().toLocaleString());
    setIsLoading(false);
    
    toast({
      title: "Security Matrix Updated",
      description: "Security assessment complete",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="mr-2 text-red-500" />
            Imperial Shield Matrix
          </h2>
          <p className="text-gray-400">
            Real-time security status of your surveillance systems
          </p>
        </div>
        
        <Button 
          onClick={refreshData} 
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? "Updating..." : "Refresh Status"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Security Score</h3>
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Security</span>
              <span className={`${
                securityScore > 80 ? 'text-green-500' :
                securityScore > 60 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {securityScore}%
              </span>
            </div>
            
            <Progress 
              value={securityScore} 
              className="h-2"
              indicatorClassName={`${
                securityScore > 80 ? 'bg-green-500' :
                securityScore > 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} 
            />
            
            <p className="text-xs text-gray-400 mt-2">
              {securityScore > 80 ? 'Good security posture with minimal issues' :
               securityScore > 60 ? 'Moderate security with some vulnerabilities' :
               'Poor security posture - immediate action recommended'}
            </p>
          </div>
        </div>
        
        <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Threat Level</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Threats</span>
              <span className={`${
                threatLevel < 10 ? 'text-green-500' :
                threatLevel < 20 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {threatLevel}%
              </span>
            </div>
            
            <Progress 
              value={threatLevel} 
              className="h-2"
              indicatorClassName={`${
                threatLevel < 10 ? 'bg-green-500' :
                threatLevel < 20 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} 
            />
            
            <p className="text-xs text-gray-400 mt-2">
              {threatLevel < 10 ? 'Minimal active threats detected' :
               threatLevel < 20 ? 'Moderate threat activity detected' :
               'High threat activity - action required'}
            </p>
          </div>
        </div>
        
        <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Vulnerabilities</h3>
            <Lock className="h-5 w-5 text-red-500" />
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold">{vulnerabilities}</span>
              <span className="text-sm ml-1">detected</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${vulnerabilities > 0 ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                <span>Critical</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${vulnerabilities > 1 ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                <span>High</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${vulnerabilities > 2 ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                <span>Medium</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${vulnerabilities > 3 ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
          <h3 className="text-lg font-medium mb-4">Security Alerts</h3>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {/* Alert items */}
            <div className="flex items-start space-x-3 p-2 border-b border-gray-700">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Default Credentials Detected</p>
                <p className="text-xs text-gray-400">Multiple cameras using default credentials</p>
                <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-2 border-b border-gray-700">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Firmware Updates Available</p>
                <p className="text-xs text-gray-400">3 cameras have outdated firmware</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-2">
              <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Network Scan Detected</p>
                <p className="text-xs text-gray-400">External port scanning attempt</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
          <h3 className="text-lg font-medium mb-4">System Status</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Firewall</span>
              </div>
              <span className="text-xs text-green-500">Active</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Intrusion Detection</span>
              </div>
              <span className="text-xs text-green-500">Active</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>VPN</span>
              </div>
              <span className="text-xs text-green-500">Active</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Threat Intelligence Feed</span>
              </div>
              <span className="text-xs text-yellow-500">Updating</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Server className="h-4 w-4 text-blue-500 mr-2" />
                <span>Security Database</span>
              </div>
              <span className="text-xs text-blue-500">Synced</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-4">
            Last system scan: {lastUpdate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImperialShieldMatrix;

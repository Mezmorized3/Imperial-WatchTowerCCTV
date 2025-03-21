
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Server, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ServerStatus {
  [port: string]: {
    status: string;
    lastActivation: string | null;
    operationalCapacity: string;
    role: string;
  };
}

const ServerStatus: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState('');

  useEffect(() => {
    // On component mount, try to load token from localStorage
    const savedToken = localStorage.getItem('imperialToken');
    if (savedToken) {
      setAdminToken(savedToken);
      fetchServerStatus(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchServerStatus = async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/v1/admin/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch server status: ${response.status}`);
      }
      
      const data = await response.json();
      setServerStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = () => {
    if (adminToken) {
      localStorage.setItem('imperialToken', adminToken);
      fetchServerStatus(adminToken);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return <Badge className="bg-green-500">Active</Badge>;
    } else {
      return <Badge variant="secondary">Dormant</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Server Status
          </CardTitle>
          <CardDescription>Loading Imperial Server status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <Activity className="h-8 w-8 animate-pulse text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Server Status
          </CardTitle>
          <CardDescription>Imperial Server status report</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <p className="mb-2">Authentication Required:</p>
            <div className="flex space-x-2">
              <input 
                type="password" 
                placeholder="Admin Token" 
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <Button onClick={handleAuthenticate}>Authenticate</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!serverStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Server Status
          </CardTitle>
          <CardDescription>Imperial Server status report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <p className="mb-2">Authentication Required:</p>
            <div className="flex space-x-2">
              <input 
                type="password" 
                placeholder="Admin Token" 
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <Button onClick={handleAuthenticate}>Authenticate</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2 h-5 w-5" />
          Imperial Server Status
        </CardTitle>
        <CardDescription>Current status of all imperial services</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Port</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(serverStatus).map(([port, data]) => (
              <TableRow key={port}>
                <TableCell>{port}</TableCell>
                <TableCell>{data.role}</TableCell>
                <TableCell>{getStatusBadge(data.status)}</TableCell>
                <TableCell>
                  {data.lastActivation 
                    ? new Date(data.lastActivation).toLocaleString() 
                    : 'Never'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 flex justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => fetchServerStatus(adminToken)}
          >
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerStatus;

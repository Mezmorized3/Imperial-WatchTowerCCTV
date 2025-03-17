import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle, 
  Camera, 
  Check, 
  Database,
  Download, 
  ExternalLink, 
  Eye, 
  Filter, 
  Globe,
  Lock, 
  MapPin, 
  MoreHorizontal, 
  Play,
  Search, 
  Shield, 
  Video,
  X,
  Info
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { openRtspStream } from '@/utils/mockData';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface ResultsTableProps {
  results: CameraResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<CameraResult | null>(null);
  
  const filteredResults = searchTerm
    ? results.filter(camera => 
        camera.ip.includes(searchTerm) || 
        camera.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.location?.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : results;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-scanner-info">Online</Badge>;
      case 'vulnerable':
        return <Badge className="bg-scanner-danger">Vulnerable</Badge>;
      case 'authenticated':
        return <Badge className="bg-scanner-success">Authenticated</Badge>;
      case 'offline':
        return <Badge className="bg-gray-700">Offline</Badge>;
      default:
        return <Badge className="bg-gray-700">Unknown</Badge>;
    }
  };
  
  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'admin':
        return <Shield className="h-4 w-4 text-scanner-success" aria-label="Admin Access" />;
      case 'control':
        return <Lock className="h-4 w-4 text-scanner-primary" aria-label="Control Access" />;
      case 'view':
        return <Eye className="h-4 w-4 text-scanner-info" aria-label="View Only" />;
      default:
        return <X className="h-4 w-4 text-gray-500" aria-label="No Access" />;
    }
  };

  const handleOpenStream = (camera: CameraResult, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (camera.status === 'offline') {
      toast({
        title: "Camera Offline",
        description: "Cannot open stream for offline camera",
        variant: "destructive"
      });
      return;
    }
    
    const streamUrl = camera.url || `rtsp://${camera.ip}/Streaming/Channels/1`;
    
    navigate(`/viewer?url=${encodeURIComponent(streamUrl)}&name=${encodeURIComponent(camera.brand || 'Unknown Camera')}&ip=${encodeURIComponent(camera.ip)}`);
    
    toast({
      title: "Opening Stream",
      description: `Opening stream for ${camera.ip}${camera.port !== 80 ? `:${camera.port}` : ''}`,
    });
  };

  const handleOpenOsintView = (camera: CameraResult, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    const streamUrl = camera.url || `rtsp://${camera.ip}/Streaming/Channels/1`;
    navigate(`/viewer?url=${encodeURIComponent(streamUrl)}&name=${encodeURIComponent(camera.brand || 'Unknown Camera')}&ip=${encodeURIComponent(camera.ip)}#osint`);
    
    toast({
      title: "Loading OSINT Data",
      description: `Gathering intelligence for ${camera.ip}`,
    });
  };

  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
          <CardTitle className="text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-scanner-primary" />
            <span>Discovered Cameras</span>
            {results.length > 0 && (
              <Badge className="ml-2 bg-scanner-primary">{results.length}</Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search results..."
                className="pl-8 w-64 bg-gray-800 border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem>All Cameras</DropdownMenuItem>
                <DropdownMenuItem>Vulnerable Only</DropdownMenuItem>
                <DropdownMenuItem>Authenticated Only</DropdownMenuItem>
                <DropdownMenuItem>By Region</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {results.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No cameras discovered yet</p>
            <p className="text-sm">Start a scan to discover CCTV cameras</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">IP Address</TableHead>
                  <TableHead className="text-gray-400">Brand / Model</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Access</TableHead>
                  <TableHead className="text-gray-400 w-12">OSINT</TableHead>
                  <TableHead className="text-gray-400 w-12">Stream</TableHead>
                  <TableHead className="text-gray-400 w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((camera) => (
                  <TableRow 
                    key={camera.id} 
                    className="border-gray-800 hover:bg-scanner-card-hover cursor-pointer"
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <TableCell>{getStatusBadge(camera.status)}</TableCell>
                    <TableCell className="font-mono">
                      {camera.ip}
                      {camera.port !== 80 && `:${camera.port}`}
                    </TableCell>
                    <TableCell>
                      {camera.brand ? (
                        <div>
                          <span className="font-medium">{camera.brand}</span>
                          {camera.model && <span className="text-gray-500 text-xs block">{camera.model}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {camera.location ? (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span>{camera.location.country}</span>
                          {camera.location.city && (
                            <span className="text-gray-500 text-xs">, {camera.location.city}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getAccessLevelIcon(camera.accessLevel)}
                        {camera.credentials && (
                          <span className="text-xs bg-scanner-success/20 text-scanner-success px-1.5 py-0.5 rounded">
                            {camera.credentials.username}:{camera.credentials.password}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => handleOpenOsintView(camera, e)}
                      >
                        <Globe className="h-4 w-4 text-scanner-info" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${camera.status === 'offline' ? 'opacity-50' : ''}`}
                        onClick={(e) => handleOpenStream(camera, e)}
                        disabled={camera.status === 'offline'}
                      >
                        <Play className="h-4 w-4 text-scanner-primary" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStream(camera);
                          }}>
                            Open Stream
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleOpenOsintView(camera);
                          }}>
                            View OSINT Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Take Snapshot</DropdownMenuItem>
                          <DropdownMenuItem>Copy URL</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      <Dialog open={!!selectedCamera} onOpenChange={(open) => !open && setSelectedCamera(null)}>
        <DialogContent className="bg-scanner-dark border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Camera className="h-5 w-5 text-scanner-primary" />
              Camera Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedCamera && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      {getStatusBadge(selectedCamera.status)}
                      <span>{selectedCamera.ip}{selectedCamera.port !== 80 && `:${selectedCamera.port}`}</span>
                    </h3>
                    {selectedCamera.url && (
                      <a 
                        href="#" 
                        className="text-scanner-primary flex items-center gap-1 mt-1 text-sm hover:underline"
                      >
                        {selectedCamera.url}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Brand</p>
                      <p className="font-medium">{selectedCamera.brand || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Model</p>
                      <p className="font-medium">{selectedCamera.model || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Location</p>
                      <p className="font-medium">
                        {selectedCamera.location ? 
                          `${selectedCamera.location.country}${selectedCamera.location.city ? `, ${selectedCamera.location.city}` : ''}` : 
                          'Unknown'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Last Seen</p>
                      <p className="font-medium">
                        {new Date(selectedCamera.lastSeen).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedCamera.credentials && (
                    <div>
                      <p className="text-gray-500 text-sm">Credentials</p>
                      <div className="bg-scanner-dark p-2 border border-gray-800 rounded mt-1 font-mono">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-scanner-success">Authentication Successful</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Username</p>
                            <p>{selectedCamera.credentials.username}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Password</p>
                            <p>{selectedCamera.credentials.password || '<empty>'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedCamera.vulnerabilities && selectedCamera.vulnerabilities.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Vulnerabilities</p>
                      {selectedCamera.vulnerabilities.map((vuln, idx) => (
                        <div key={idx} className="bg-scanner-danger/10 border border-scanner-danger/20 rounded p-2 mb-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-scanner-danger" />
                            <span className="font-medium">{vuln.name}</span>
                            <Badge className={
                              vuln.severity === 'critical' ? 'bg-scanner-danger' :
                              vuln.severity === 'high' ? 'bg-red-500' :
                              vuln.severity === 'medium' ? 'bg-scanner-warning' : 'bg-blue-500'
                            }>
                              {vuln.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1 text-gray-300">{vuln.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black aspect-video rounded flex items-center justify-center">
                    {selectedCamera.status !== 'offline' ? (
                      <div className="text-center">
                        <p className="text-gray-500">Camera stream preview</p>
                        <div className="mt-2 flex justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs" 
                            onClick={() => handleOpenStream(selectedCamera)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Play Stream
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-600">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Camera offline - No preview available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-500 text-sm">Access URLs</p>
                    <div className="space-y-1.5">
                      {selectedCamera.snapshotUrl && (
                        <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5 rounded text-sm">
                          <div className="font-mono text-gray-300 truncate">
                            {selectedCamera.url}{selectedCamera.snapshotUrl}
                          </div>
                          <Badge variant="outline" className="ml-2 shrink-0">Snapshot</Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5 rounded text-sm">
                        <div className="font-mono text-gray-300 truncate">
                          rtsp://{selectedCamera.ip}/Streaming/Channels/1
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 ml-2 shrink-0"
                          onClick={() => handleOpenStream(selectedCamera)}
                          disabled={selectedCamera.status === 'offline'}
                        >
                          <Play className="h-3 w-3 text-scanner-primary" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        className="bg-scanner-primary hover:bg-blue-600"
                        onClick={() => handleOpenStream(selectedCamera)}
                        disabled={selectedCamera.status === 'offline'}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Open Live Stream
                      </Button>
                      
                      <Button 
                        className="bg-scanner-info hover:bg-teal-600"
                        onClick={() => handleOpenOsintView(selectedCamera)}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        OSINT Analysis
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="text-gray-300 border-gray-700">
                        <Download className="mr-2 h-4 w-4" />
                        Export Details
                      </Button>
                      <Button variant="outline" className="text-gray-300 border-gray-700">
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Verified
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResultsTable;

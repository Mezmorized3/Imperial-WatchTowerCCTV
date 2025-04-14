
import React, { useState } from 'react';
import { CameraResult } from '@/types/scanner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Globe, 
  Shield, 
  Code, 
  Camera, 
  AlertTriangle, 
  Check, 
  X, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { CameraDetailsDialog } from './CameraDetailsDialog';

interface ResultsTableProps {
  results: CameraResult[];
  onView?: (camera: CameraResult) => void;
  onExploit?: (camera: CameraResult) => void;
  onMonitor?: (camera: CameraResult, monitor: boolean) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  results, 
  onView, 
  onExploit, 
  onMonitor 
}) => {
  const [sortField, setSortField] = useState<keyof CameraResult>('ip');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCamera, setSelectedCamera] = useState<CameraResult | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSort = (field: keyof CameraResult) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Helper function to get location 
  const getCameraLocation = (camera: CameraResult) => {
    if (!camera.location) return null;
    
    // Handle location as object
    if (typeof camera.location === 'object') {
      return camera.location;
    }
    
    // If we reach here, we don't have valid location data
    return null;
  };
  
  const sortedResults = [...results].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    // Special case for location
    if (sortField === 'location') {
      const aLocation = getCameraLocation(a);
      const bLocation = getCameraLocation(b);
      aValue = aLocation?.country || 'Unknown';
      bValue = bLocation?.country || 'Unknown';
    }
    
    if (aValue === bValue) return 0;
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    }
    
    return (aValue > bValue ? 1 : -1) * direction;
  });

  const handleViewDetails = (camera: CameraResult) => {
    setSelectedCamera(camera);
    setDetailsOpen(true);
  };

  const statusColors: Record<string, string> = {
    'online': 'bg-scanner-info text-white',
    'offline': 'bg-gray-600 text-white',
    'vulnerable': 'bg-scanner-danger text-white',
    'authenticated': 'bg-scanner-success text-white',
    'secure': 'bg-green-600 text-white',
    'compromised': 'bg-red-600 text-white',
    'unknown': 'bg-gray-500 text-white',
  };

  if (results.length === 0) {
    return (
      <div className="bg-scanner-card border border-gray-800 rounded-md p-6 text-center">
        <Camera className="h-12 w-12 mx-auto mb-3 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-300">No cameras found</h3>
        <p className="text-gray-500 mt-2">
          Run a scan to find cameras and display them here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-scanner-card border border-gray-800 rounded-md shadow-md overflow-hidden">
      <Table>
        <TableHeader className="bg-scanner-dark">
          <TableRow>
            <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort('status')}>
              <div className="flex items-center">
                Status
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort('ip')}>
              <div className="flex items-center">
                IP
                {sortField === 'ip' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort('port')}>
              <div className="flex items-center">
                Port
                {sortField === 'port' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort('brand')}>
              <div className="flex items-center">
                Brand/Model
                {sortField === 'brand' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-gray-300 cursor-pointer" onClick={() => handleSort('location')}>
              <div className="flex items-center">
                Location
                {sortField === 'location' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-gray-300">
              <div className="flex items-center">
                Actions
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((camera) => {
            const location = getCameraLocation(camera);
            return (
              <TableRow key={camera.id} className="border-gray-800 hover:bg-scanner-dark-alt">
                <TableCell>
                  <Badge className={statusColors[camera.status] || 'bg-gray-500'}>
                    {camera.status.charAt(0).toUpperCase() + camera.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{camera.ip}</TableCell>
                <TableCell className="font-mono">{camera.port}</TableCell>
                <TableCell>
                  {camera.brand || camera.model ? (
                    <div>
                      <div>{camera.brand || 'Unknown Brand'}</div>
                      <div className="text-xs text-gray-500">{camera.model || ''}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </TableCell>
                <TableCell>
                  {location ? (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-scanner-info" />
                      <div>
                        <div>{location.country || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{location.city || (location.country ? 'Unknown city' : '')}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unknown location</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleViewDetails(camera)} 
                      variant="outline" 
                      size="sm" 
                      className="bg-scanner-dark-alt border-gray-700 hover:bg-scanner-dark"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onView && (
                      <Button 
                        onClick={() => onView(camera)} 
                        variant="outline" 
                        size="sm" 
                        className="bg-scanner-info/20 border-scanner-info text-scanner-info hover:bg-scanner-info/30"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                    {onExploit && camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                      <Button 
                        onClick={() => onExploit(camera)} 
                        variant="outline" 
                        size="sm" 
                        className="bg-scanner-danger/20 border-scanner-danger text-scanner-danger hover:bg-scanner-danger/30"
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    )}
                    {onMonitor && (
                      <Button 
                        onClick={() => onMonitor(camera, !camera.monitoringEnabled)} 
                        variant="outline" 
                        size="sm" 
                        className={camera.monitoringEnabled ? 
                          "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/30" : 
                          "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"}
                      >
                        {camera.monitoringEnabled ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {selectedCamera && (
        <CameraDetailsDialog 
          camera={selectedCamera} 
          open={detailsOpen} 
          onOpenChange={setDetailsOpen} 
        />
      )}
    </div>
  );
};

export default ResultsTable;


import React, { useState } from 'react';
import { CameraResult } from '@/types/scanner';
import { AnomalyDetectionResult, BehavioralPattern } from '@/types/ml-detection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Brain, Activity, RefreshCw, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnomalyDetectionProps {
  camera: CameraResult | null;
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ camera }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [anomalies, setAnomalies] = useState<AnomalyDetectionResult[]>([]);
  const [patterns, setPatterns] = useState<BehavioralPattern[]>([]);

  // Mock function to analyze camera for anomalies
  const analyzeCamera = () => {
    if (!camera) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Generate mock anomaly detection results
      const mockAnomalies: AnomalyDetectionResult[] = [];
      const anomalyCount = Math.floor(Math.random() * 3);
      
      for (let i = 0; i < anomalyCount; i++) {
        const types = ['configuration', 'behavior', 'network', 'access'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        let description = '';
        switch (type) {
          case 'configuration':
            description = 'Unusual configuration setting detected that differs from manufacturer defaults';
            break;
          case 'behavior':
            description = 'Abnormal traffic pattern detected outside of established baseline';
            break;
          case 'network':
            description = 'Unexpected outbound connection to potentially malicious IP address';
            break;
          case 'access':
            description = 'Multiple failed login attempts from unusual geographic location';
            break;
        }
        
        mockAnomalies.push({
          id: `anomaly-${Date.now()}-${i}`,
          cameraId: camera.id,
          timestamp: new Date().toISOString(),
          score: Math.floor(Math.random() * 60) + 40, // 40-100 score range for detected anomalies
          type,
          description,
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100 confidence range
          relatedEvents: [
            {
              eventType: 'observation',
              timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
              description: 'Initial observation of unusual pattern'
            },
            {
              eventType: 'threshold_breach',
              timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
              description: 'Anomaly threshold exceeded'
            }
          ]
        });
      }
      
      // Generate behavioral patterns
      const mockPatterns: BehavioralPattern[] = [];
      const patternCount = Math.floor(Math.random() * 3) + 2;
      
      const patternNames = [
        { name: 'Daily Traffic Pattern', type: 'traffic' as const },
        { name: 'Access Frequency', type: 'access' as const },
        { name: 'Device Uptime', type: 'uptime' as const },
        { name: 'Port Scanning Activity', type: 'scanning' as const },
        { name: 'Command Distribution', type: 'commands' as const }
      ];
      
      for (let i = 0; i < patternCount; i++) {
        const pattern = patternNames[i % patternNames.length];
        const isAnomaly = Math.random() > 0.7;
        const normalMin = Math.floor(Math.random() * 50);
        const normalMax = normalMin + Math.floor(Math.random() * 50) + 10;
        let currentValue = isAnomaly 
          ? Math.random() > 0.5 
            ? normalMax + Math.floor(Math.random() * 100)
            : Math.max(0, normalMin - Math.floor(Math.random() * normalMin))
          : normalMin + Math.floor(Math.random() * (normalMax - normalMin));
          
        let unit = '';
        switch (pattern.type) {
          case 'traffic':
            unit = 'KB/s';
            break;
          case 'access':
            unit = 'requests/hour';
            break;
          case 'uptime':
            unit = '%';
            currentValue = Math.min(currentValue, 100);
            break;
          case 'scanning':
            unit = 'scans/day';
            break;
          case 'commands':
            unit = 'commands/hour';
            break;
        }
        
        mockPatterns.push({
          id: `pattern-${Date.now()}-${i}`,
          cameraId: camera.id,
          name: pattern.name,
          description: `Learned behavioral pattern for ${pattern.name.toLowerCase()}`,
          pattern: {
            type: pattern.type,
            normalRangeMin: normalMin,
            normalRangeMax: normalMax,
            currentValue,
            unit
          },
          lastUpdated: new Date().toISOString(),
          isAnomaly,
          anomalyScore: isAnomaly ? Math.floor(Math.random() * 40) + 60 : undefined
        });
      }
      
      setAnomalies(mockAnomalies);
      setPatterns(mockPatterns);
      setIsAnalyzing(false);
    }, 2500);
  };

  if (!camera) {
    return <div className="p-4 text-muted-foreground">Select a camera to analyze for anomalies.</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            ML-based Anomaly Detection
          </CardTitle>
          <CardDescription>
            Detection of unusual patterns and behavior using machine learning algorithms
          </CardDescription>
          <div className="flex justify-end">
            <Button 
              onClick={analyzeCamera} 
              disabled={isAnalyzing}
              className="flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {anomalies.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detected Anomalies</h3>
              <ScrollArea className="h-48 rounded-md border p-2">
                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <Card key={anomaly.id} className="bg-muted">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={anomaly.score > 70 ? "destructive" : "warning"}
                            className="px-2 py-0"
                          >
                            Score: {anomaly.score}/100
                          </Badge>
                          <Badge variant="outline" className="px-2 py-0">
                            {anomaly.type.charAt(0).toUpperCase() + anomaly.type.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <p className="text-sm">{anomaly.description}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Confidence: {anomaly.confidence}% • Detected: {new Date(anomaly.timestamp).toLocaleString()}
                        </div>
                        {anomaly.relatedEvents && anomaly.relatedEvents.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium">Related Events:</div>
                            {anomaly.relatedEvents.map((event, index) => (
                              <div key={index} className="text-xs mt-1 pl-2 border-l-2 border-muted-foreground">
                                <span className="font-medium">{event.eventType.replace('_', ' ')}</span>: {event.description}
                                <div className="text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48">
              {isAnalyzing ? (
                <div className="flex flex-col items-center space-y-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p>Analyzing camera behavior and configurations...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No anomalies detected yet.</p>
                  <p className="text-xs text-muted-foreground">Click "Run Analysis" to scan for unusual patterns.</p>
                </div>
              )}
            </div>
          )}
          
          {patterns.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Behavioral Patterns</h3>
              {patterns.map((pattern) => (
                <div key={pattern.id} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      <span className="font-medium">{pattern.name}</span>
                    </div>
                    {pattern.isAnomaly && (
                      <Badge variant="destructive" className="px-2 py-0">Anomaly</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{pattern.description}</p>
                  <div className="relative pt-4 pb-2">
                    <div className="h-1 w-full bg-muted rounded-full relative">
                      {/* Normal range indicator */}
                      <div 
                        className="absolute h-1 bg-green-500 rounded-full"
                        style={{
                          left: `${(pattern.pattern.normalRangeMin / (pattern.pattern.normalRangeMax * 1.5)) * 100}%`,
                          width: `${((pattern.pattern.normalRangeMax - pattern.pattern.normalRangeMin) / (pattern.pattern.normalRangeMax * 1.5)) * 100}%`
                        }}
                      />
                      {/* Current value indicator */}
                      <div 
                        className={`absolute h-4 w-4 rounded-full border-2 border-background ${pattern.isAnomaly ? 'bg-destructive' : 'bg-primary'}`}
                        style={{
                          left: `${(pattern.pattern.currentValue / (pattern.pattern.normalRangeMax * 1.5)) * 100}%`,
                          top: '-4px',
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>0</span>
                      <span>Normal Range: {pattern.pattern.normalRangeMin}-{pattern.pattern.normalRangeMax} {pattern.pattern.unit}</span>
                      <span>{pattern.pattern.normalRangeMax * 1.5}</span>
                    </div>
                    <div className="flex justify-center mt-2">
                      <Badge variant="outline">
                        Current: {pattern.pattern.currentValue} {pattern.pattern.unit}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnomalyDetection;

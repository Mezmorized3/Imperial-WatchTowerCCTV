
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataAnalysisTab: React.FC = () => {
  const { toast } = useToast();

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Data Analysis Tools</h2>
          <p className="text-gray-400">Advanced tools for analyzing collected data</p>
          
          <div className="bg-scanner-dark p-6 rounded-md border border-gray-700 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <h3 className="text-lg font-medium mb-2">Data Analysis Hub</h3>
            <p className="text-sm text-gray-400 mb-4">
              This module is currently in development. Check back soon for updates.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "This feature is currently in development",
                });
              }}
            >
              Request Early Access
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataAnalysisTab;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImperialStartupProps {
  setServerStarted: (started: boolean) => void;
  connect: () => Promise<void>;
}

const ImperialStartup: React.FC<ImperialStartupProps> = ({ setServerStarted, connect }) => {
  const handleServerStart = () => {
    if ((window as any).startImperialServer) {
      const success = (window as any).startImperialServer();
      setServerStarted(true);
      
      // Try to connect to real-time after server start
      if (success) {
        setTimeout(async () => {
          try {
            await connect();
          } catch (error) {
            console.error("Failed to connect to WebSocket:", error);
          }
        }, 2000); // Give server time to start up
      }
      
      toast({
        title: success ? "Imperial Server Started" : "Server Start Failed",
        description: success 
          ? "All systems initialized and operational" 
          : "Please launch the server manually",
        variant: success ? "default" : "destructive"
      });
    } else {
      toast({
        title: "Desktop App Required",
        description: "Auto-start requires the desktop application",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-center mt-4 mb-6">
      <Button 
        onClick={handleServerStart}
        className="bg-scanner-primary hover:bg-scanner-primary/80 text-white py-3 px-6 rounded-md flex items-center gap-2 shadow-lg hover:shadow-red-900/20 transition-all"
        size="lg"
      >
        <Play className="h-5 w-5" />
        <span className="font-bold">IMPERIAL STARTUP</span>
      </Button>
    </div>
  );
};

export default ImperialStartup;

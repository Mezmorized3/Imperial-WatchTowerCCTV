import React, { useState, useEffect } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Play, ScanFace, Settings, HelpCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPalette = ({ open, setOpen }: CommandPaletteProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startServer = () => {
    if (window.startImperialServer) {
      const success = window.startImperialServer();
      if (success) {
        toast({
          title: "Server Starting",
          description: "Imperial Server is launching...",
        });
      } else {
        toast({
          title: "Server Start Failed",
          description: "Please launch the server manually",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Function Not Available",
        description: "Server auto-start is only available in desktop app",
        variant: "destructive"
      });
    }
    setOpen(false);
  };

  const closeCommandPalette = () => {
    setOpen(false);
  };

  const handleScan = () => {
    toast({
      title: "Scan Initiated",
      description: "Starting a new security scan...",
    });
    setOpen(false);
  };

  const handleSettings = () => {
    toast({
      title: "Settings Opened",
      description: "Navigating to settings panel...",
    });
    setOpen(false);
  };

  const handleHelp = () => {
    toast({
      title: "Help & Support",
      description: "Opening help documentation...",
    });
    setOpen(false);
  };

  const handleStatusCheck = () => {
    toast({
      title: "Status Check",
      description: "Performing system status check...",
    });
    setOpen(false);
  };

  const handleReportIssue = () => {
    toast({
      title: "Report Issue",
      description: "Redirecting to issue reporting form...",
    });
    setOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={startServer}>
            <Play className="mr-2 h-4 w-4" />
            <span>Start Imperial Server</span>
          </CommandItem>
          <CommandItem onSelect={handleScan}>
            <ScanFace className="mr-2 h-4 w-4" />
            <span>Initiate Security Scan</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Preferences">
          <CommandItem onSelect={handleSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Open Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Help & Support">
          <CommandItem onSelect={handleHelp}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help Documentation</span>
          </CommandItem>
          <CommandItem onSelect={handleStatusCheck}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Check System Status</span>
          </CommandItem>
          <CommandItem onSelect={handleReportIssue}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Report an Issue</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;

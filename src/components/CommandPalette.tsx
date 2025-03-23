
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command';
import { 
  Laptop, 
  Shield, 
  Eye, 
  Settings, 
  HelpCircle, 
  Play,
  MonitorPlay,
  Database,
  Wrench // Replace Tool with Wrench, which is a valid icon in lucide-react
} from 'lucide-react';

type CommandOption = {
  label: string;
  icon: React.ReactNode;
  path: string;
  description: string;
  shortcut?: string;
};

const CommandPalette = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const navigate = useNavigate();

  const commandOptions: CommandOption[] = [
    {
      label: "Imperial Scanner",
      icon: <Laptop className="mr-2 h-4 w-4" />,
      path: "/imperial",
      description: "Main scanner interface for camera discovery",
      shortcut: "I S"
    },
    {
      label: "Imperial Shield",
      icon: <Shield className="mr-2 h-4 w-4" />,
      path: "/imperial-shield",
      description: "Security and defense dashboard",
      shortcut: "I H"
    },
    {
      label: "Imperial Shinobi",
      icon: <Eye className="mr-2 h-4 w-4" />,
      path: "/imperial-shinobi",
      description: "Advanced camera monitoring tools",
      shortcut: "I N"
    },
    {
      label: "Imperial Control",
      icon: <Database className="mr-2 h-4 w-4" />,
      path: "/imperial-control",
      description: "Server control panel",
      shortcut: "I C"
    },
    {
      label: "OSINT Tools",
      icon: <Wrench className="mr-2 h-4 w-4" />, // Changed from Tool to Wrench
      path: "/osint-tools",
      description: "Open-source intelligence gathering tools",
      shortcut: "O T"
    },
    {
      label: "Camera Viewer",
      icon: <MonitorPlay className="mr-2 h-4 w-4" />,
      path: "/viewer",
      description: "Live camera feed viewer",
      shortcut: "C V"
    },
    {
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      path: "/settings",
      description: "Application configuration",
      shortcut: "S"
    },
    {
      label: "Help & Support",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
      path: "/help",
      description: "Documentation and guides",
      shortcut: "?"
    }
  ];

  const handleSelect = (option: CommandOption) => {
    navigate(option.path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border border-gray-700 bg-scanner-dark shadow-md">
        <CommandInput placeholder="Type a command or search..." className="text-white" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Imperial Operations">
            {commandOptions.map((option) => (
              <CommandItem
                key={option.path}
                onSelect={() => handleSelect(option)}
                className="flex items-center text-white hover:bg-scanner-dark-alt"
              >
                {option.icon}
                <span>{option.label}</span>
                <span className="text-xs text-gray-400 ml-2">{option.description}</span>
                {option.shortcut && (
                  <CommandShortcut className="ml-auto">{option.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandPalette;

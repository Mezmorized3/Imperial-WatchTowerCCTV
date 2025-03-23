import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Camera, 
  Shield, 
  Globe, 
  Eye, 
  Server, 
  Settings,
  Home,
  Terminal
} from 'lucide-react';

const ImperialNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="bg-scanner-dark-alt border-b border-gray-800 py-2 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo/Home link */}
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className={`text-gray-400 hover:text-white ${isActive('/') ? 'bg-scanner-dark text-white' : ''}`}
          >
            <Link to="/" className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">Imperial Home</span>
            </Link>
          </Button>
          
          {/* Main Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-scanner-dark text-white hover:bg-scanner-dark-alt hover:text-scanner-primary">
                    Surveillance
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li className="row-span-3">
                        <Link
                          to="/viewer"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Camera className="h-6 w-6 text-scanner-primary mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Camera Viewer
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Monitor and control surveillance camera feeds
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/imperial-shinobi"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Eye className="h-6 w-6 text-red-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Imperial Shinobi
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Advanced surveillance modules
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-scanner-dark text-white hover:bg-scanner-dark-alt hover:text-scanner-primary">
                    Control
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <Link
                          to="/imperial-control"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Shield className="h-6 w-6 text-red-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Imperial Control
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Main control panel for Imperial operations
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/imperial-shield"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Shield className="h-6 w-6 text-yellow-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Imperial Shield
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Security modules and vulnerability assessment
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-scanner-dark text-white hover:bg-scanner-dark-alt hover:text-scanner-primary">
                    Intelligence
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <Link
                          to="/osint-tools"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Globe className="h-6 w-6 text-blue-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            OSINT Tools
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Open source intelligence gathering
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/hacking-tool"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Terminal className="h-6 w-6 text-green-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Hacking Tool
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Security testing framework
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Settings className="h-6 w-6 text-gray-400 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Settings
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Configure application settings
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={`text-gray-400 hover:text-white ${isActive('/viewer') ? 'bg-scanner-dark' : ''}`}
            >
              <Link to="/viewer">
                <Camera className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={`text-gray-400 hover:text-white ${isActive('/imperial-control') ? 'bg-scanner-dark' : ''}`}
            >
              <Link to="/imperial-control">
                <Shield className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={`text-gray-400 hover:text-white ${isActive('/osint-tools') ? 'bg-scanner-dark' : ''}`}
            >
              <Link to="/osint-tools">
                <Globe className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={`text-gray-400 hover:text-white ${isActive('/imperial-shinobi') ? 'bg-scanner-dark' : ''}`}
            >
              <Link to="/imperial-shinobi">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={`text-gray-400 hover:text-white ${isActive('/hacking-tool') ? 'bg-scanner-dark' : ''}`}
            >
              <Link to="/hacking-tool">
                <Terminal className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className={`text-gray-400 hover:text-white ${isActive('/settings') ? 'bg-scanner-dark' : ''}`}
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImperialNavigation;


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Camera, User, Shield, Cctv, Globe, Server, Bot, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardHeader = () => {
  return (
    <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex justify-center">
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-scanner-dark text-white hover:bg-scanner-dark-alt hover:text-scanner-primary">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/viewer"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Camera className="h-6 w-6 text-scanner-primary mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Camera Viewer
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            View live camera feeds and monitor surveillance systems
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/imperial"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Shield className="h-6 w-6 text-scanner-primary mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Imperial Scanner
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Advanced scanning and reconnaissance tools
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-scanner-dark text-white hover:bg-scanner-dark-alt hover:text-scanner-primary">
                  Imperial Control
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/imperial-control"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Shield className="h-6 w-6 text-red-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Command Center
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Main control panel for Imperial operations
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/imperial-control?module=shinobi"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Cctv className="h-6 w-6 text-red-500 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Shinobi CCTV
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Advanced CCTV monitoring and camera exploitation
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-scanner-dark text-white hover:bg-scanner-dark-alt hover:text-scanner-primary">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/settings"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Server className="h-6 w-6 text-scanner-info mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Settings
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Configure application settings and preferences
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/help"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-scanner-dark p-6 no-underline outline-none focus:shadow-md hover:bg-scanner-dark-alt"
                        >
                          <Database className="h-6 w-6 text-scanner-info mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Help & Documentation
                          </div>
                          <p className="text-sm leading-tight text-gray-400">
                            Access guides, tutorials and support resources
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Mobile navigation buttons */}
          <div className="flex md:hidden space-x-2">
            <Button variant="outline" size="sm" className="text-gray-400 hover:text-white">
              <Link to="/viewer" className="flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Viewer
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="text-gray-400 hover:text-white">
              <Link to="/imperial" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Imperial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

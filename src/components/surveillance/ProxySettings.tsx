
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown, Copy, HelpCircle, Network, RotateCcw, Trash2, X } from 'lucide-react';

// Define the proxy types
type ProxyType = 'http' | 'socks4' | 'socks5' | 'tor';

// Define the component props
interface ProxySettingsProps {
  onProxyChange: (proxy: string | null, proxyType: ProxyType | null) => void;
  onClearProxies: () => void;
  onTestProxy: (proxy: string, proxyType: ProxyType) => Promise<boolean>;
  onFetchProxies: (proxyType: ProxyType) => Promise<string[]>;
  proxies: string[];
  setProxies: React.Dispatch<React.SetStateAction<string[]>>;
}

// ProxySettings component
const ProxySettings: React.FC<ProxySettingsProps> = ({
  onProxyChange,
  onClearProxies,
  onTestProxy,
  onFetchProxies,
  proxies,
  setProxies,
}) => {
  const [proxyType, setProxyType] = useState<ProxyType | null>(null);
  const [proxy, setProxy] = useState<string | null>(null);
  const [proxyListText, setProxyListText] = useState('');
  const [isProxyEnabled, setIsProxyEnabled] = useState(false);
  const [isTestingProxy, setIsTestingProxy] = useState(false);
  const [isFetchingProxies, setIsFetchingProxies] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [isProxyListVisible, setIsProxyListVisible] = useState(false);
  const { toast } = useToast();

  // Load proxies from local storage on component mount
  useEffect(() => {
    const storedProxies = localStorage.getItem('proxies');
    if (storedProxies) {
      setProxies(JSON.parse(storedProxies));
    }
  }, [setProxies]);

  // Save proxies to local storage whenever the proxies state changes
  useEffect(() => {
    localStorage.setItem('proxies', JSON.stringify(proxies));
  }, [proxies]);

  // Handle proxy type change
  const handleProxyTypeChange = (type: ProxyType) => {
    setProxyType(type);
    if (isProxyEnabled) {
      onProxyChange(proxy, type);
    }
  };

  // Handle proxy change
  const handleProxyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProxy(e.target.value);
    if (isProxyEnabled && proxyType) {
      onProxyChange(e.target.value, proxyType);
    }
  };

  // Handle toggle proxy
  const handleToggleProxy = () => {
    setIsProxyEnabled(!isProxyEnabled);
    if (!isProxyEnabled) {
      if (proxyType) {
        onProxyChange(proxy, proxyType);
      }
    } else {
      onProxyChange(null, null);
    }
  };

  // Handle clear proxies
  const handleClearProxies = () => {
    setProxies([]);
    onClearProxies();
    toast({
      title: 'Proxies Cleared',
      description: 'All proxies have been cleared from the list.',
    });
  };

  // Handle test proxy
  const handleTestProxy = async () => {
    if (!proxy || !proxyType) {
      toast({
        title: 'Error',
        description: 'Please enter a proxy and select a proxy type.',
        variant: 'destructive',
      });
      return;
    }

    setIsTestingProxy(true);
    try {
      const result = await onTestProxy(proxy, proxyType);
      setTestResult(result);
      toast({
        title: result ? 'Proxy Works!' : 'Proxy Failed',
        description: result
          ? 'The proxy is working correctly.'
          : 'The proxy is not working. Please check the proxy and try again.',
        variant: result ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error testing proxy:', error);
      setTestResult(false);
      toast({
        title: 'Error',
        description: 'An error occurred while testing the proxy.',
        variant: 'destructive',
      });
    } finally {
      setIsTestingProxy(false);
    }
  };

  // Handle fetch proxies
  const handleFetchProxies = async () => {
    if (!proxyType) {
      toast({
        title: 'Error',
        description: 'Please select a proxy type to fetch.',
        variant: 'destructive',
      });
      return;
    }

    setIsFetchingProxies(true);
    try {
      const fetchedProxies = await onFetchProxies(proxyType);
      setProxies(fetchedProxies);
      toast({
        title: 'Proxies Fetched',
        description: `Successfully fetched ${fetchedProxies.length} proxies.`,
      });
    } catch (error) {
      console.error('Error fetching proxies:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching proxies.',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingProxies(false);
    }
  };

  // Handle add proxies from text
  const handleAddProxiesFromText = () => {
    const newProxies = proxyListText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
    setProxies((prevProxies) => [...new Set([...prevProxies, ...newProxies])]);
    setProxyListText('');
    toast({
      title: 'Proxies Added',
      description: `Successfully added ${newProxies.length} proxies from the text area.`,
    });
  };

  // Handle remove proxy from list
  const handleRemoveProxy = (proxyToRemove: string) => {
    setProxies((prevProxies) => prevProxies.filter((p) => p !== proxyToRemove));
    toast({
      title: 'Proxy Removed',
      description: 'Successfully removed the proxy from the list.',
    });
  };

  // Handle copy proxy to clipboard
  const handleCopyToClipboard = (proxyToCopy: string) => {
    navigator.clipboard.writeText(proxyToCopy);
    toast({
      title: 'Proxy Copied',
      description: 'Successfully copied the proxy to the clipboard.',
    });
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="proxy-type" className="text-gray-300">
            Proxy Type
          </Label>
          <Select onValueChange={(value) => handleProxyTypeChange(value as ProxyType)}>
            <SelectTrigger id="proxy-type" className="bg-scanner-dark">
              <SelectValue placeholder="Select proxy type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark">
              <SelectItem value="http">HTTP</SelectItem>
              <SelectItem value="socks4">SOCKS4</SelectItem>
              <SelectItem value="socks5">SOCKS5</SelectItem>
              <SelectItem value="tor">Tor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proxy-address" className="text-gray-300">
            Proxy Address
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              id="proxy-address"
              placeholder="Enter proxy address"
              className="bg-scanner-dark"
              value={proxy || ''}
              onChange={handleProxyChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestProxy}
              disabled={isTestingProxy || !proxy || !proxyType}
            >
              {isTestingProxy ? (
                <>
                  Testing... <RotateCcw className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Test <HelpCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          {testResult !== null && (
            <div className={`text-sm ${testResult ? 'text-green-500' : 'text-red-500'}`}>
              {testResult ? (
                <>
                  <Check className="mr-1 inline-block h-4 w-4" /> Proxy is working
                </>
              ) : (
                <>
                  <X className="mr-1 inline-block h-4 w-4" /> Proxy is not working
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enable-proxy" className="text-gray-300">
            Enable Proxy
          </Label>
          <Switch id="enable-proxy" checked={isProxyEnabled} onCheckedChange={handleToggleProxy} />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Proxy List</Label>
          <div className="flex items-center justify-between">
            <Button variant="secondary" size="sm" onClick={() => setIsProxyListVisible(!isProxyListVisible)}>
              {isProxyListVisible ? (
                <>
                  Hide List <ChevronsUpDown className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show List <ChevronsUpDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearProxies}
              disabled={proxies.length === 0}
            >
              Clear All <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isProxyListVisible && (
            <div className="space-y-2">
              {proxies.length > 0 ? (
                <ul className="list-none space-y-1">
                  {proxies.map((p, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md bg-scanner-dark p-2"
                    >
                      <span className="truncate text-sm text-gray-400">{p}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyToClipboard(p)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProxy(p)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-400">No proxies in the list.</div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="proxy-list-text" className="text-gray-300">
            Add Proxies from Text
          </Label>
          <textarea
            id="proxy-list-text"
            className="w-full rounded-md border border-gray-700 bg-scanner-dark text-sm text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter proxies, one per line"
            value={proxyListText}
            onChange={(e) => setProxyListText(e.target.value)}
          />
          <Button variant="secondary" size="sm" onClick={handleAddProxiesFromText}>
            Add Proxies <Network className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleFetchProxies}
          disabled={isFetchingProxies || !proxyType}
        >
          {isFetchingProxies ? (
            <>
              Fetching Proxies... <RotateCcw className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Fetch Proxies <Network className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProxySettings;

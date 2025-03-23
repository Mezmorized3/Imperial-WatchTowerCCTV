
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Bug, AlertTriangle, Check, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This would be implemented in a real application
interface ScrapyResult {
  status: string;
  data: any;
  urls?: string[];
  items?: any[];
  errors?: string[];
}

const ScrapyTool: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [depth, setDepth] = useState<string>('2');
  const [selector, setSelector] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<ScrapyResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('simple');
  const [customCode, setCustomCode] = useState<string>(`import scrapy

class ExampleSpider(scrapy.Spider):
    name = 'example'
    
    def start_requests(self):
        urls = ['https://example.com']
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        # Extract content
        for item in response.css('div.item'):
            yield {
                'title': item.css('h2::text').get(),
                'link': item.css('a::attr(href)').get(),
                'desc': item.css('p::text').get(),
            }
            
        # Follow links
        for next_page in response.css('a.next-page::attr(href)'):
            yield response.follow(next_page, self.parse)`);
  
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const { toast } = useToast();

  const formatOptions = ['json', 'csv', 'xml', 'jsonlines'];
  const depthOptions = ['1', '2', '3', '4', '5'];

  const handleExecuteSimpleScrape = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scrape",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExecuting(true);
      setResults(null);
      
      // This is a simulation - in a real app, we would make an API call
      // to a backend service that runs Scrapy
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock response
      const mockResult: ScrapyResult = {
        status: "success",
        data: {
          url: url,
          depth: parseInt(depth),
          selector: selector || "Default selectors",
          crawledPages: Math.floor(Math.random() * 20) + 1,
          elapsedTime: `${(Math.random() * 10).toFixed(1)}s`,
        },
        urls: [
          url,
          `${url}/about`,
          `${url}/products`,
          `${url}/contact`,
        ],
        items: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, (_, i) => ({
          id: i + 1,
          title: `Item ${i + 1} from ${new URL(url).hostname}`,
          link: `${url}/item-${i + 1}`,
          text: `This is sample text content for item ${i + 1}`,
          timestamp: new Date().toISOString()
        }))
      };
      
      setResults(mockResult);
      
      toast({
        title: "Scraping Complete",
        description: `Successfully scraped ${mockResult.data.crawledPages} pages from ${url}`,
      });
    } catch (error) {
      console.error("Error during scraping:", error);
      toast({
        title: "Scraping Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExecuteCustomScrape = async () => {
    if (!customCode) {
      toast({
        title: "Code Required",
        description: "Please enter Scrapy spider code",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExecuting(true);
      setResults(null);
      
      // Simulate parsing and executing custom code
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Mock response for custom code
      const mockResult: ScrapyResult = {
        status: "success",
        data: {
          spiderName: "CustomSpider",
          executionTime: `${(Math.random() * 15).toFixed(1)}s`,
          crawledPages: Math.floor(Math.random() * 30) + 5,
          itemsScraped: Math.floor(Math.random() * 50) + 10,
        },
        items: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
          id: `custom-${i + 1}`,
          title: `Custom Item ${i + 1}`,
          link: `https://example.com/custom-${i + 1}`,
          price: `$${(Math.random() * 100).toFixed(2)}`,
          rating: (Math.random() * 5).toFixed(1),
          timestamp: new Date().toISOString()
        }))
      };
      
      setResults(mockResult);
      
      toast({
        title: "Custom Spider Executed",
        description: `Scraped ${mockResult.data.itemsScraped} items from ${mockResult.data.crawledPages} pages`,
      });
    } catch (error) {
      console.error("Error executing custom spider:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Bug className="mr-2 h-5 w-5" />
          Scrapy Web Crawler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="simple">
              <Bug className="h-4 w-4 mr-2" />
              Simple Scraper
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Code className="h-4 w-4 mr-2" />
              Custom Spider
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                className="bg-scanner-dark border-gray-700"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depth">Crawl Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                    <SelectValue placeholder="Select depth" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark text-white border-gray-700">
                    {depthOptions.map((d) => (
                      <SelectItem key={d} value={d}>Level {d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark text-white border-gray-700">
                    {formatOptions.map((format) => (
                      <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="selector">CSS Selector (Optional)</Label>
              <Input
                id="selector"
                placeholder="e.g., div.product or table.results"
                className="bg-scanner-dark border-gray-700"
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
              />
              <p className="text-xs text-gray-400">Enter CSS selectors to extract specific content</p>
            </div>
            
            <Button
              onClick={handleExecuteSimpleScrape}
              disabled={isExecuting || !url}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bug className="h-4 w-4 mr-2" />
              )}
              Start Scraping
            </Button>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customCode">Python Scrapy Spider Code</Label>
              <Textarea
                id="customCode"
                className="bg-scanner-dark border-gray-700 font-mono h-64"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
              />
              <p className="text-xs text-gray-400">Write a custom Scrapy spider in Python</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark text-white border-gray-700">
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleExecuteCustomScrape}
              disabled={isExecuting || !customCode}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Code className="h-4 w-4 mr-2" />
              )}
              Execute Spider
            </Button>
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Scraping Results
              </Label>
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                {results.status.toUpperCase()}
              </span>
            </div>
            
            <div className="bg-black rounded p-3 mt-1 overflow-auto max-h-60 text-xs font-mono">
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
            
            {results.items && results.items.length > 0 && (
              <div className="bg-scanner-dark border border-gray-700 rounded-md p-3">
                <h4 className="text-sm font-medium mb-2 text-scanner-info">Scraped Items ({results.items.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {results.items.slice(0, 5).map((item, index) => (
                    <div key={index} className="text-xs p-2 border-b border-gray-700 last:border-0">
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-4">
                          <span className="text-gray-400">{key}:</span>
                          <span className="col-span-3 truncate">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {results.items.length > 5 && (
                    <div className="text-xs text-center text-gray-400">
                      + {results.items.length - 5} more items
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400 flex items-start">
          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <span>
            WARNING: Web scraping should be done responsibly. Always check the website's robots.txt 
            and terms of service. Some websites prohibit scraping and automated access.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrapyTool;

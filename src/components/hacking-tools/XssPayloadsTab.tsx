
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeHackingTool } from '@/utils/osintUtilsConnector';
import { HackingToolErrorData, HackingToolSuccessData } from '@/utils/types/osintToolTypes';

interface XssPayloadsTabProps {
  isExecuting?: boolean;
  setIsExecuting?: (isExecuting: boolean) => void;
  setToolOutput?: (output: string | null) => void;
  isRealmode?: boolean; // isRealmode marked as unused, keeping for prop consistency
}

const XssPayloadsTab: React.FC<XssPayloadsTabProps> = ({
  isExecuting: propIsLoading,
  setIsExecuting: propSetIsLoading,
  setToolOutput,
  // isRealmode = false // Marked as unused
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const effectiveIsLoading = propIsLoading !== undefined ? propIsLoading : isLoading;
  const effectiveSetIsLoading = propSetIsLoading || setIsLoading;

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    effectiveSetIsLoading(true);
    setResults([]);

    try {
      const params = {
        tool: 'xssPayloadSearch',
        searchTerm: searchTerm
      };
      const result = await executeHackingTool(params);
      
      if (result && result.success) {
        const successData = result.data as HackingToolSuccessData<string[]>;
        if (successData && successData.results) {
          setResults(successData.results);
          if (setToolOutput) {
            setToolOutput(successData.results.join('\n'));
          }
          toast({
            title: "Search Complete",
            description: `Found ${successData.results.length} XSS payloads.${successData.message ? ` ${successData.message}` : ''}`
          });
        } else {
          toast({ title: "Search Error", description: "Unexpected data format on success.", variant: "destructive" });
        }
      } else {
        const errorData = result?.data as HackingToolErrorData | undefined;
        const errorMessage = errorData?.message || result?.error || "Unknown error occurred";
        toast({
          title: "Search Failed",
          description: errorMessage,
          variant: "destructive"
        });
        if (setToolOutput) {
          setToolOutput(`Error: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error("Error during XSS payloads search:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive"
      });
      if (setToolOutput) {
        setToolOutput(`Error: ${errorMessage}`);
      }
    } finally {
      effectiveSetIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-4 w-4 mr-2" />
          XSS Payloads Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-term">Search Term</Label>
          <Input
            id="search-term"
            placeholder="e.g., alert, prompt, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={effectiveIsLoading}
          />
        </div>
        <Button onClick={handleSearch} disabled={effectiveIsLoading} className="w-full">
          {effectiveIsLoading ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Payloads
            </>
          )}
        </Button>
        {results.length > 0 && (
          <div className="space-y-2">
            <Label>Results</Label>
            <Textarea
              readOnly
              value={results.join('\n')}
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default XssPayloadsTab;

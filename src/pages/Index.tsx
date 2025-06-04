import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shell } from 'lucide-react';
import { executeWebCheck } from '@/utils/osintUtilsConnector';

const Index: React.FC = () => {
  const [url, setUrl] = React.useState('');

  const handleWebCheck = async (url: string) => {
    try {
      const result = await executeWebCheck({
        tool: 'webCheck',
        url: url
      });
      
      if (result.success) {
        console.log('Web check results:', result);
      }
    } catch (error) {
      console.error('Web check failed:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Web Check</CardTitle>
          <CardDescription>Enter a URL to perform a web check.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              type="url"
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button onClick={() => handleWebCheck(url)}>
            Check
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

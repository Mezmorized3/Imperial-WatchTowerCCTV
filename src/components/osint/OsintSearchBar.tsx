
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OsintSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const OsintSearchBar: React.FC<OsintSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Global Search",
      description: "Searching across all OSINT tools...",
    });
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search across all OSINT tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-scanner-dark border-gray-700"
          />
          <Button 
            className="whitespace-nowrap"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OsintSearchBar;

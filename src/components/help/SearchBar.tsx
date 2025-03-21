
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input 
        placeholder="Search help topics..." 
        className="w-full pl-10 bg-gray-800 border-gray-700"
      />
    </div>
  );
};

export default SearchBar;

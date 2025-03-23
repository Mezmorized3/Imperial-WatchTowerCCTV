
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ToolCategorySelectorProps {
  toolCategory: string;
  setToolCategory: (category: string) => void;
}

export const ToolCategorySelector: React.FC<ToolCategorySelectorProps> = ({
  toolCategory,
  setToolCategory
}) => {
  const categories = [
    'Information Gathering',
    'Vulnerability Scanner',
    'Exploitation Tools',
    'Wireless Testing',
    'Forensics Tools',
    'Web Hacking',
    'Stress Testing',
    'Password Hacking',
    'IP Tracking',
    'Programming Languages',
    'Payload Creation'
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="toolCategory" className="text-white font-semibold">Tool Category</Label>
      <Select value={toolCategory} onValueChange={setToolCategory}>
        <SelectTrigger id="toolCategory" className="w-full bg-scanner-dark border-gray-700 text-white">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-scanner-dark text-white border-gray-700 max-h-80">
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

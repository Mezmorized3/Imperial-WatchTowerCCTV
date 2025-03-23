
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
  const toolCategories = [
    'Information Gathering',
    'Vulnerability Scanner',
    'Exploitation Tools',
    'Wireless Testing',
    'Forensics Tools',
    'Web Hacking',
    'Stress Testing',
    'Password Hacking',
    'IP Tracking',
    'Programming Languages'
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="toolCategory">Tool Category</Label>
      <Select 
        value={toolCategory} 
        onValueChange={(value: string) => {
          setToolCategory(value);
          // Reset tool selection will happen in parent component
        }}
      >
        <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-scanner-dark text-white border-gray-700">
          {toolCategories.map((category) => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

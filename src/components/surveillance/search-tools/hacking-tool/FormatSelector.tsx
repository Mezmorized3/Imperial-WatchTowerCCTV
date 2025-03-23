
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormatSelectorProps {
  outputFormat: string;
  setOutputFormat: (format: string) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ outputFormat, setOutputFormat }) => {
  const formatOptions = ['json', 'text', 'xml', 'csv', 'yaml'];

  return (
    <div className="space-y-2">
      <Label htmlFor="outputFormat" className="text-white">Output Format</Label>
      <Select value={outputFormat} onValueChange={setOutputFormat}>
        <SelectTrigger id="outputFormat" className="w-full bg-scanner-dark border-gray-700 text-white">
          <SelectValue placeholder="Select output format" />
        </SelectTrigger>
        <SelectContent className="bg-scanner-dark text-white border-gray-700">
          {formatOptions.map((format) => (
            <SelectItem key={format} value={format} className="text-white hover:bg-scanner-primary/20">{format.toUpperCase()}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

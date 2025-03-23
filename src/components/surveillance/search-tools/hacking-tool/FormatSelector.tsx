
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormatSelectorProps {
  outputFormat: string;
  setOutputFormat: (format: string) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  outputFormat,
  setOutputFormat
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-white font-semibold">Output Format</Label>
      <RadioGroup 
        value={outputFormat} 
        onValueChange={setOutputFormat}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="json" id="json" className="border-gray-500 text-scanner-primary" />
          <Label htmlFor="json" className="text-white cursor-pointer">JSON</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="text" id="text" className="border-gray-500 text-scanner-primary" />
          <Label htmlFor="text" className="text-white cursor-pointer">Text</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="table" id="table" className="border-gray-500 text-scanner-primary" />
          <Label htmlFor="table" className="text-white cursor-pointer">Table</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

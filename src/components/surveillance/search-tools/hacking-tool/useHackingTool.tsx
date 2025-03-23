
import { useState } from 'react';
import { HackingToolParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

export const useHackingTool = () => {
  const [toolCategory, setToolCategory] = useState<string>('Information Gathering');
  const [tool, setTool] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('tools');
  const [customCommand, setCustomCommand] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const { toast } = useToast();

  const clearResults = () => {
    setResults('');
  };

  const handleToolExecution = (params: HackingToolParams, successMessage: string) => {
    setIsExecuting(true);
    setResults('');
    
    return {
      onSuccess: (data: any) => {
        toast({
          title: "Tool Executed",
          description: successMessage,
        });
        
        let formattedResult = '';
        if (typeof data === 'string') {
          formattedResult = data;
        } else if (outputFormat === 'json') {
          formattedResult = JSON.stringify(data, null, 2);
        } else if (outputFormat === 'text') {
          formattedResult = formatAsText(data);
        } else if (outputFormat === 'table') {
          formattedResult = formatAsTable(data);
        } else {
          formattedResult = JSON.stringify(data, null, 2);
        }
        
        setResults(formattedResult);
        setIsExecuting(false);
      },
      onError: (error: string) => {
        toast({
          title: "Execution Failed",
          description: error || "An error occurred during execution",
          variant: "destructive",
        });
        setIsExecuting(false);
      }
    };
  };

  // Helper function to format data as text
  const formatAsText = (data: any): string => {
    if (!data) return 'No data';
    
    let result = '';
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          result += `Item ${index + 1}:\n`;
          result += formatAsText(item);
          result += '\n';
        });
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            result += `${key}:\n${formatAsText(value)}\n`;
          } else {
            result += `${key}: ${value}\n`;
          }
        });
      }
    } else {
      result = String(data);
    }
    
    return result;
  };

  // Helper function to format data as ASCII table
  const formatAsTable = (data: any): string => {
    if (!data) return 'No data';
    
    if (typeof data !== 'object') {
      return String(data);
    }
    
    if (Array.isArray(data)) {
      if (data.length === 0) return 'Empty array';
      
      // Extract headers from the first object
      const headers = Object.keys(data[0]);
      
      // Calculate column widths
      const columnWidths = headers.map(header => 
        Math.max(
          header.length,
          ...data.map(item => String(item[header] || '').length)
        )
      );
      
      // Create header row
      let table = '┌' + columnWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐\n';
      
      // Add headers
      table += '│ ' + headers.map((header, i) => 
        header.padEnd(columnWidths[i]) + ' '
      ).join('│') + '│\n';
      
      // Add separator
      table += '├' + columnWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤\n';
      
      // Add data rows
      data.forEach(item => {
        table += '│ ' + headers.map((header, i) => 
          String(item[header] || '').padEnd(columnWidths[i]) + ' '
        ).join('│') + '│\n';
      });
      
      // Add bottom border
      table += '└' + columnWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘\n';
      
      return table;
    } else {
      // For a single object, create a two-column table
      const keys = Object.keys(data);
      
      if (keys.length === 0) return 'Empty object';
      
      // Calculate column widths
      const keyWidth = Math.max(...keys.map(k => k.length));
      const valueWidth = Math.max(...keys.map(k => String(data[k] || '').length));
      
      // Create table
      let table = '┌' + '─'.repeat(keyWidth + 2) + '┬' + '─'.repeat(valueWidth + 2) + '┐\n';
      
      // Add header
      table += '│ ' + 'Property'.padEnd(keyWidth) + ' │ ' + 'Value'.padEnd(valueWidth) + ' │\n';
      
      // Add separator
      table += '├' + '─'.repeat(keyWidth + 2) + '┼' + '─'.repeat(valueWidth + 2) + '┤\n';
      
      // Add rows
      keys.forEach(key => {
        let value = data[key];
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        table += '│ ' + key.padEnd(keyWidth) + ' │ ' + String(value || '').padEnd(valueWidth) + ' │\n';
      });
      
      // Add bottom border
      table += '└' + '─'.repeat(keyWidth + 2) + '┴' + '─'.repeat(valueWidth + 2) + '┘\n';
      
      return table;
    }
  };

  return {
    toolCategory,
    setToolCategory,
    tool,
    setTool,
    target,
    setTarget,
    isExecuting,
    results,
    selectedTab,
    setSelectedTab,
    customCommand,
    setCustomCommand,
    outputFormat,
    setOutputFormat,
    clearResults,
    handleToolExecution
  };
};

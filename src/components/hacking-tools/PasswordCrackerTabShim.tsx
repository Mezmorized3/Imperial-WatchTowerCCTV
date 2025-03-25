
import React from 'react';
import PasswordCrackerTab, { PasswordCrackerTabProps } from './PasswordCrackerTab';

interface PasswordCrackerTabShimProps {
  isRealmode: boolean;
  isExecuting: boolean;
  setIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
  setToolOutput: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * This is a shim component to provide compatibility with the PasswordCrackerTab component
 * It adds the missing props that are required by PasswordCrackerTab
 */
const PasswordCrackerTabShim: React.FC<PasswordCrackerTabShimProps> = ({
  isRealmode,
  isExecuting,
  setIsExecuting,
  setToolOutput
}) => {
  // Mock function to execute the selected tool
  const executeSelectedTool = async (
    tool: string,
    options: Record<string, any>
  ): Promise<void> => {
    console.log(`Executing password cracking tool: ${tool}`, options);
    setIsExecuting(true);
    
    try {
      // Simulate tool execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock output
      let output = '';
      if (tool === 'hashcat') {
        output = 'Hashcat initiated...\nLoading wordlist...\nStarting attack mode 3...\nPassword found: p@ssw0rd123';
      } else if (tool === 'johntheripper') {
        output = 'John the Ripper started...\nUsing default rules...\nProcessing hashes...\nPassword: summer2023!';
      } else {
        output = `${tool} executed successfully\nSimulated output\nCracking completed`;
      }
      
      setToolOutput(output);
    } catch (error) {
      console.error('Error executing tool:', error);
      setToolOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };
  
  return (
    <PasswordCrackerTab
      isExecuting={isExecuting}
      setIsExecuting={setIsExecuting}
      toolOutput={''}
      executeSelectedTool={executeSelectedTool}
    />
  );
};

export default PasswordCrackerTabShim;

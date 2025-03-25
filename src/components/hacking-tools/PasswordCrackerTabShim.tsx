
import React, { useState } from 'react';
import PasswordCrackerTab from './PasswordCrackerTab';

interface PasswordCrackerTabShimProps {
  isExecuting: boolean;
  setIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
  setToolOutput: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * This is a shim component to provide compatibility with the PasswordCrackerTab component
 * It adds the missing props that are required by PasswordCrackerTab
 */
const PasswordCrackerTabShim: React.FC<PasswordCrackerTabShimProps> = ({
  isExecuting,
  setIsExecuting,
  setToolOutput
}) => {
  // State for tool output
  const [toolOutputState, setToolOutputState] = useState<string | null>(null);
  
  // Mock function to execute the selected tool
  const executeSelectedTool = async (toolType: string) => {
    console.log(`Executing password cracking tool: ${toolType}`);
    setIsExecuting(true);
    
    try {
      // Simulate tool execution
      setTimeout(() => {
        // Generate output
        let output = '';
        if (toolType === 'hashcat') {
          output = 'Hashcat initiated...\nLoading wordlist...\nStarting attack mode 3...\nPassword found: p@ssw0rd123';
        } else if (toolType === 'johntheripper') {
          output = 'John the Ripper started...\nUsing default rules...\nProcessing hashes...\nPassword: summer2023!';
        } else {
          output = `${toolType} executed successfully\nSimulated output\nCracking completed`;
        }
        
        setToolOutput(output);
        setToolOutputState(output);
        setIsExecuting(false);
      }, 2000);
    } catch (error) {
      console.error('Error executing tool:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setToolOutput(`Error: ${errorMessage}`);
      setToolOutputState(`Error: ${errorMessage}`);
      setIsExecuting(false);
    }
  };
  
  return (
    <PasswordCrackerTab
      isExecuting={isExecuting}
      setIsExecuting={setIsExecuting}
      toolOutput={toolOutputState}
      setToolOutput={setToolOutput}
      executeSelectedTool={executeSelectedTool}
      isRealmode={false}
    />
  );
};

export default PasswordCrackerTabShim;

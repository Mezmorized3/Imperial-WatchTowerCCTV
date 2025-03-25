
import React from 'react';
import EncoderDecoderTab from '@/components/hacking-tools/EncoderDecoderTab';
import ReverseShellTab from '@/components/hacking-tools/ReverseShellTab';
import PayloadGeneratorTab from '@/components/hacking-tools/PayloadGeneratorTab';
import SqliPayloadsTab from '@/components/hacking-tools/SqliPayloadsTab';
import XssPayloadsTab from '@/components/hacking-tools/XssPayloadsTab';
import AdditionalTools from '@/components/hacking-tools/AdditionalTools';
import PasswordCrackerTabShim from '@/components/hacking-tools/PasswordCrackerTabShim';

interface TabContentProps {
  activeTab: string;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  setToolOutput: (output: string) => void;
  toolOutput: string;
  isRealmode: boolean;
  executeSelectedTool: (tool: string) => Promise<void>;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  isExecuting,
  setIsExecuting,
  setToolOutput,
  toolOutput,
  isRealmode,
  executeSelectedTool
}) => {
  return (
    <>
      {activeTab === 'encoder' && (
        <EncoderDecoderTab 
          isExecuting={isExecuting}
          setIsExecuting={setIsExecuting}
          setToolOutput={setToolOutput}
          isRealmode={isRealmode}
        />
      )}
      
      {activeTab === 'revshell' && (
        <ReverseShellTab 
          isExecuting={isExecuting}
          setIsExecuting={setIsExecuting}
          setToolOutput={setToolOutput}
          isRealmode={isRealmode}
        />
      )}
      
      {activeTab === 'passwords' && (
        <PasswordCrackerTabShim
          isExecuting={isExecuting}
          setIsExecuting={setIsExecuting}
          setToolOutput={setToolOutput}
        />
      )}
      
      {activeTab === 'payload' && (
        <PayloadGeneratorTab 
          isExecuting={isExecuting}
          setIsExecuting={setIsExecuting}
          setToolOutput={setToolOutput}
        />
      )}
      
      {activeTab === 'sqli' && (
        <SqliPayloadsTab 
          isExecuting={isExecuting}
          setIsExecuting={setIsExecuting}
          setToolOutput={setToolOutput}
          executeSelectedTool={executeSelectedTool}
          toolOutput={toolOutput}
          activeTab={activeTab}
        />
      )}
      
      {activeTab === 'xss' && (
        <XssPayloadsTab 
          isExecuting={isExecuting}
          setIsExecuting={setIsExecuting}
          setToolOutput={setToolOutput}
          isRealmode={isRealmode}
        />
      )}
      
      {activeTab === 'additional' && (
        <AdditionalTools 
          isRealmode={isRealmode}
        />
      )}
    </>
  );
};

export default TabContent;

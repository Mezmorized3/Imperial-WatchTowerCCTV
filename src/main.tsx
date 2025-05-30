
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { RealTimeProvider } from './contexts/RealTimeContext'

// Function to start the server via the electron API if available
const startImperialServer = () => {
  try {
    // Check if running in Electron environment
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      if (ipcRenderer) {
        console.log('Attempting to start Imperial Server via Electron...');
        ipcRenderer.send('start-imperial-server');
        return true;
      }
    }
    
    // Fallback for non-Electron environments - display a message
    console.log('Auto-start attempted outside Electron environment.');
    return false;
  } catch (error) {
    console.error('Failed to auto-start server:', error);
    return false;
  }
};

// Add keyboard shortcut listener for command palette
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    // The actual handling is done in the CommandPalette component
  }
});

// Try to auto-start server when application starts
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content loaded, attempting to start server...');
  startImperialServer();
});

console.log('Rendering React application...');
const rootElement = document.getElementById("root");

if (rootElement) {
  console.log('Root element found, creating React root');
  const root = createRoot(rootElement);
  
  root.render(
    <BrowserRouter>
      <RealTimeProvider>
        <App />
      </RealTimeProvider>
    </BrowserRouter>
  );
} else {
  console.error('Root element not found! Make sure there is a div with id="root" in index.html');
}

// Add startImperialServer to window for component access
window.startImperialServer = startImperialServer;

// Add type definition for the global function
declare global {
  interface Window {
    startImperialServer: () => boolean;
    require?: any;
  }
}


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

// Add debugging console logs
console.log('Starting Imperial Watchtower application...');
console.log('Environment:', process.env.NODE_ENV);

// Apply scanner theme to body immediately
document.body.classList.add('scanner-theme');
document.body.style.backgroundColor = '#151b26';
document.body.style.color = 'white';

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
  
  // Add fallback styling to root element
  rootElement.style.width = '100%';
  rootElement.style.minHeight = '100vh';
  rootElement.style.backgroundColor = '#151b26';
  
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <BrowserRouter>
        <RealTimeProvider>
          <App />
        </RealTimeProvider>
      </BrowserRouter>
    );
    console.log('React application rendered successfully');
  } catch (error) {
    console.error('Error rendering React application:', error);
    
    // Fallback content
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #151b26; color: white; min-height: 100vh;">
        <h1>Imperial Watchtower</h1>
        <p>Loading error occurred. Check console for details.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
} else {
  console.error('Root element not found! Make sure there is a div with id="root" in index.html');
  
  // Create fallback root element
  const fallbackRoot = document.createElement('div');
  fallbackRoot.id = 'root';
  fallbackRoot.style.backgroundColor = '#151b26';
  fallbackRoot.style.color = 'white';
  fallbackRoot.style.padding = '20px';
  fallbackRoot.innerHTML = '<h1>Imperial Watchtower - Fallback Mode</h1><p>Root element was missing and has been created.</p>';
  document.body.appendChild(fallbackRoot);
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

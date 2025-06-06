
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

// DEBUGGING: Check if styles are loading
console.log('=== DEBUGGING STYLES ===');
console.log('Document ready state:', document.readyState);
console.log('Body class list:', document.body.classList.toString());
console.log('Body computed styles:', window.getComputedStyle(document.body).backgroundColor);

// Apply scanner theme to body immediately and aggressively
const applyTheme = () => {
  console.log('Applying theme...');
  document.body.classList.add('scanner-theme');
  document.body.style.backgroundColor = '#151b26 !important';
  document.body.style.color = 'white !important';
  document.body.style.minHeight = '100vh';
  
  // Also apply to root element
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.style.backgroundColor = '#151b26';
    rootElement.style.color = 'white';
    rootElement.style.minHeight = '100vh';
    rootElement.style.width = '100%';
  }
  
  console.log('Theme applied. Body background:', document.body.style.backgroundColor);
};

// Apply theme immediately
applyTheme();

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
  applyTheme(); // Apply theme again on DOM load
});

console.log('Rendering React application...');
const rootElement = document.getElementById("root");

if (rootElement) {
  console.log('Root element found, creating React root');
  
  // Add more aggressive fallback styling
  rootElement.style.width = '100%';
  rootElement.style.minHeight = '100vh';
  rootElement.style.backgroundColor = '#151b26';
  rootElement.style.color = 'white';
  
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
    
    // Apply theme one more time after render
    setTimeout(() => {
      applyTheme();
      console.log('Final theme check - Body background:', window.getComputedStyle(document.body).backgroundColor);
    }, 100);
    
  } catch (error) {
    console.error('Error rendering React application:', error);
    
    // Fallback content with inline styles
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #151b26 !important; color: white !important; min-height: 100vh; font-family: monospace;">
        <h1 style="color: #ff6b6b;">🛡️ Imperial Watchtower - Error Recovery</h1>
        <p>Loading error occurred. Check console for details.</p>
        <p>Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reload Application
        </button>
      </div>
    `;
  }
} else {
  console.error('Root element not found! Creating fallback...');
  
  // Create fallback root element with aggressive styling
  const fallbackRoot = document.createElement('div');
  fallbackRoot.id = 'root';
  fallbackRoot.style.backgroundColor = '#151b26';
  fallbackRoot.style.color = 'white';
  fallbackRoot.style.padding = '20px';
  fallbackRoot.style.minHeight = '100vh';
  fallbackRoot.style.width = '100%';
  fallbackRoot.innerHTML = `
    <h1 style="color: #ff6b6b;">🛡️ Imperial Watchtower - Fallback Mode</h1>
    <p>Root element was missing and has been created.</p>
    <p>If you see this, the React app failed to load properly.</p>
  `;
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

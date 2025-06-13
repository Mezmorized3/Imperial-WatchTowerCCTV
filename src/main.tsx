
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { RealTimeProvider } from './contexts/RealTimeContext'

console.log('=== MAIN.TSX STARTING ===');
console.log('React version check...');

// Apply dark theme immediately to prevent white flash
document.documentElement.style.backgroundColor = '#111827';
document.body.style.backgroundColor = '#111827';
document.body.style.color = 'white';
document.body.style.margin = '0';
document.body.style.padding = '0';

const rootElement = document.getElementById("root");

if (rootElement) {
  console.log('Root element found, creating React root');
  
  // Style the root element
  rootElement.style.width = '100%';
  rootElement.style.minHeight = '100vh';
  rootElement.style.backgroundColor = '#111827';
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
    
  } catch (error) {
    console.error('Error rendering React application:', error);
    
    // Fallback content
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #111827; color: white; min-height: 100vh; font-family: system-ui;">
        <h1 style="color: #ef4444;">🛡️ Imperial Watchtower - Error Recovery</h1>
        <p>Loading error occurred. Check console for details.</p>
        <p>Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Reload Application
        </button>
      </div>
    `;
  }
} else {
  console.error('Root element not found!');
  document.body.innerHTML = `
    <div style="padding: 20px; background: #111827; color: white; min-height: 100vh;">
      <h1 style="color: #ef4444;">🛡️ Imperial Watchtower - Critical Error</h1>
      <p>Root element missing. Cannot start application.</p>
    </div>
  `;
}

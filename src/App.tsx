
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Viewer from './pages/Viewer';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import ImperialScanner from './pages/ImperialScanner';
import ImperialControl from './pages/ImperialControl';
import ImperialShinobi from './pages/ImperialShinobi';
import ImperialShield from './pages/ImperialShield';
import OsintTools from './pages/OsintTools';
import HackingToolPage from './pages/HackingTool';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          backgroundColor: '#151b26', 
          color: 'white', 
          padding: '20px', 
          minHeight: '100vh',
          fontFamily: 'monospace'
        }}>
          <h1>🛡️ Imperial Watchtower - Error Recovery</h1>
          <p>An error occurred in the application.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Error Details</summary>
            <pre style={{ background: '#1c2333', padding: '10px', marginTop: '10px' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '10px', 
              padding: '10px 20px', 
              background: '#0066cc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App component rendering...');
  
  // Apply theme classes to ensure proper styling
  React.useEffect(() => {
    document.body.classList.add('scanner-theme');
    console.log('App mounted, theme applied');
  }, []);

  return (
    <ErrorBoundary>
      <div className="app bg-scanner-dark min-h-screen" style={{ backgroundColor: '#151b26' }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/viewer" element={<Viewer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/imperial" element={<ImperialScanner />} />
          <Route path="/imperial-control" element={<ImperialControl />} />
          <Route path="/imperial-shinobi" element={<ImperialShinobi />} />
          <Route path="/imperial-shield" element={<ImperialShield />} />
          <Route path="/osint-tools" element={<OsintTools />} />
          <Route path="/hacking-tool" element={<HackingToolPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;

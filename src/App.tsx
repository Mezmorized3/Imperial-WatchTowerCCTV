
import React, { Component, ErrorInfo, ReactNode } from 'react';
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

// Minimal error boundary for user-facing error display
class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log error here
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
          <h1 className="text-red-400 text-3xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="mb-4 text-gray-300">The application failed to load. Try refreshing the page.</p>
          <pre className="bg-gray-800 p-4 rounded text-sm text-red-300 mb-4 max-w-xl overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button
            className="bg-blue-500 px-6 py-2 rounded text-white font-medium"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  console.log('=== APP COMPONENT RENDERING ===');
  console.log('Current URL:', window.location.href);

  return (
    <div className="app bg-gray-900 min-h-screen text-white">
      <AppErrorBoundary>
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
      </AppErrorBoundary>
    </div>
  );
}

export default App;


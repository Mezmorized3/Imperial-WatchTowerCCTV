
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Viewer from '@/pages/Viewer';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Create a new query client
const queryClient = new QueryClient();

function App() {
  console.log('App rendering with routes configured');
  
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/viewer" element={<Viewer />} />
            {/* Lazy load the Globe component to avoid import issues */}
            <Route 
              path="/globe" 
              element={
                <React.Suspense fallback={<div>Loading Globe page...</div>}>
                  {(() => {
                    try {
                      const GlobePage = require('./pages/Globe').default;
                      return <GlobePage />;
                    } catch (e) {
                      console.error("Failed to load Globe page:", e);
                      return <div>Error loading Globe page</div>;
                    }
                  })()}
                </React.Suspense>
              } 
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

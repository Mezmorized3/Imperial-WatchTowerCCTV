
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Viewer from '@/pages/Viewer';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Import Globe directly with correct relative path
import Globe from './pages/Globe';

// Create a new query client
const queryClient = new QueryClient();

function App() {
  console.log('App rendering with Globe component:', Globe);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/globe" element={<Globe />} />
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

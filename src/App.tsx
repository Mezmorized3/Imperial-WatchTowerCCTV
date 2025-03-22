
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

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/imperial" element={<ImperialScanner />} />
        <Route path="/imperial-control" element={<ImperialControl />} />
        <Route path="/imperial-shinobi" element={<ImperialShinobi />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';
import WalletAnalysisPage from './pages/WalletAnalysisPage';
import TransactionFlowPage from './pages/TransactionFlowPage';
import ClusteringPage from './pages/ClusteringPage';
import EntityLabelingPage from './pages/EntityLabelingPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import { initializeTheme } from './lib/themeManager';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Initialize theme on app startup
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analysis" element={<WalletAnalysisPage />} />
          <Route path="/wallet-analysis" element={<WalletAnalysisPage />} /> {/* Add this to support both paths */}
          <Route path="/flow" element={<TransactionFlowPage />} />
          <Route path="/clustering" element={<ClusteringPage />} />
          <Route path="/entities" element={<EntityLabelingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

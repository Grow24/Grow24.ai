import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import Sheets from './pages/Sheets';

// Configure React Query for optimized data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // Cache data for 1 minute
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Only retry failed requests once
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <QueryClientProvider client={queryClient}>
        <Sheets />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

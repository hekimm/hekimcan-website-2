import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { SupabaseProvider } from './context/SupabaseContext.tsx';
import { Toaster } from './components/ui/Toast.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </StrictMode>
);
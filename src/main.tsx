import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './components/ToastContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { PortfolioProvider } from './contexts/PortfolioContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <LanguageProvider>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </LanguageProvider>
    </ToastProvider>
  </StrictMode>,
);

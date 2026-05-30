import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ToastProvider } from '../components/ToastContext';
import { PortfolioProvider } from '../contexts/PortfolioContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </ToastProvider>
    </LanguageProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as renderWithProviders, AllTheProviders };

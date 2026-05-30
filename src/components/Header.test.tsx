import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('Header Component', () => {
  it('renders header text correctly', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <Header />
        </PortfolioProvider>
      </LanguageProvider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('NxStep')).toBeInTheDocument();
  });
});

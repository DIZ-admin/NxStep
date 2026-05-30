import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('Footer Component', () => {
  it('renders footer text correctly', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <Footer />
        </PortfolioProvider>
      </LanguageProvider>
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

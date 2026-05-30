import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MapsAndPositions } from './MapsAndPositions';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('MapsAndPositions Component', () => {
  it('renders maps and allows switching', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <MapsAndPositions />
        </PortfolioProvider>
      </LanguageProvider>
    );

    // Initial selected map is Ancient
    expect(screen.getByText('de_ancient')).toBeInTheDocument();

    // Click on Mirage
    act(() => {
      screen.getByText('Mirage').click();
    });

    // Main map detail title switches
    expect(screen.getByText('de_mirage')).toBeInTheDocument();
  });
});

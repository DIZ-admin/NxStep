import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTimeline } from './ExperienceTimeline';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('ExperienceTimeline Component', () => {
  it('renders experience cards and filters them', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <ExperienceTimeline />
        </PortfolioProvider>
      </LanguageProvider>
    );

    // Initial render should contain "all" including active teams
    expect(screen.getByText('tokyo54 (stand-in)')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: /Trials/i }).click();
    });
    // the trials tab should render only trials type, such as B8 Prospects
    expect(screen.getByText('B8 Prospects & Inner Circle Prospects')).toBeInTheDocument();
  });
});

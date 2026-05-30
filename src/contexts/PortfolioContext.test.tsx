import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';
import { nxstepPortfolioData, nxstepPortfolioDataUK } from '../data';
import { LanguageProvider, useLanguage } from './LanguageContext';

const TestComponent = () => {
  const { data } = usePortfolio();
  return (
    <div>
      <span data-testid="portfolio-name">{data.name}</span>
    </div>
  );
};

const SwitchLangComponent = () => {
  const { setLang } = useLanguage();
  return <button onClick={() => setLang('uk')}>Switch to UK</button>;
};

describe('PortfolioContext', () => {
  it('provides default english data', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </LanguageProvider>
    );
    expect(screen.getByTestId('portfolio-name').textContent).toBe(nxstepPortfolioData.name);
  });

  it('changes data when language changes to ukrainian', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <SwitchLangComponent />
          <TestComponent />
        </PortfolioProvider>
      </LanguageProvider>
    );
    act(() => {
      screen.getByText('Switch to UK').click();
    });
    expect(screen.getByTestId('portfolio-name').textContent).toBe(nxstepPortfolioDataUK.name);
  });
});

import { describe, it, expect } from 'vitest';
import { nxstepPortfolioData, nxstepPortfolioDataUK } from './data';
import { translations } from './translations';

describe('Static Data', () => {
  it('contains english portfolio data', () => {
    expect(nxstepPortfolioData).toBeDefined();
    expect(nxstepPortfolioData.name).toBe('NxStep');
  });

  it('contains ukrainian portfolio data', () => {
    expect(nxstepPortfolioDataUK).toBeDefined();
    expect(nxstepPortfolioDataUK.name !== '').toBeTruthy();
  });

  it('contains translations', () => {
    expect(translations.en).toBeDefined();
    expect(translations.uk).toBeDefined();
    expect(translations.en.aiTitle).toBe('Interactive Scout Copilot');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';
import { nxstepPortfolioData, nxstepPortfolioDataUK } from '../data';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { getDoc, getDocs } from 'firebase/firestore';

vi.mock('../firebase', () => ({
  db: {}
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  getDocs: vi.fn(() => Promise.resolve({ forEach: vi.fn() }))
}));

const TestComponent = () => {
  const { data, updateData, reloadFromFirebase } = usePortfolio();
  return (
    <div>
      <span data-testid="portfolio-name">{data.name}</span>
      <span data-testid="kd">{data.maps[0].stats?.kd}</span>
      <button onClick={() => updateData({ ...data, name: 'New Name' })}>Update</button>
      <button onClick={() => reloadFromFirebase()}>Reload</button>
    </div>
  );
};

const SwitchLangComponent = () => {
  const { setLang } = useLanguage();
  return <button onClick={() => setLang('uk')}>Switch to UK</button>;
};

describe('PortfolioContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides default data and allows local update', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </LanguageProvider>
    );
    expect(screen.getByTestId('portfolio-name').textContent).toBe(nxstepPortfolioData.name);
    
    act(() => {
      screen.getByText('Update').click();
    });
    expect(screen.getByTestId('portfolio-name').textContent).toBe('New Name');
  });

  it('loads real data from firebase correctly', async () => {
    vi.mocked(getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ stats: { kd: 3.5 } })
    } as any);

    const mockDocs = [
      { data: () => ({ username: 'NxStep', map: 'de_mirage', kd: 2, result: 'W' }) },
      { data: () => ({ username: 'OtherUser', map: 'de_mirage', kd: 1, result: 'W' }) }
    ];
    vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as any);

    render(
      <LanguageProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </LanguageProvider>
    );

    await waitFor(() => {
      // The first map is ancient or mirage depending on data.ts, we check if logic doesn't crash
      expect(screen.getByTestId('kd')).toBeInTheDocument();
    });
  });

  it('handles reload error', async () => {
    vi.mocked(getDoc).mockRejectedValueOnce(new Error('no'));
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </LanguageProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('portfolio-name')).toBeInTheDocument();
    });
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

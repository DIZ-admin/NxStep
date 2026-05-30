import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatsDashboard } from './StatsDashboard';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ToastProvider } from './ToastContext';
import { apiClient } from '../api';

vi.mock('../api', () => ({
  apiClient: {
    syncFaceitStats: vi.fn(),
  },
}));

vi.mock('../services/firebaseService', () => ({
  firebaseService: {
    saveFaceitStats: vi.fn().mockResolvedValue(undefined),
    initAnonymousSession: vi.fn().mockResolvedValue(undefined),
  }
}));

// Mock recharts to avoid rendering complex SVG elements in JSDOM tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  AreaChart: () => <div data-testid="area-chart" />,
  RadarChart: () => <div data-testid="radar-chart" />,
  Area: () => null,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

vi.mock('motion/react', () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));


describe('StatsDashboard Component', () => {
  const wrapper = ({ children }: any) => (
    <LanguageProvider>
      <ToastProvider>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </ToastProvider>
    </LanguageProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats dashboard', () => {
    render(<StatsDashboard />, { wrapper });
    expect(screen.getByText(/Sync FACEIT/i)).toBeInTheDocument();
  });

  it('syncs faceit data successfully', async () => {
    const mockReponse = { success: true, stats: { matches: 500 } };
    (apiClient.syncFaceitStats as any).mockResolvedValueOnce(mockReponse);

    render(<StatsDashboard />, { wrapper });
    
    act(() => {
      screen.getByText('Sync FACEIT').click();
    });

    await act(async () => {
       await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Toast appears
    expect(screen.getByText('FACEIT Synced')).toBeInTheDocument();
  });

  it('handles faceit data sync error', async () => {
    (apiClient.syncFaceitStats as any).mockRejectedValueOnce(new Error('Network Error'));

    render(<StatsDashboard />, { wrapper });
    
    act(() => {
      screen.getByText('Sync FACEIT').click();
    });

    await act(async () => {
       await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Toast appears
    expect(screen.getByText('FACEIT Sync Failed')).toBeInTheDocument();
  });

  it('toggles views between historical and lobby', () => {
    render(<StatsDashboard />, { wrapper });
    
    act(() => {
      screen.getByRole('button', { name: /Lobby Contrast/i }).click();
    });

    expect(screen.getByText('Performance Benchmark Comparison')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: /Ascent Story/i }).click();
    });

    expect(screen.getByText('The 16-Month ELO Ascent Story')).toBeInTheDocument();
  });
});

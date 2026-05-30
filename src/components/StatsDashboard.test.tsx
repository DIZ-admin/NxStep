import { screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatsDashboard } from './StatsDashboard';
import { renderWithProviders as render } from '../utils/test-utils';
import { apiClient } from '../api';

vi.mock('../firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  getDocs: vi.fn().mockResolvedValue([]),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
}));

vi.mock('../api', () => ({
  apiClient: {
    syncFaceitStats: vi.fn(),
    fetchFaceitHistory: vi.fn().mockResolvedValue({ success: true, matches: [] }),
    fetchPortfolioData: vi.fn().mockResolvedValue({
      stats: {}, maps: [], segments: [], experiences: [], medias: []
    }),
  },
}));

vi.mock('../services/firebaseService', () => ({
  firebaseService: {
    saveFaceitStats: vi.fn().mockResolvedValue(undefined),
    initAnonymousSession: vi.fn().mockResolvedValue(undefined),
    getLatestFaceitMatchDate: vi.fn().mockResolvedValue(null),
    saveFaceitMatches: vi.fn().mockResolvedValue(undefined),
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
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders stats dashboard', () => {
    render(<StatsDashboard />);
    expect(screen.getByText(/Sync FACEIT/i)).toBeInTheDocument();
  });

  it('syncs faceit data successfully', async () => {
    localStorage.setItem("faceit_last_sync_timestamp", String(Date.now()));
    const mockReponse = { success: true, stats: { matches: 500 } };
    (apiClient.syncFaceitStats as any).mockResolvedValueOnce(mockReponse);

    render(<StatsDashboard />);
    
    act(() => {
      screen.getByText('Sync FACEIT').click();
    });

    await act(async () => {
       await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Toast appears
    expect(await screen.findByText('FACEIT Synced')).toBeInTheDocument();
  });

  it('handles faceit data sync error', async () => {
    (apiClient.syncFaceitStats as any).mockRejectedValueOnce(new Error('Network Error'));

    render(<StatsDashboard />);
    
    act(() => {
      screen.getByText('Sync FACEIT').click();
    });

    await act(async () => {
       await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Toast appears
    expect(await screen.findByText('FACEIT Sync Failed')).toBeInTheDocument();
  });

  it('toggles views between historical and lobby', () => {
    render(<StatsDashboard />);
    
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

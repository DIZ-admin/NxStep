import { screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatchHistoryView } from './MatchHistoryView';
import { renderWithProviders as render } from '../../utils/test-utils';
import { getDocs } from 'firebase/firestore';

vi.mock('../../firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn()
}));

const mockMatchRecord = {
  data: () => ({
    matchId: '1',
    username: 'NxStep',
    date: Date.now(),
    map: 'de_mirage',
    kills: 20,
    deaths: 10,
    kd: 2,
    result: 'W',
    elo: 2500,
    stats: {
      headshots: '50',
      tripleKills: '1',
      quadKills: '0',
      aces: '0',
      mvps: '3'
    }
  })
};

describe('MatchHistoryView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then historical matches', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce([mockMatchRecord] as any);
    render(<MatchHistoryView lang="en" />);
    
    expect(screen.getByText('Querying Firebase Match history...')).toBeInTheDocument();
    
    const elements = await screen.findAllByText(/de_mirage/i);
    expect(elements[0]).toBeInTheDocument();
    
    const elos = screen.getAllByText(/2500/i);
    expect(elos[0]).toBeInTheDocument();
  });

  it('handles empty matches gracefully', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce([] as any);
    render(<MatchHistoryView lang="uk" />);
    
    await waitFor(() => {
      expect(screen.getByText('База даних матчів порожня')).toBeInTheDocument();
    });
  });

  it('handles and displays fetch error', async () => {
    vi.mocked(getDocs).mockRejectedValueOnce(new Error('Firebase broken'));
    render(<MatchHistoryView lang="en" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error Fetching Real-Time Matches/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Firebase broken')).toBeInTheDocument();
  });
});

import { screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HistoricalAscentPanel } from './HistoricalAscentPanel';
import { renderWithProviders as render } from '../../utils/test-utils';

vi.mock('./MatchHistoryView', () => ({
  MatchHistoryView: () => <div data-testid="match-history-view">MatchHistoryView Component</div>
}));

const mockStats = {
  kd: 1.5,
  matchesPlayed: 1000,
  winRate: '55%',
  headshots: '60%',
  currentElo: 3700,
  peakElo: 3800,
  averageKills: 20,
  tournamentsWon: 5
};

const mockT = {
  timelineEarly25: 'Early 2025',
  timelineLevel4: 'Level 4',
  timelineDesc25: 'Desc 25',
  timelineSetupBasic: 'Basic Setup',
  timelineMid25: 'Mid 2025',
  timelineLevel10: 'Level 10',
  timelineDescMid25: 'Desc Mid 25',
  timelineLate25: 'Late 25',
  timelineHigh10: 'High 10',
  timelineDescLate25: 'Desc late',
  timelineEarly26: 'Early 26',
  timelineChalElite: 'Challenger',
  timelineDescEarly26: 'Desc early 26',
  timelineSetupPro: '360Hz Setup',
  timelinePeak: 'Peak',
  timelinePeakRank: 'Peak Level',
  timelineDescPeak: 'Desc peak'
};
  
describe('HistoricalAscentPanel Component', () => {
  it('renders story tab by default', () => {
    render(<HistoricalAscentPanel stats={mockStats} t={mockT as any} />);
    
    expect(screen.getByText(/The 16-Month ELO Ascent Story/i)).toBeInTheDocument();
    
    // Check points
    expect(screen.getByText('Early 2025')).toBeInTheDocument();
  });

  it('switches to live tab and renders MatchHistoryView', () => {
    render(<HistoricalAscentPanel stats={mockStats} t={mockT as any} />);

    const liveTabButton = screen.getByText(/Вся статистика|Live Roster Tracker/i);
    fireEvent.click(liveTabButton);
    
    expect(screen.getByTestId('match-history-view')).toBeInTheDocument();
    expect(screen.queryByText(/The 16-Month ELO Ascent Story/i)).not.toBeInTheDocument();
    
    const storyTabButton = screen.getByText(/Хронологія ELO|Milestone Ascent/i);
    fireEvent.click(storyTabButton);
  });

  it('changes active point when clicking timeline button', () => {
    render(<HistoricalAscentPanel stats={mockStats} t={mockT as any} />);

    const button1 = screen.getByText('1');
    fireEvent.click(button1);
    
    expect(screen.getByText('Level 4')).toBeInTheDocument();
  });
});

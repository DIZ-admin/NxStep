import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/ToastContext';
import { firebaseService } from './services/firebaseService';

vi.mock('./services/firebaseService', () => ({
  firebaseService: {
    initAnonymousSession: vi.fn(),
  }
}));

vi.mock('motion/react', () => ({
  __esModule: true,
  motion: {
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('react-markdown', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

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

describe('App Component', () => {
  it('renders the complete application', () => {
    window.scrollTo = vi.fn();
    
    render(
      <LanguageProvider>
        <ToastProvider>
          <PortfolioProvider>
            <App />
          </PortfolioProvider>
        </ToastProvider>
      </LanguageProvider>
    );

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText(/FACEIT VERIFIED/i)).toBeInTheDocument();
    expect(firebaseService.initAnonymousSession).toHaveBeenCalled();
  });
});

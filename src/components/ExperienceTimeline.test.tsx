import { screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTimeline } from './ExperienceTimeline';
import { renderWithProviders as render } from '../utils/test-utils';

describe('ExperienceTimeline Component', () => {
  it('renders experience cards and filters them', () => {
    render(<ExperienceTimeline />);

    // Initial render should contain "all" including active teams
    expect(screen.getByText('tokyo54 (stand-in)')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: /Trials/i }).click();
    });
    // the trials tab should render only trials type, such as B8 Prospects
    expect(screen.getByText('B8 Prospects & Inner Circle Prospects')).toBeInTheDocument();
  });
});

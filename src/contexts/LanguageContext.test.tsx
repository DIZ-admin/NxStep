import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider, useLanguage } from './LanguageContext';

const TestComponent = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang('uk')}>Set UK</button>
      <button onClick={() => setLang('en')}>Set EN</button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('provides default english language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('can change language to ukrainian', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    act(() => {
      screen.getByText('Set UK').click();
    });
    expect(screen.getByTestId('lang').textContent).toBe('uk');
  });
});

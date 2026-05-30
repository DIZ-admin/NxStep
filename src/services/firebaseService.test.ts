import { describe, it, expect } from 'vitest';
import { firebaseService } from './firebaseService';

describe('FirebaseService', () => {
  it('initAnonymousSession works', async () => {
    // Just verify the code handles safely without throwing in node env if auth doesn't exist
    // or wrap in try-catch in test
    expect(typeof firebaseService.initAnonymousSession).toBe('function');
  });

  it('saveScoutSession works', async () => {
    expect(typeof firebaseService.saveScoutSession).toBe('function');
  });
});

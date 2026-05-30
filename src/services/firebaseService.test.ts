import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firebaseService } from './firebaseService';
import { auth, db } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { setDoc, getDocs, writeBatch } from 'firebase/firestore';

vi.mock('../firebase', () => ({
  auth: { currentUser: { uid: '123' } },
  db: {},
  handleFirestoreError: vi.fn(),
  OperationType: { GET: 'GET', WRITE: 'WRITE' }
}));

vi.mock('firebase/auth', () => ({
  signInAnonymously: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
  writeBatch: vi.fn(() => ({ set: vi.fn(), commit: vi.fn() }))
}));

describe('FirebaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initAnonymousSession works', async () => {
    await firebaseService.initAnonymousSession();
    expect(signInAnonymously).toHaveBeenCalled();
  });

  it('initAnonymousSession handles error', async () => {
    vi.mocked(signInAnonymously).mockRejectedValueOnce(new Error('test'));
    await firebaseService.initAnonymousSession();
    expect(signInAnonymously).toHaveBeenCalled();
  });

  it('saveScoutSession saves correctly', async () => {
    await firebaseService.saveScoutSession('q', 'r');
    expect(setDoc).toHaveBeenCalled();
  });

  it('saveFaceitStats saves correctly', async () => {
    await firebaseService.saveFaceitStats('user', 1000, 10, 'http', 'http', {}, []);
    expect(setDoc).toHaveBeenCalledTimes(2);
  });
  
  it('saveFaceitStats handles missing elo', async () => {
    await firebaseService.saveFaceitStats('user', null, null, '', '', null, []);
    expect(setDoc).toHaveBeenCalledTimes(2);
  });

  it('getLatestFaceitMatchDate returns correct time', async () => {
    const mockDocs = [
      { data: () => ({ username: 'user', date: 100 }) },
      { data: () => ({ username: 'user', date: 200 }) },
      { data: () => ({ username: 'other', date: 300 }) }
    ];
    vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as any);
    
    const result = await firebaseService.getLatestFaceitMatchDate('user');
    expect(result).toBe(200);
  });

  it('getLatestFaceitMatchDate returns undefined if empty', async () => {
    vi.mocked(getDocs).mockResolvedValueOnce([] as any);
    const result = await firebaseService.getLatestFaceitMatchDate('user');
    expect(result).toBeUndefined();
  });

  it('saveFaceitMatches chunks and saves', async () => {
    const matches = Array(150).fill(0).map((_, i) => ({
      matchId: String(i),
      date: 1000,
      kills: 1,
      deaths: 1,
      kd: 1,
      result: 'W',
      elo: '100',
      stats: {}
    }));
    await firebaseService.saveFaceitMatches('user', matches);
    expect(writeBatch).toHaveBeenCalledTimes(2);
  });

  it('saveFaceitMatches handles errors', async () => {
    vi.mocked(writeBatch).mockImplementationOnce(() => {
      throw new Error('test fail');
    });
    await firebaseService.saveFaceitMatches('user', [{ matchId: '1' }]);
    expect(writeBatch).toHaveBeenCalled();
  });
});

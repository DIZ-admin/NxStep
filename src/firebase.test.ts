import { describe, it, expect, vi } from 'vitest';
import { handleFirestoreError, OperationType, auth } from './firebase';

describe('Firebase handleFirestoreError', () => {
  it('correctly extracts error message from Error instance and currentUser info', () => {
    // Mock currentUser info
    Object.defineProperty(auth, 'currentUser', {
      value: {
        uid: 'user-xyz',
        email: 'test@example.com',
        emailVerified: true,
        isAnonymous: false,
        tenantId: 'tenant-123',
        providerData: [
          { providerId: 'google.com', email: 'test@example.com' }
        ]
      },
      configurable: true,
      writable: true
    });

    const error = new Error('Database denied access');
    
    expect(() => {
      handleFirestoreError(error, OperationType.WRITE, 'users/123');
    }).toThrowError(/Database denied access/);

    try {
      handleFirestoreError(error, OperationType.WRITE, 'users/123');
    } catch (err: any) {
      const parsed = JSON.parse(err.message);
      expect(parsed.error).toBe('Database denied access');
      expect(parsed.operationType).toBe('write');
      expect(parsed.path).toBe('users/123');
      expect(parsed.authInfo.userId).toBe('user-xyz');
      expect(parsed.authInfo.email).toBe('test@example.com');
      expect(parsed.authInfo.emailVerified).toBe(true);
      expect(parsed.authInfo.isAnonymous).toBe(false);
      expect(parsed.authInfo.tenantId).toBe('tenant-123');
      expect(parsed.authInfo.providerInfo[0].providerId).toBe('google.com');
    }
  });

  it('handles unknown error types and null currentUser gracefully', () => {
    // Mock null currentUser
    Object.defineProperty(auth, 'currentUser', {
      value: null,
      configurable: true,
      writable: true
    });

    expect(() => {
      handleFirestoreError('String error message', OperationType.GET, null);
    }).toThrowError(/String error message/);

    try {
      handleFirestoreError('String error message', OperationType.GET, null);
    } catch (err: any) {
      const parsed = JSON.parse(err.message);
      expect(parsed.error).toBe('String error message');
      expect(parsed.operationType).toBe('get');
      expect(parsed.path).toBeNull();
      expect(parsed.authInfo.userId).toBeUndefined();
    }
  });
});

import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const firebaseService = {
  async initAnonymousSession() {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.warn("Failed anonymous auth", error);
    }
  },

  async saveScoutSession(query: string, reply: string) {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const sessionId = crypto.randomUUID();
      await setDoc(doc(db, "scoutSessions", sessionId), {
        userId: user.uid,
        query: query,
        response: reply,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to save to Firestore", e);
      handleFirestoreError(e, OperationType.WRITE, `scoutSessions/${auth.currentUser?.uid}`);
    }
  },

  async saveFaceitStats(
    username: string,
    elo: number | null,
    level: number | null,
    avatarUrl: string,
    coverImageUrl: string,
    stats: any,
    segments: any[]
  ) {
    try {
      const user = auth.currentUser;
      if (!user) {
        await this.initAnonymousSession();
      }
      
      const payload = {
        username,
        elo: elo !== null && !isNaN(elo) ? elo : null,
        level: level !== null && !isNaN(level) ? level : null,
        avatarUrl: avatarUrl || "",
        coverImageUrl: coverImageUrl || "",
        stats: stats || {},
        segments: segments || [],
        syncedAt: serverTimestamp()
      };

      // Write latest stats
      await setDoc(doc(db, "faceitStats", username), payload);

      // Write historical progression
      const historyId = crypto.randomUUID();
      await setDoc(doc(db, "faceitHistory", historyId), payload);

      console.log(`Successfully saved Faceit stats and history for player: ${username}`);
    } catch (e) {
      console.error("Failed to save Faceit stats to Firestore:", e);
      handleFirestoreError(e, OperationType.WRITE, `faceitStats/${username}`);
    }
  }
};


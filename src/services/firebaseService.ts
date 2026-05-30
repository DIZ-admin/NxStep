import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, serverTimestamp, writeBatch, collection, query, getDocs } from "firebase/firestore";

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
  },

  async getLatestFaceitMatchDate(username: string): Promise<number | undefined> {
    try {
      const q = query(collection(db, "faceitMatches"));
      const snapshot = await getDocs(q);
      
      let maxDate = 0;
      snapshot.forEach((doc) => {
        const m = doc.data();
        if (m.username === username && m.date && m.date > maxDate) {
          maxDate = m.date;
        }
      });
      
      return maxDate > 0 ? maxDate : undefined;
    } catch (e) {
      console.error("Failed to get latest match date:", e);
      handleFirestoreError(e, OperationType.GET, "faceitMatches");
      return undefined;
    }
  },

  async saveFaceitMatches(username: string, matches: any[]) {
    try {
      const user = auth.currentUser;
      if (!user) {
        await this.initAnonymousSession();
      }

      console.log(`[Firebase Service] Saving ${matches.length} matches to Firestore for user: ${username}`);
      
      const chunkSize = 100;
      for (let i = 0; i < matches.length; i += chunkSize) {
        const chunk = matches.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        
        for (const match of chunk) {
          const matchRef = doc(db, "faceitMatches", match.matchId);
          const payload = {
            matchId: match.matchId,
            username: username,
            date: Number(match.date) || Date.now(),
            map: match.map || "de_mirage",
            kills: Number(match.kills) || 0,
            deaths: Number(match.deaths) || 0,
            kd: Number(match.kd) || 0,
            result: match.result === "W" || match.result === "w" ? "W" : "L",
            elo: match.elo !== null && !isNaN(Number(match.elo)) ? Number(match.elo) : null,
            stats: match.stats || {}
          };
          batch.set(matchRef, payload);
         }
         
         await batch.commit();
         console.log(`[Firebase Service] Committed chunk ${i / chunkSize + 1} (${chunk.length} matches)`);
      }
      console.log(`[Firebase Service] Successfully saved all ${matches.length} matches to Firestore`);
    } catch (e) {
      console.error("Failed to save Faceit matches to Firestore:", e);
      handleFirestoreError(e, OperationType.WRITE, `faceitMatches`);
    }
  }
};


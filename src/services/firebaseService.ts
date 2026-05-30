import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
        createdAt: new Date().getTime()
      });
    } catch (e) {
      console.error("Failed to save to Firestore", e);
      handleFirestoreError(e, OperationType.WRITE, `scoutSessions/${auth.currentUser?.uid}`);
    }
  }
};

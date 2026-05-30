import { ChatMessage, PlayerStats } from "../types";

export interface SyncFaceitResponse {
  success: boolean;
  stats?: PlayerStats;
  error?: string;
}

export interface ScoutApiResponse {
  reply: string;
  error?: string;
  errorType?: string;
}

export class ApiError extends Error {
  errorType?: string;
  constructor(message: string, errorType?: string) {
    super(message);
    this.errorType = errorType;
    this.name = "ApiError";
  }
}

export const apiClient = {
  async fetchScoutResponse(message: string, history: ChatMessage[]): Promise<ScoutApiResponse> {
    const res = await fetch("/api/scout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new ApiError(result.error || "Failed AI request.", result.errorType);
    }
    return result;
  },

  async syncFaceitStats(username: string): Promise<SyncFaceitResponse> {
    const res = await fetch(`/api/faceit/sync?username=${encodeURIComponent(username)}`);
    const result = await res.json();
    if (!res.ok) {
      throw new ApiError("Failed to fetch Faceit stats", "SYNC_ERROR");
    }
    return result;
  }
};

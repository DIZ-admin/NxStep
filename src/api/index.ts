import { ChatMessage } from "../types";

export interface SyncFaceitResponse {
  success: boolean;
  username?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  elo?: number | null;
  level?: number | null;
  segments?: any[];
  stats?: any;
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
  },

  async fetchFaceitHistory(username: string, latestMatchDate?: number): Promise<{ success: boolean; username: string; matches: any[] }> {
    let url = `/api/faceit/history?username=${encodeURIComponent(username)}`;
    if (latestMatchDate !== undefined) {
      url += `&latestMatchDate=${latestMatchDate}`;
    }
    const res = await fetch(url);
    const result = await res.json();
    if (!res.ok) {
      throw new ApiError("Failed to fetch Faceit history", "SYNC_ERROR");
    }
    return result;
  }
};

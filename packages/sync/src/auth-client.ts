import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // If running in browser, default to localhost:4000 or the same host with port 4000
    const host = window.location.hostname || "localhost";
    return `http://${host}:4000`;
  }
  return "http://localhost:4000";
};

export const API_BASE_URL = getApiBaseUrl();

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [
    usernameClient(),
  ],
});

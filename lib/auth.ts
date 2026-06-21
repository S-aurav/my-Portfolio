/**
 * Auth utilities — manages JWT token in localStorage.
 * Single-owner: one admin, no user table.
 */

const TOKEN_KEY = "hq_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode payload (no verification — server does that)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<void> {
  let res;
  try {
    res = await fetch("/api/hq/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error("Unable to connect to the backend server. Please verify that the Spring Boot application is running on port 8080.");
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid credentials");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Server error (${res.status}). Please check backend status.`);
  }

  const data = await res.json().catch(() => {
    throw new Error("Invalid response format from server");
  });
  
  if (!data.data?.token) throw new Error("No token in response");
  setToken(data.data.token);
}

export function logout(): void {
  removeToken();
  window.location.href = "/admin";
}

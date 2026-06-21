/**
 * API client — fetch wrapper that automatically injects the JWT token.
 * All admin API calls go through this.
 */

import { getToken, logout } from "./auth";

const BASE = ""; // Requests go to /api/** which next.config.ts proxies to Spring Boot

type FetchOptions = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  // Auto-logout on 401
  if (res.status === 401) {
    logout();
    throw new Error("Session expired. Please log in again.");
  }

  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// ── Typed API helpers ─────────────────────────────────────────────────────────

export const adminApi = {
  // Routes
  getAllRoutes: () =>
    apiFetch<ApiListResponse<RouteEntry>>("/api/hq/admin/routes"),

  getRoutesByProject: (project: string) =>
    apiFetch<ApiListResponse<RouteEntry>>(`/api/hq/admin/routes/project/${project}`),

  createRoute: (body: RouteFormData) =>
    apiFetch<ApiItemResponse<RouteEntry>>("/api/hq/admin/routes", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateRoute: (id: string, body: RouteFormData) =>
    apiFetch<ApiItemResponse<RouteEntry>>(`/api/hq/admin/routes/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  toggleRoute: (id: string, enabled: boolean) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/routes/${id}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    }),

  deleteRoute: (id: string) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/routes/${id}`, {
      method: "DELETE",
    }),

  // Docs
  getDocs: (routeId: string) =>
    apiFetch<ApiItemResponse<RouteDoc>>(`/api/hq/admin/routes/${routeId}/docs`),

  saveDocs: (routeId: string, body: RouteDocData) =>
    apiFetch<ApiItemResponse<RouteDoc>>(`/api/hq/admin/routes/${routeId}/docs`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type RouteEntry = {
  id: string;
  project: string;
  module: string;
  operation: string;
  fullPath: string;
  method: string;
  description: string | null;
  tags: string | null;
  enabled: boolean;
  requiresAuth: boolean;
  autoRegistered: boolean;
  stale: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RouteFormData = Omit<RouteEntry, "id" | "createdAt" | "updatedAt" | "autoRegistered" | "stale">;

export type RouteDoc = {
  id: string;
  routeId: string;
  requestBody: string | null;
  responseBody: string | null;
  pathVariables: string | null;
  queryParams: string | null;
  requestHeaders: string | null;
  exampleRequest: string | null;
  exampleResponse: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RouteDocData = Omit<RouteDoc, "id" | "routeId" | "createdAt" | "updatedAt">;

type ApiListResponse<T> = { success: boolean; message: string; data: T[] };
type ApiItemResponse<T> = { success: boolean; message: string; data: T };

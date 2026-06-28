/**
 * API client — fetch wrapper that automatically injects the JWT token.
 * All admin API calls go through this.
 */

import { getToken, logout } from "./auth";

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || "http://localhost:8080";
  }
  return "";
};

// ── In-Memory Public API Cache ────────────────────────────────────────────────
// Caches GET responses for public endpoints across client-side navigations.
// The module is loaded once per browser session, so the Map persists as long
// as the tab is open. TTL defaults to 60 seconds.

const CACHE_TTL_MS = 60_000;

type CacheEntry = { data: unknown; ts: number };
const _cache = new Map<string, CacheEntry>();
const _inflight = new Map<string, Promise<unknown>>();

/**
 * Fetches a public (no-auth) endpoint with in-memory caching.
 * Concurrent callers for the same URL share a single in-flight Promise,
 * so even if three components call getProfile() simultaneously only one
 * network request is made.
 */
async function cachedPublicFetch<T>(path: string): Promise<T> {
  // Bypass in-memory cache on the server side (Node.js)
  if (typeof window === "undefined") {
    return apiFetch<T>(path, { skipAuth: true });
  }

  // Return a valid cached result immediately
  const hit = _cache.get(path);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) {
    return hit.data as T;
  }

  // Deduplicate concurrent requests for the same URL
  if (_inflight.has(path)) {
    return _inflight.get(path) as Promise<T>;
  }

  const promise = apiFetch<T>(path, { skipAuth: true }).then((data) => {
    _cache.set(path, { data, ts: Date.now() });
    _inflight.delete(path);
    return data;
  }).catch((err) => {
    _inflight.delete(path);
    throw err;
  });

  _inflight.set(path, promise);
  return promise;
}

/**
 * Invalidates one or more public cache entries by URL path.
 * Call this after a successful admin write/mutation so the next read
 * reflects the updated data.
 */
export function invalidatePublicCache(...paths: string[]): void {
  paths.forEach(p => _cache.delete(p));
}

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

  if (fetchOptions.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}${path}`, {
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

  // Projects
  getAllProjects: () =>
    apiFetch<ApiListResponse<ProjectEntry>>("/api/hq/admin/projects"),

  createProject: (body: ProjectFormData) =>
    apiFetch<ApiItemResponse<ProjectEntry>>("/api/hq/admin/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/projects"); return res; }),

  updateProject: (id: string, body: ProjectFormData) =>
    apiFetch<ApiItemResponse<ProjectEntry>>(`/api/hq/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/projects"); return res; }),

  deleteProject: (id: string) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/projects/${id}`, {
      method: "DELETE",
    }).then((res) => { invalidatePublicCache("/api/portfolio/projects"); return res; }),

  // Notes
  getAllNotes: () =>
    apiFetch<ApiListResponse<NoteEntry>>("/api/hq/admin/notes"),

  createNote: (body: NoteFormData) =>
    apiFetch<ApiItemResponse<NoteEntry>>("/api/hq/admin/notes", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/notes"); return res; }),

  updateNote: (id: string, body: NoteFormData) =>
    apiFetch<ApiItemResponse<NoteEntry>>(`/api/hq/admin/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/notes"); return res; }),

  deleteNote: (id: string) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/notes/${id}`, {
      method: "DELETE",
    }).then((res) => { invalidatePublicCache("/api/portfolio/notes"); return res; }),

  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<ApiItemResponse<{ url: string }>>("/api/hq/admin/files/upload", {
      method: "POST",
      body: formData,
    });
  },

  // Profile
  getProfile: () =>
    apiFetch<ApiItemResponse<ProfileEntry>>("/api/hq/admin/profile"),

  saveProfile: (body: ProfileFormData) =>
    apiFetch<ApiItemResponse<ProfileEntry>>("/api/hq/admin/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => {
      invalidatePublicCache("/api/portfolio/profile");
      return res;
    }),

  // Skills
  getAllSkills: () =>
    apiFetch<ApiListResponse<SkillEntry>>("/api/hq/admin/skills"),

  createSkill: (body: SkillFormData) =>
    apiFetch<ApiItemResponse<SkillEntry>>("/api/hq/admin/skills", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/skills"); return res; }),

  updateSkill: (id: string, body: SkillFormData) =>
    apiFetch<ApiItemResponse<SkillEntry>>(`/api/hq/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/skills"); return res; }),

  deleteSkill: (id: string) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/skills/${id}`, {
      method: "DELETE",
    }).then((res) => { invalidatePublicCache("/api/portfolio/skills"); return res; }),

  // Experience
  getAllExperience: () =>
    apiFetch<ApiListResponse<ExperienceEntry>>("/api/hq/admin/experience"),

  createExperience: (body: ExperienceFormData) =>
    apiFetch<ApiItemResponse<ExperienceEntry>>("/api/hq/admin/experience", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/experience"); return res; }),

  updateExperience: (id: string, body: ExperienceFormData) =>
    apiFetch<ApiItemResponse<ExperienceEntry>>(`/api/hq/admin/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/experience"); return res; }),

  deleteExperience: (id: string) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/experience/${id}`, {
      method: "DELETE",
    }).then((res) => { invalidatePublicCache("/api/portfolio/experience"); return res; }),

  // Certifications
  getAllCertifications: () =>
    apiFetch<ApiListResponse<CertificationEntry>>("/api/hq/admin/certifications"),

  createCertification: (body: CertificationFormData) =>
    apiFetch<ApiItemResponse<CertificationEntry>>("/api/hq/admin/certifications", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/certifications"); return res; }),

  updateCertification: (id: string, body: CertificationFormData) =>
    apiFetch<ApiItemResponse<CertificationEntry>>(`/api/hq/admin/certifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => { invalidatePublicCache("/api/portfolio/certifications"); return res; }),

  deleteCertification: (id: string) =>
    apiFetch<ApiItemResponse<null>>(`/api/hq/admin/certifications/${id}`, {
      method: "DELETE",
    }).then((res) => { invalidatePublicCache("/api/portfolio/certifications"); return res; }),
};

export const publicApi = {
  getProjects: () =>
    cachedPublicFetch<ApiListResponse<ProjectEntry>>("/api/portfolio/projects"),

  getNotes: () =>
    cachedPublicFetch<ApiListResponse<NoteEntry>>("/api/portfolio/notes"),

  getProfile: () =>
    cachedPublicFetch<ApiItemResponse<ProfileEntry>>("/api/portfolio/profile"),

  getSkills: () =>
    cachedPublicFetch<ApiListResponse<SkillEntry>>("/api/portfolio/skills"),

  getExperience: () =>
    cachedPublicFetch<ApiListResponse<ExperienceEntry>>("/api/portfolio/experience"),

  getCertifications: () =>
    cachedPublicFetch<ApiListResponse<CertificationEntry>>("/api/portfolio/certifications"),
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

export type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  techStack: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFormData = Omit<ProjectEntry, "id" | "createdAt" | "updatedAt">;

export type NoteEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  createdAt: string;
  updatedAt: string;
};

export type NoteFormData = Omit<NoteEntry, "id" | "createdAt" | "updatedAt">;

export type ProfileEntry = {
  id: number;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  githubUrl: string;
  linkedinUrl: string;
  leetcodeUrl: string;
  sectionOrder: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileFormData = Omit<ProfileEntry, "id" | "createdAt" | "updatedAt">;

export type SkillEntry = {
  id: string;
  category: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SkillFormData = Omit<SkillEntry, "id" | "createdAt" | "updatedAt">;

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  duration: string;
  type: string;
  location: string;
  highlights: string;   // JSON string: ["point1","point2"]
  techStack: string;    // JSON string: ["Java","Spring"]
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ExperienceFormData = Omit<ExperienceEntry, "id" | "createdAt" | "updatedAt">;

export type CertificationEntry = {
  id: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CertificationFormData = Omit<CertificationEntry, "id" | "createdAt" | "updatedAt">;

type ApiListResponse<T> = { success: boolean; message: string; data: T[] };
type ApiItemResponse<T> = { success: boolean; message: string; data: T };

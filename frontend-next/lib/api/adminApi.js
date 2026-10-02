"use client";

import { apiClient } from "./client";

const TOKEN_KEY = "smkn2-admin-token";

export const adminToken = {
  get() {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // penyimpanan diblokir; sesi hanya berlaku sampai halaman dimuat ulang
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // abaikan
    }
  },
};

/**
 * Ubah objek bersarang menjadi FormData ala Laravel:
 * { gallery: [file, "/x.jpg"], testimonial: { quote } } -> gallery[0], gallery[1], testimonial[quote].
 * Daftar kosong dikirim sebagai string kosong agar backend tahu isinya dihapus.
 */
export function toFormData(values, form = new FormData(), prefix = "") {
  Object.entries(values).forEach(([key, value]) => {
    const name = prefix ? `${prefix}[${key}]` : key;
    if (value === undefined) return;

    if (value === null) {
      form.append(name, "");
    } else if (value instanceof Blob) {
      form.append(name, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) form.append(name, "");
      value.forEach((item, index) => {
        if (item !== null && typeof item === "object" && !(item instanceof Blob)) toFormData(item, form, `${name}[${index}]`);
        else form.append(`${name}[${index}]`, item ?? "");
      });
    } else if (typeof value === "object") {
      toFormData(value, form, name);
    } else if (typeof value === "boolean") {
      form.append(name, value ? "1" : "0");
    } else {
      form.append(name, value);
    }
  });
  return form;
}

async function request(endpoint, { method = "GET", body, json } = {}) {
  const token = adminToken.get();
  try {
    const response = await apiClient(`/api/v1/admin${endpoint}`, {
      method,
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: json ? JSON.stringify(json) : body,
    });
    return response.data;
  } catch (error) {
    if (error.status === 401 && typeof window !== "undefined" && !endpoint.startsWith("/auth/login")) {
      adminToken.clear();
      const next = encodeURIComponent(window.location.pathname);
      window.location.replace(`/login?next=${next}&expired=1`);
    }
    throw error;
  }
}

/** CRUD standar untuk satu modul konten admin. */
function resource(path) {
  return {
    list: () => request(`/${path}`),
    get: (id) => request(`/${path}/${encodeURIComponent(id)}`),
    create: (values) => request(`/${path}`, { method: "POST", body: toFormData(values) }),
    // POST + multipart agar unggahan berkas tetap terbaca Laravel saat update
    update: (id, values) => request(`/${path}/${encodeURIComponent(id)}`, { method: "POST", body: toFormData(values) }),
    remove: (id) => request(`/${path}/${encodeURIComponent(id)}`, { method: "DELETE" }),
  };
}

export const adminApi = {
  async login(login, password) {
    const data = await request("/auth/login", { method: "POST", json: { login, password } });
    adminToken.set(data.token);
    return data.user;
  },
  me: () => request("/auth/me"),
  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      adminToken.clear();
    }
  },
  dashboard: () => request("/dashboard"),
  majors: resource("majors"),
  achievements: resource("achievements"),
  extracurriculars: resource("extracurriculars"),
  articles: resource("articles"),
  jobs: resource("jobs"),
  alumni: resource("alumni"),
  aspirations: {
    list: () => request("/aspirations"),
    get: (id) => request(`/aspirations/${id}`),
    respond: (id, values) => request(`/aspirations/${id}`, { method: "PUT", json: values }),
    remove: (id) => request(`/aspirations/${id}`, { method: "DELETE" }),
  },
};

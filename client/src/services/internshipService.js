// src/services/internshipService.js
// Provides CRUD for internships for admin and listing/apply for students.

const origin = typeof window !== "undefined" ? window.location.origin : "";
let defaultBase = origin ? `${origin}/api` : "";
if (origin === "http://localhost:5173") {
  defaultBase = "http://localhost:5001/api";
}
const BASE_URL = import.meta?.env?.VITE_API_URL || defaultBase;
const INTERNSHIPS_URL = `${BASE_URL}/internships`;

function getAuthToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

function getAdminToken() {
  return (
    sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken")
  );
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function adminAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  console.log("Response status:", res.status);
  console.log("Response headers:", Object.fromEntries(res.headers.entries()));

  const isJson = res.headers.get("content-type")?.includes("application/json");
  console.log("Is JSON response:", isJson);

  const data = isJson
    ? await res.json().catch((e) => {
        console.error("JSON parse error:", e);
        return null;
      })
    : null;

  console.log("Parsed response data:", data);

  if (!res.ok) {
    const message =
      data?.message || data?.error || res.statusText || `HTTP ${res.status}`;
    const status = res.status;
    const err = new Error(message);
    err.status = status;
    err.data = data;
    err.url = res.url;
    err.method = res.request?.method;
    throw err;
  }
  return data;
}

// Local fallback storage key
const LS_KEY = "litera_internships";

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export async function listInternships() {
  try {
    // Check if we have an admin token to use admin endpoint
    const adminToken = getAdminToken();
    const url = adminToken ? `${BASE_URL}/admin/internships` : INTERNSHIPS_URL;
    const headers = adminToken ? adminAuthHeaders() : authHeaders();
    
    console.log("Fetching internships from:", url);
    console.log("Using admin endpoint:", !!adminToken);

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { ...headers },
    });

    console.log("Raw response status:", res.status);
    console.log("Raw response ok:", res.ok);

    const result = await handleResponse(res);
    console.log("List internships success:", result);

    // If result is null, try to get the response text
    if (result === null) {
      const text = await res.text();
      console.log("Response text:", text);
      throw new Error("Received null response from server");
    }

    return result; // { status, data: { internships } }
  } catch (e) {
    console.error("Internships API error:", {
      status: e.status,
      message: e.message,
      url: e.url,
      data: e.data,
    });

    // If access is forbidden/unauthorized, bubble up so UI can lock
    if (e.status === 401 || e.status === 403) {
      throw e;
    }

    // fallback to local storage for other failures (e.g., network)
    const data = readLocal();
    return { status: "ok", data: { internships: data } };
  }
}

export async function createInternship(payload) {
  // payload: { name, company, role, stipend, description, contactNumber, contactEmail, applyUrl }
  try {
    console.log("Creating internship with payload:", payload);

    // Use admin endpoint if admin token is available
    const adminToken = getAdminToken();
    const url = adminToken ? `${BASE_URL}/admin/internships` : INTERNSHIPS_URL;
    const headers = adminToken ? adminAuthHeaders() : authHeaders();

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Raw response status:", res.status);
    console.log("Raw response ok:", res.ok);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const result = await handleResponse(res);
    console.log("Create internship success:", result);

    // If result is null, try to get the response text
    if (result === null) {
      const text = await res.text();
      console.log("Response text:", text);
      throw new Error("Received null response from server");
    }

    return result; // { status, data: { internship } }
  } catch (e) {
    console.error("Create internship API error:", {
      status: e.status,
      message: e.message,
      url: e.url,
      data: e.data,
      payload,
    });

    // Only fallback to local storage if it's a network error, not a validation error
    if (e.status >= 500 || !e.status) {
      const existing = readLocal();
      const newItem = {
        id: crypto.randomUUID?.() || String(Date.now()),
        createdAt: new Date().toISOString(),
        ...payload,
      };
      const next = [newItem, ...existing];
      writeLocal(next);
      return { status: "ok", data: { internship: newItem } };
    }

    // Re-throw validation errors and other client errors
    throw e;
  }
}

export async function deleteInternship(id) {
  try {
    // Use admin endpoint if admin token is available
    const adminToken = getAdminToken();
    const url = adminToken ? `${BASE_URL}/admin/internships/${id}` : `${INTERNSHIPS_URL}/${id}`;
    const headers = adminToken ? adminAuthHeaders() : authHeaders();

    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: { ...headers },
    });
    return handleResponse(res); // { status, message }
  } catch (e) {
    if (e && e.status) {
      console.error("Delete internship API error:", {
        status: e.status,
        message: e.message,
        url: e.url,
        data: e.data,
      });
    }
    const existing = readLocal();
    const next = existing.filter((i) => i.id !== id);
    writeLocal(next);
    return { status: "ok", message: "deleted" };
  }
}

export async function updateInternship(id, payload) {
  try {
    // Use admin endpoint if admin token is available
    const adminToken = getAdminToken();
    const url = adminToken ? `${BASE_URL}/admin/internships/${id}` : `${INTERNSHIPS_URL}/${id}`;
    const headers = adminToken ? adminAuthHeaders() : authHeaders();

    const res = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res); // { status, data: { internship } }
  } catch (e) {
    if (e && e.status) {
      console.error("Update internship API error:", {
        status: e.status,
        message: e.message,
        url: e.url,
        data: e.data,
      });
    }
    const existing = readLocal();
    const idx = existing.findIndex((i) => i.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...payload };
      writeLocal(existing);
      return { status: "ok", data: { internship: existing[idx] } };
    }
    throw e;
  }
}

export async function applyToInternship(id) {
  // This is mainly for tracking; primary action is client-side redirect to applyUrl
  try {
    const res = await fetch(`${INTERNSHIPS_URL}/${id}/apply`, {
      method: "POST",
      credentials: "include",
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  } catch (e) {
    return { status: "ok" };
  }
}

export function validateInternshipForm(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Internship name is required";
  if (!values.company?.trim()) errors.company = "Company name is required";
  if (!values.role?.trim()) errors.role = "Job role is required";
  if (!values.description?.trim())
    errors.description = "Description is required";
  if (!values.contactNumber?.trim())
    errors.contactNumber = "Contact number is required";
  if (!values.contactEmail?.trim())
    errors.contactEmail = "Contact e-mail is required";
  if (
    values.contactEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)
  )
    errors.contactEmail = "Invalid e-mail";
  if (values.applyUrl && !/^https?:\/\//i.test(values.applyUrl))
    errors.applyUrl = "Apply URL must start with http(s)";
  return errors;
}

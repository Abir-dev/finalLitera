const origin = typeof window !== "undefined" ? window.location.origin : "";
let defaultBase = origin ? `${origin}/api` : "";
if (origin === "http://localhost:5173") {
  defaultBase = "http://localhost:5001/api";
}
const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || defaultBase;
const WALLET_ADMIN = `${BASE_URL}/wallet/admin`;

function getAdminToken() {
  return (
    sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken")
  );
}

function adminAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok) {
    const message =
      data?.message || data?.error || res.statusText || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data?.data ?? data;
}

export async function listCoinSettings() {
  const res = await fetch(`${WALLET_ADMIN}/coins`, {
    method: "GET",
    credentials: "include",
    headers: { ...adminAuthHeaders() },
  });
  return handleResponse(res);
}

export async function createCoinSetting(payload) {
  const res = await fetch(`${WALLET_ADMIN}/coins`, {
    method: "POST",
    credentials: "include",
    headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateCoinSetting(id, payload) {
  const res = await fetch(`${WALLET_ADMIN}/coins/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteCoinSetting(id) {
  const res = await fetch(`${WALLET_ADMIN}/coins/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { ...adminAuthHeaders() },
  });
  return handleResponse(res);
}

// USER wallet endpoints
function getUserToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

function userAuthHeaders() {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUserWallet(userId) {
  const res = await fetch(`${BASE_URL}/wallet/users/${userId}/wallet`, {
    method: "GET",
    credentials: "include",
    headers: { ...userAuthHeaders() },
  });
  return handleResponse(res);
}

// Admin assign/revoke helpers (optional for admin UI flows)
export async function adminAssignCoins(userId, payload) {
  const res = await fetch(`${WALLET_ADMIN}/students/${userId}/wallet/assign`, {
    method: "POST",
    credentials: "include",
    headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function adminRevokeCoins(userId, payload) {
  const res = await fetch(`${WALLET_ADMIN}/students/${userId}/wallet/revoke`, {
    method: "POST",
    credentials: "include",
    headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function adminGetStudentWallet(userId) {
  const res = await fetch(`${WALLET_ADMIN}/students/${userId}/wallet`, {
    method: "GET",
    credentials: "include",
    headers: { ...adminAuthHeaders() },
  });
  return handleResponse(res);
}

import { ref } from 'vue';
import { fetchWithFallback } from '../lib/apiClient.js';

const ADMIN_KEY = 'cookafrica_admin_token';
const PROMOTEUR_TOKEN_KEY = 'cookafrica_promoteur_token';
const PROMOTEUR_PROFILE_KEY = 'cookafrica_promoteur_profile';

function readJSON(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

export const adminToken = ref(localStorage.getItem(ADMIN_KEY) || '');
export const promoteurToken = ref(localStorage.getItem(PROMOTEUR_TOKEN_KEY) || '');
export const promoteurProfile = ref(readJSON(PROMOTEUR_PROFILE_KEY));

export function setAdminToken(token) {
  adminToken.value = token;
  if (token) localStorage.setItem(ADMIN_KEY, token);
  else localStorage.removeItem(ADMIN_KEY);
}

export function setPromoteurSession(token, profile) {
  promoteurToken.value = token;
  promoteurProfile.value = profile;
  if (token) {
    localStorage.setItem(PROMOTEUR_TOKEN_KEY, token);
    localStorage.setItem(PROMOTEUR_PROFILE_KEY, JSON.stringify(profile || null));
  } else {
    localStorage.removeItem(PROMOTEUR_TOKEN_KEY);
    localStorage.removeItem(PROMOTEUR_PROFILE_KEY);
  }
}

async function apiFetch(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchWithFallback(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || `Erreur ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function adminLogin(password) {
  const { token } = await apiFetch('/api/auth/admin/login', { method: 'POST', body: { password } });
  setAdminToken(token);
  return token;
}

export async function promoteurLogin(username, password) {
  const { token, promoter } = await apiFetch('/api/auth/promoteur/login', { method: 'POST', body: { username, password } });
  setPromoteurSession(token, promoter);
  return { token, promoter };
}

export function adminLogout() { setAdminToken(''); }
export function promoteurLogout() { setPromoteurSession('', null); }

export { apiFetch };

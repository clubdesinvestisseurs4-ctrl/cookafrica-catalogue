// Redondance d'hébergement du backend (Render en principal, Cloud Run en secours, ou
// l'inverse selon VITE_API_URL / VITE_API_URL_FALLBACK). On essaie la base principale,
// et si elle est inaccessible ou répond en erreur serveur (5xx), on retente sur la base
// de secours avant d'abandonner.
const RAW_BASES = [import.meta.env.VITE_API_URL, import.meta.env.VITE_API_URL_FALLBACK];
export const API_BASES = [...new Set(RAW_BASES.filter(Boolean))];

export async function fetchWithFallback(path, { timeoutMs = 8000, ...init } = {}) {
  const bases = API_BASES.length ? API_BASES : [''];
  let lastError;

  for (const base of bases) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(`${base}${path}`, { ...init, signal: controller.signal });
      clearTimeout(timer);
      if (res.status >= 500) {
        lastError = new Error(`Erreur serveur ${res.status}`);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Aucune base API disponible.');
}

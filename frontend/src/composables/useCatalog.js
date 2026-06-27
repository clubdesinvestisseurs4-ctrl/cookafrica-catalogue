import { ref } from 'vue';
import { catalog as fallbackCatalog } from '../data/catalog.js';
import { API_BASES, fetchWithFallback } from '../lib/apiClient.js';

// Charge le catalogue depuis l'API (Firestore, via le backend — Render puis Cloud Run en
// secours) avec repli automatique sur les données embarquées si aucun des deux backends
// n'est disponible ou si VITE_API_URL n'est pas configuré.
export function useCatalog() {
  const data = ref(null);
  const source = ref('bundled');
  const loading = ref(true);
  const error = ref(null);

  async function load() {
    if (API_BASES.length) {
      try {
        const res = await fetchWithFallback('/api/catalog', { timeoutMs: 2500 });
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.pages) && json.pages.length) {
            data.value = json;
            source.value = 'api';
            loading.value = false;
            return;
          }
        }
      } catch (err) {
        error.value = err;
        // silencieux : on retombe sur les données embarquées ci-dessous
      }
    }
    data.value = fallbackCatalog;
    source.value = 'bundled';
    loading.value = false;
  }

  load();

  return { data, source, loading, error };
}

export function resolveImage(image) {
  if (!image) return '';
  if (/^https?:\/\//.test(image) || image.startsWith('/')) return image;
  return `/assets/pages/${image}`;
}

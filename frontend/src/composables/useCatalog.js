import { ref } from 'vue';
import { catalog as fallbackCatalog } from '../data/catalog.js';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Charge le catalogue depuis l'API (Firestore, via le backend) avec repli automatique
// sur les données embarquées si l'API est indisponible ou non configurée (VITE_API_URL vide).
export function useCatalog() {
  const data = ref(null);
  const source = ref('bundled');
  const loading = ref(true);
  const error = ref(null);

  async function load() {
    if (API_BASE) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(`${API_BASE}/api/catalog`, { signal: controller.signal });
        clearTimeout(timeout);
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

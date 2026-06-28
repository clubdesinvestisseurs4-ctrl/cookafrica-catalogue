import { createApp } from 'vue';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import router from './router.js';
import './style.css';

// immediate: true — dès qu'une nouvelle version est déployée, le nouveau Service Worker prend
// le contrôle et recharge automatiquement tous les onglets ouverts, sans attendre une seconde
// visite. Sans cet enregistrement explicite, la mise à jour s'installe en arrière-plan mais ne
// s'applique qu'au prochain rechargement manuel (vieille version visible entre-temps).
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return;

    // Les navigateurs mobiles (surtout iOS) ne revérifient pas toujours en arrière-plan de
    // façon fiable, surtout si l'app reste simplement ouverte sans être rechargée. On force
    // donc une vérification active du fichier sw.js (en contournant tout cache HTTP), à chaque
    // retour au premier plan et toutes les 60s tant que l'app reste ouverte.
    const checkForUpdate = async () => {
      if (registration.installing || !navigator.onLine) return;
      try {
        const resp = await fetch(swUrl, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
        if (resp.status === 200) await registration.update();
      } catch { /* hors-ligne ou requête échouée : on retentera au prochain déclencheur */ }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    });
    setInterval(checkForUpdate, 60 * 1000);
  },
});

createApp(App).use(router).mount('#app');

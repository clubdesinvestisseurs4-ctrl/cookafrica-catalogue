import { createApp } from 'vue';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import router from './router.js';
import './style.css';

// immediate: true — dès qu'une nouvelle version est déployée, le nouveau Service Worker prend
// le contrôle et recharge automatiquement tous les onglets ouverts, sans attendre une seconde
// visite. Sans cet enregistrement explicite, la mise à jour s'installe en arrière-plan mais ne
// s'applique qu'au prochain rechargement manuel (vieille version visible entre-temps).
registerSW({ immediate: true });

createApp(App).use(router).mount('#app');

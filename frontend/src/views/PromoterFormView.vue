<template>
  <div class="shell">
    <header class="bar">
      <div class="who">
        <img class="logo-mark" src="/assets/logo-cookafrica.jpeg" alt="Cook Africa" />
        <div>
          <strong>{{ profile?.displayName || 'Chef promoteur' }}</strong>
          <small>Espace de collecte des fiches clients</small>
        </div>
      </div>
      <button class="logout" @click="logout">Déconnexion</button>
    </header>

    <main class="content">
      <p class="hint">Remplissez une fiche par client rencontré — le formulaire se réinitialise après chaque envoi.</p>
      <div class="form-frame">
        <LeadFormPage :token="promoteurToken" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import LeadFormPage from '../components/LeadFormPage.vue';
import { promoteurToken, promoteurProfile, promoteurLogout } from '../composables/useAuth.js';

const router = useRouter();
const profile = promoteurProfile;

function logout() {
  promoteurLogout();
  router.replace('/promoteur/login');
}
</script>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at top, var(--red) 0%, var(--red-dark) 70%);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  padding-top: max(0.75rem, env(safe-area-inset-top));
  border-bottom: 2px solid var(--gold);
}

.who { display: flex; align-items: center; gap: 0.6rem; color: var(--cream); }
.logo-mark {
  display: block;
  width: 2.4rem; height: 2.4rem;
  object-fit: cover;
  border: 1.5px solid var(--gold); border-radius: 0.45rem;
  flex-shrink: 0;
}
.who strong { display: block; color: var(--gold-soft); font-size: 0.95rem; }
.who small { display: block; opacity: 0.85; font-size: 0.72rem; }

.logout {
  background: transparent;
  border: 1px solid var(--gold);
  color: var(--gold-soft);
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  min-height: 36px;
  transition: background 0.2s, transform 0.1s;
}
.logout:active { transform: scale(0.96); }

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1rem 2rem;
  gap: 0.9rem;
}

.hint { color: var(--gold-soft); font-size: 0.85rem; text-align: center; max-width: 360px; margin: 0; }

.form-frame {
  width: 100%;
  max-width: 380px;
  height: min(70vh, 640px);
  border-radius: 0.85rem;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  animation: form-frame-in 0.35s ease-out;
}

@keyframes form-frame-in {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>

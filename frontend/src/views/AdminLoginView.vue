<template>
  <AuthLayout title="Espace administrateur">
    <form class="form" @submit.prevent="submit">
      <label class="f">
        <span>Mot de passe</span>
        <input v-model="password" type="password" autocomplete="current-password" required autofocus />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="submit" type="submit" :disabled="loading">{{ loading ? 'Connexion…' : 'Se connecter' }}</button>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthLayout from '../components/AuthLayout.vue';
import { adminLogin } from '../composables/useAuth.js';

const router = useRouter();
const route = useRoute();
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await adminLogin(password.value);
    router.replace(route.query.redirect || '/admin');
  } catch (err) {
    error.value = err.message || 'Connexion impossible.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 0.9rem; text-align: left; }
.f { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.85rem; color: var(--red-dark); }
.f input {
  border: 1.5px solid var(--red);
  border-radius: 0.5rem;
  padding: 0.55rem 0.7rem;
  font-size: 0.95rem;
  font-family: inherit;
}
.error { color: #9b1c1c; font-size: 0.85rem; margin: 0; }
.submit {
  background: var(--red);
  color: var(--gold-soft);
  border: 1px solid var(--gold);
  border-radius: 999px;
  padding: 0.65rem 1rem;
  font-weight: bold;
}
.submit:disabled { opacity: 0.6; }
.submit:not(:disabled):hover { background: var(--red-dark); }
</style>

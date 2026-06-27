<template>
  <div class="shell">
    <header class="bar">
      <div class="who">
        <span class="logo-mark">CA</span>
        <strong>Dashboard admin — Cook Africa</strong>
      </div>
      <button class="logout" @click="logout">Déconnexion</button>
    </header>

    <nav class="tabs">
      <button :class="{ active: tab === 'promoters' }" @click="tab = 'promoters'">Chefs promoteurs</button>
      <button :class="{ active: tab === 'leads' }" @click="tab = 'leads'">Fiches clients</button>
      <button :class="{ active: tab === 'coupons' }" @click="tab = 'coupons'">Valider un coupon</button>
    </nav>

    <main class="content">
      <!-- ===== COUPONS ===== -->
      <section v-if="tab === 'coupons'" class="panel">
        <form class="create-form" @submit.prevent="redeemCoupon">
          <h2>Valider un coupon en caisse</h2>
          <div class="grid">
            <label><span>Code du coupon</span><input v-model.trim="couponCode" placeholder="CA-XXXXXX" required /></label>
          </div>
          <button class="primary" type="submit" :disabled="redeeming">{{ redeeming ? 'Vérification…' : 'Valider' }}</button>
          <p v-if="couponResult" :class="['result', couponResult.ok ? 'ok' : 'error']">{{ couponResult.message }}</p>
        </form>
      </section>

      <!-- ===== PROMOTEURS ===== -->
      <section v-if="tab === 'promoters'" class="panel">
        <form class="create-form" @submit.prevent="createPromoter">
          <h2>Créer un chef promoteur</h2>
          <div class="grid">
            <label><span>Identifiant</span><input v-model.trim="newPromoter.username" required /></label>
            <label><span>Nom affiché</span><input v-model.trim="newPromoter.displayName" required /></label>
            <label><span>Mot de passe</span><input v-model="newPromoter.password" type="text" minlength="6" required /></label>
          </div>
          <p v-if="createError" class="error">{{ createError }}</p>
          <button class="primary" type="submit" :disabled="creating">{{ creating ? 'Création…' : '+ Créer' }}</button>
        </form>

        <p v-if="loadingPromoters" class="muted">Chargement…</p>
        <table v-else class="data-table">
          <thead>
            <tr><th>Identifiant</th><th>Nom</th><th>Fiches</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in promoters" :key="p.id">
              <td>{{ p.username }}</td>
              <td>{{ p.displayName }}</td>
              <td>{{ p.leadCount }}</td>
              <td>
                <span :class="['pill', p.active ? 'on' : 'off']">{{ p.active ? 'Actif' : 'Désactivé' }}</span>
              </td>
              <td class="actions">
                <button @click="toggleActive(p)">{{ p.active ? 'Désactiver' : 'Réactiver' }}</button>
                <button @click="resetPassword(p)">Nouveau mdp</button>
              </td>
            </tr>
            <tr v-if="!promoters.length"><td colspan="5" class="muted">Aucun chef promoteur pour le moment.</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ===== LEADS ===== -->
      <section v-else class="panel">
        <div class="leads-toolbar">
          <label class="filter">
            <span>Filtrer par promoteur</span>
            <select v-model="filterPromoterId">
              <option value="">Tous</option>
              <option value="__catalogue__">Soumissions publiques (catalogue)</option>
              <option v-for="p in promoters" :key="p.id" :value="p.id">{{ p.displayName }}</option>
            </select>
          </label>
          <button class="primary" @click="exportCsv" :disabled="!filteredLeads.length">⬇ Exporter en CSV</button>
        </div>

        <p v-if="loadingLeads" class="muted">Chargement…</p>
        <table v-else class="data-table">
          <thead>
            <tr><th>Nom</th><th>Prénoms</th><th>Contact</th><th>Fonction</th><th>Source</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in filteredLeads" :key="l.id">
              <td>{{ l.nom }}</td>
              <td>{{ l.prenoms }}</td>
              <td>{{ l.contact }}</td>
              <td>{{ l.fonction }}</td>
              <td>{{ l.promoterName || 'Catalogue (public)' }}</td>
              <td>{{ formatDate(l.createdAt) }}</td>
            </tr>
            <tr v-if="!filteredLeads.length"><td colspan="6" class="muted">Aucune fiche pour le moment.</td></tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { adminToken, adminLogout, apiFetch } from '../composables/useAuth.js';

const router = useRouter();
const tab = ref('promoters');

const promoters = ref([]);
const leads = ref([]);
const loadingPromoters = ref(false);
const loadingLeads = ref(false);
const filterPromoterId = ref('');

const newPromoter = reactive({ username: '', displayName: '', password: '' });
const creating = ref(false);
const createError = ref('');

const couponCode = ref('');
const redeeming = ref(false);
const couponResult = ref(null);

async function redeemCoupon() {
  redeeming.value = true;
  couponResult.value = null;
  try {
    const data = await apiFetch(`/api/coupons/${encodeURIComponent(couponCode.value)}/redeem`, {
      method: 'POST',
      token: adminToken.value,
    });
    couponResult.value = { ok: true, message: `✓ Coupon validé (${data.offerText}). À ne plus accepter une seconde fois.` };
    couponCode.value = '';
  } catch (err) {
    couponResult.value = { ok: false, message: err.message || 'Erreur lors de la validation.' };
  } finally {
    redeeming.value = false;
  }
}

const filteredLeads = computed(() => {
  if (!filterPromoterId.value) return leads.value;
  if (filterPromoterId.value === '__catalogue__') return leads.value.filter((l) => !l.promoterId);
  return leads.value.filter((l) => l.promoterId === filterPromoterId.value);
});

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('fr-FR');
}

async function guarded(fn) {
  try {
    await fn();
  } catch (err) {
    if (err.status === 401) {
      adminLogout();
      router.replace('/admin/login');
      return;
    }
    throw err;
  }
}

async function loadPromoters() {
  loadingPromoters.value = true;
  await guarded(async () => {
    const { promoters: list } = await apiFetch('/api/promoters', { token: adminToken.value });
    promoters.value = list;
  });
  loadingPromoters.value = false;
}

async function loadLeads() {
  loadingLeads.value = true;
  await guarded(async () => {
    const { leads: list } = await apiFetch('/api/leads', { token: adminToken.value });
    leads.value = list;
  });
  loadingLeads.value = false;
}

async function createPromoter() {
  createError.value = '';
  creating.value = true;
  try {
    await apiFetch('/api/promoters', { method: 'POST', token: adminToken.value, body: { ...newPromoter } });
    newPromoter.username = ''; newPromoter.displayName = ''; newPromoter.password = '';
    await loadPromoters();
  } catch (err) {
    createError.value = err.message || 'Erreur lors de la création.';
  } finally {
    creating.value = false;
  }
}

async function toggleActive(p) {
  await guarded(async () => {
    await apiFetch(`/api/promoters/${p.id}`, { method: 'PATCH', token: adminToken.value, body: { active: !p.active } });
    p.active = !p.active;
  });
}

async function resetPassword(p) {
  const newPass = window.prompt(`Nouveau mot de passe pour ${p.displayName} (min. 6 caractères) :`);
  if (!newPass) return;
  await guarded(async () => {
    await apiFetch(`/api/promoters/${p.id}`, { method: 'PATCH', token: adminToken.value, body: { password: newPass } });
    window.alert('Mot de passe mis à jour.');
  });
}

function exportCsv() {
  const headers = ['Nom', 'Prénoms', 'Contact', 'Fonction', 'Source', 'Date'];
  const rows = filteredLeads.value.map((l) => [
    l.nom, l.prenoms, l.contact, l.fonction, l.promoterName || 'Catalogue (public)', formatDate(l.createdAt)
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fiches-clients-cookafrica-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function logout() {
  adminLogout();
  router.replace('/admin/login');
}

onMounted(() => {
  loadPromoters();
  loadLeads();
});
</script>

<style scoped>
.shell { min-height: 100vh; background: #f6f1e7; }

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.1rem;
  padding-top: max(0.75rem, env(safe-area-inset-top));
  background: linear-gradient(180deg, var(--red-dark), var(--red));
  border-bottom: 2px solid var(--gold);
}
.who { display: flex; align-items: center; gap: 0.6rem; color: var(--gold-soft); }
.logo-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 2.2rem; height: 2.2rem; border: 1.5px solid var(--gold); border-radius: 50%;
  color: var(--gold); font-weight: bold; flex-shrink: 0;
}
.logout {
  background: transparent; border: 1px solid var(--gold); color: var(--gold-soft);
  border-radius: 999px; padding: 0.4rem 0.8rem; font-size: 0.8rem;
}

.tabs { display: flex; gap: 0.5rem; padding: 0.75rem 1.1rem 0; }
.tabs button {
  background: none; border: none; border-bottom: 3px solid transparent;
  padding: 0.5rem 0.25rem; font-weight: bold; color: var(--red-dark); opacity: 0.6;
}
.tabs button.active { opacity: 1; border-color: var(--red); }

.content { padding: 1rem 1.1rem 2.5rem; }
.panel { display: flex; flex-direction: column; gap: 1.25rem; }

.create-form {
  background: #fff;
  border: 1px solid #e6dcc8;
  border-radius: 0.6rem;
  padding: 1rem 1.1rem;
}
.create-form h2 { margin: 0 0 0.75rem; font-size: 1rem; color: var(--red-dark); }
.grid { display: grid; gap: 0.7rem; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
.grid label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8rem; color: var(--red-dark); }
.grid input {
  border: 1.5px solid var(--red);
  border-radius: 0.4rem;
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  font-family: inherit;
}

.primary {
  margin-top: 0.75rem;
  background: var(--red);
  color: var(--gold-soft);
  border: 1px solid var(--gold);
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  font-weight: bold;
  font-size: 0.85rem;
}
.primary:disabled { opacity: 0.6; }

.error { color: #9b1c1c; font-size: 0.82rem; }
.result { margin-top: 0.75rem; font-size: 0.88rem; font-weight: bold; }
.result.ok { color: #1f7a3a; }
.result.error { color: #9b1c1c; }
.muted { color: #8a7a5e; font-size: 0.85rem; padding: 0.5rem 0; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e6dcc8;
  border-radius: 0.5rem;
  overflow: hidden;
  font-size: 0.85rem;
}
.data-table th, .data-table td {
  text-align: left;
  padding: 0.55rem 0.7rem;
  border-bottom: 1px solid #f0e9d8;
  white-space: nowrap;
}
.data-table th { background: #fbf6ea; color: var(--red-dark); }
.data-table .actions { display: flex; gap: 0.4rem; }
.data-table .actions button {
  border: 1px solid var(--red);
  background: none;
  color: var(--red-dark);
  border-radius: 0.4rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
}

.pill { padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.75rem; }
.pill.on { background: #e3f3e6; color: #1f7a3a; }
.pill.off { background: #f5e3e3; color: #9b1c1c; }

.leads-toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.filter { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.82rem; color: var(--red-dark); }
.filter select { border: 1.5px solid var(--red); border-radius: 0.4rem; padding: 0.4rem 0.5rem; font-family: inherit; }

.content { overflow-x: auto; }
</style>

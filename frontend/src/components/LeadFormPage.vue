<template>
  <div class="fiche">
    <div class="fiche-header">
      <span class="logo-mark">CA</span>
      <h2>Fiche de<br />Renseignements</h2>
    </div>

    <form class="fiche-form" @submit.prevent="submit">
      <label class="field">
        <span class="field-icon" aria-hidden="true">🧑</span>
        <span class="field-body">
          <span class="field-label">Nom</span>
          <input v-model.trim="form.nom" type="text" required autocomplete="family-name" />
        </span>
      </label>

      <label class="field">
        <span class="field-icon spacer" aria-hidden="true"></span>
        <span class="field-body">
          <span class="field-label">Prénoms</span>
          <input v-model.trim="form.prenoms" type="text" autocomplete="given-name" />
        </span>
      </label>

      <label class="field">
        <span class="field-icon" aria-hidden="true">📞</span>
        <span class="field-body">
          <span class="field-label">Contact</span>
          <input v-model.trim="form.contact" type="tel" required autocomplete="tel" />
        </span>
      </label>

      <label class="field">
        <span class="field-icon" aria-hidden="true">💼</span>
        <span class="field-body">
          <span class="field-label">Fonction</span>
          <input v-model.trim="form.fonction" type="text" autocomplete="organization-title" />
        </span>
      </label>

      <Transition name="pop" mode="out-in">
        <p v-if="errorMessage" key="error" class="msg error">{{ errorMessage }}</p>
        <p v-else-if="success" key="success" class="msg success">✓ Merci, votre fiche a été enregistrée !</p>
      </Transition>

      <button class="submit-btn" type="submit" :disabled="submitting">
        {{ submitting ? 'Envoi…' : 'Envoyer' }}
      </button>
    </form>

    <div class="fiche-footer">
      <span class="footer-ico" aria-hidden="true">🍽</span>
      <p>— LE restaurant qui rassemble —</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { apiFetch } from '../composables/useAuth.js';

const props = defineProps({
  token: { type: String, default: '' }
});

const form = reactive({ nom: '', prenoms: '', contact: '', fonction: '' });
const submitting = ref(false);
const success = ref(false);
const errorMessage = ref('');

async function submit() {
  errorMessage.value = '';
  success.value = false;
  if (!form.nom || !form.contact) {
    errorMessage.value = 'Le nom et le contact sont obligatoires.';
    return;
  }
  submitting.value = true;
  try {
    await apiFetch('/api/leads', {
      method: 'POST',
      token: props.token || undefined,
      body: { ...form },
    });
    success.value = true;
    form.nom = ''; form.prenoms = ''; form.contact = ''; form.fonction = '';
  } catch (err) {
    errorMessage.value = err.message || "Erreur lors de l'envoi.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.fiche {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--cream);
  font-family: Georgia, 'Times New Roman', serif;
  overflow-y: auto;
}

.fiche-header {
  background: linear-gradient(180deg, var(--red), var(--red-dark));
  color: var(--gold-soft);
  padding: 1.25rem 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 3px solid var(--gold);
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
  border: 2px solid var(--gold);
  border-radius: 50%;
  font-weight: bold;
  color: var(--gold);
}

.fiche-header h2 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.fiche-form {
  flex: 1;
  padding: 1.25rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field {
  display: flex;
  align-items: stretch;
  border: 1.5px solid var(--red);
  border-radius: 0.6rem;
  overflow: hidden;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25);
}

.field-icon {
  flex: 0 0 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--red);
  font-size: 1.05rem;
}
.field-icon.spacer { background: transparent; }

.field-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0.6rem;
}

.field-label {
  font-size: 0.68rem;
  color: var(--red-dark);
  opacity: 0.75;
}

.field-body input {
  border: none;
  outline: none;
  /* 16px minimum : sous ce seuil, Safari iOS zoome automatiquement la page au focus du champ. */
  font-size: 1rem;
  font-family: inherit;
  background: transparent;
  padding: 0.15rem 0;
  color: var(--ink);
}

.msg { margin: 0; font-size: 0.9rem; text-align: center; }
.msg.error { color: #9b1c1c; }
.msg.success { color: #1f7a3a; font-weight: bold; }

.pop-enter-active, .pop-leave-active { transition: opacity 0.2s, transform 0.2s; }
.pop-enter-from { opacity: 0; transform: translateY(-4px) scale(0.96); }
.pop-leave-to { opacity: 0; transform: translateY(4px) scale(0.96); }

.submit-btn {
  margin-top: 0.25rem;
  min-height: 44px;
  background: var(--red);
  color: var(--gold-soft);
  border: 1px solid var(--gold);
  border-radius: 999px;
  padding: 0.7rem 1rem;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.2s, transform 0.1s;
}
.submit-btn:disabled { opacity: 0.6; }
.submit-btn:not(:disabled):hover { background: var(--red-dark); }
.submit-btn:not(:disabled):active { transform: scale(0.97); }

.fiche-footer {
  background: var(--red);
  color: var(--gold-soft);
  text-align: center;
  padding: 0.7rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  border-top: 3px solid var(--gold);
}
.fiche-footer p { margin: 0; font-size: 0.78rem; letter-spacing: 0.03em; }
.footer-ico { font-size: 1.1rem; }
</style>

<template>
  <div class="backdrop" @click.self="$emit('close')">
    <div class="card" role="dialog" aria-modal="true" aria-label="Instructions">
      <span class="badge">CA</span>
      <h2>Bienvenue dans le catalogue Cook Africa</h2>
      <ul>
        <li><span class="ico">👉</span> <strong>Glissez</strong> ou cliquez sur le coin d'une page pour la <strong>tourner</strong>, comme un vrai magazine.</li>
        <li><span class="ico">📅</span> Touchez un <strong>jour</strong> en haut de l'écran pour sauter directement à son menu.</li>
        <li><span class="ico">⬇</span> Le bouton <strong>Télécharger</strong> enregistre le catalogue complet en PDF sur votre téléphone.</li>
        <li><span class="ico">⛶</span> Passez en <strong>plein écran</strong> pour une meilleure lecture.</li>
      </ul>
      <button class="cta" @click="$emit('close')">J'ai compris, feuilleter !</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 5, 5, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.card {
  position: relative;
  background: var(--cream);
  color: var(--ink);
  border: 2px solid var(--gold);
  border-radius: 0.75rem;
  max-width: 420px;
  width: 100%;
  padding: 1.75rem 1.5rem 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  text-align: left;
}

.badge {
  position: absolute;
  top: -1.1rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--red);
  color: var(--gold);
  border: 2px solid var(--gold);
  border-radius: 50%;
  width: 2.6rem;
  height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

h2 {
  margin: 0.5rem 0 1rem;
  font-size: 1.15rem;
  text-align: center;
  color: var(--red-dark);
}

ul { list-style: none; padding: 0; margin: 0 0 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; }
li { display: flex; gap: 0.55rem; align-items: flex-start; font-size: 0.92rem; line-height: 1.35; }
.ico { font-size: 1.1rem; flex-shrink: 0; }

.cta {
  display: block;
  width: 100%;
  background: var(--red);
  color: var(--gold-soft);
  border: 1px solid var(--gold);
  border-radius: 999px;
  padding: 0.65rem 1rem;
  font-weight: bold;
  font-size: 0.95rem;
}
.cta:hover { background: var(--red-dark); }
</style>

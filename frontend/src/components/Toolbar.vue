<template>
  <header class="toolbar">
    <div class="brand">
      <span class="brand-mark">CA</span>
      <div class="brand-text">
        <strong>Cook Africa</strong>
        <small>{{ currentDayLabel || 'Le Catalogue' }}</small>
      </div>
    </div>

    <nav class="day-chips" aria-label="Aller à un jour">
      <button
        v-for="d in dayChips"
        :key="d.id"
        class="chip"
        :class="{ active: d.index === current }"
        @click="$emit('go-to-day', d.index)"
      >{{ d.dayLabel }}</button>
    </nav>

    <div class="actions">
      <span class="page-indicator">{{ total ? current + 1 : 0 }} / {{ total }}</span>
      <a class="icon-btn" :href="pdfHref" download title="Télécharger en PDF" aria-label="Télécharger le catalogue en PDF">⬇</a>
      <button class="icon-btn" @click="$emit('help')" title="Voir ma réduction" aria-label="Voir ma réduction">🎟</button>
      <button class="icon-btn" @click="toggleFullscreen" title="Plein écran" aria-label="Plein écran">⛶</button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  dayChips: { type: Array, default: () => [] },
  pdfHref: { type: String, default: '/catalogue-cookafrica.pdf' },
  currentDayLabel: { type: String, default: '' }
});
defineEmits(['go-to-day', 'help']);

function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.();
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  padding-top: max(0.6rem, env(safe-area-inset-top));
  background: linear-gradient(180deg, var(--red-dark), var(--red));
  border-bottom: 2px solid var(--gold);
  color: var(--cream);
  flex-wrap: wrap;
}

.brand { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  color: var(--gold);
  font-weight: bold;
  font-size: 0.85rem;
}

.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-text strong { color: var(--gold-soft); font-size: 0.95rem; }
.brand-text small { color: var(--cream); opacity: 0.85; font-size: 0.72rem; }

.day-chips {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.day-chips::-webkit-scrollbar { display: none; }

.chip {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: var(--cream);
  border-radius: 999px;
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
}
.chip:hover { border-color: var(--gold); }
.chip.active { background: var(--gold); color: var(--red-dark); border-color: var(--gold); font-weight: bold; }

.actions { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; }

.page-indicator { font-size: 0.78rem; color: var(--cream); opacity: 0.85; min-width: 3.6rem; text-align: center; }

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid rgba(212, 175, 55, 0.5);
  background: transparent;
  color: var(--gold-soft);
  text-decoration: none;
  font-size: 1rem;
}
.icon-btn:hover { background: rgba(212, 175, 55, 0.15); }

@media (max-width: 640px) {
  .toolbar { gap: 0.5rem; }
  .brand-text small { display: none; }
}
</style>

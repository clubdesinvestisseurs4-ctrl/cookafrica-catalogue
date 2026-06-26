<template>
  <div class="app-shell">
    <Toolbar
      :current="currentPage"
      :total="pages.length"
      :day-chips="dayChips"
      :current-day-label="currentDayLabel"
      @go-to-day="onGoToDay"
      @help="showInstructions = true"
    />

    <main class="stage">
      <FlipBook
        v-if="pages.length"
        ref="flipbookRef"
        :pages="pages"
        @flip="onFlip"
      />
      <div v-else class="loading">Chargement du catalogue…</div>
    </main>

    <InstructionsOverlay v-if="showInstructions" @close="closeInstructions" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FlipBook from './components/FlipBook.vue';
import Toolbar from './components/Toolbar.vue';
import InstructionsOverlay from './components/InstructionsOverlay.vue';
import { useCatalog } from './composables/useCatalog.js';

const SEEN_KEY = 'cookafrica_catalog_seen_instructions';

const { data } = useCatalog();
const pages = computed(() => data.value?.pages || []);

const dayChips = computed(() =>
  pages.value
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.kind === 'day-cover')
);

const flipbookRef = ref(null);
const currentPage = ref(0);
const showInstructions = ref(false);

const currentDayLabel = computed(() => {
  const p = pages.value[currentPage.value];
  if (!p) return '';
  if (p.dayLabel) return `${p.dayLabel} — ${p.theme || ''}`.trim().replace(/—\s*$/, '');
  if (p.kind === 'cover-start') return 'Couverture';
  if (p.kind === 'cover-end') return 'Contacts & occasions';
  return '';
});

function onFlip(index) {
  currentPage.value = index;
}

function onGoToDay(index) {
  flipbookRef.value?.goTo(index);
}

function closeInstructions() {
  showInstructions.value = false;
  localStorage.setItem(SEEN_KEY, '1');
}

function onKeydown(e) {
  if (e.key === 'ArrowRight') flipbookRef.value?.next();
  if (e.key === 'ArrowLeft') flipbookRef.value?.prev();
}

onMounted(() => {
  if (!localStorage.getItem(SEEN_KEY)) showInstructions.value = true;
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
}

.stage {
  flex: 1;
  display: flex;
  min-height: 0;
}

.loading {
  margin: auto;
  color: var(--gold-soft);
  font-size: 1rem;
  letter-spacing: 0.03em;
}
</style>

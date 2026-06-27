<template>
  <div class="app-shell">
    <Toolbar
      :current="currentPage"
      :total="pages.length"
      :day-chips="dayChips"
      :current-day-label="currentDayLabel"
      @go-to-day="onGoToDay"
      @help="showDiscount = true"
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

    <DiscountPopup
      v-if="showDiscount"
      :address="contact.addressShort"
      :phones="contact.phones"
      @close="closeDiscount"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FlipBook from '../components/FlipBook.vue';
import Toolbar from '../components/Toolbar.vue';
import DiscountPopup from '../components/DiscountPopup.vue';
import { useCatalog } from '../composables/useCatalog.js';

const SEEN_KEY = 'cookafrica_catalog_seen_discount';

const { data } = useCatalog();

// Insère la page "Fiche de renseignements" juste avant la couverture de fin,
// pour que le formulaire client apparaisse à la fin du catalogue, devant le dos du livre.
const pages = computed(() => {
  const base = data.value?.pages || [];
  if (!base.length) return [];
  const last = base[base.length - 1];
  return [...base.slice(0, -1), { id: 'lead-form', kind: 'lead-form' }, last];
});

const contact = computed(() => data.value?.contact || {});

const dayChips = computed(() =>
  pages.value
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.kind === 'day-cover')
);

const flipbookRef = ref(null);
const currentPage = ref(0);
const showDiscount = ref(false);

const currentDayLabel = computed(() => {
  const p = pages.value[currentPage.value];
  if (!p) return '';
  if (p.dayLabel) return `${p.dayLabel} — ${p.theme || ''}`.trim().replace(/—\s*$/, '');
  if (p.kind === 'cover-start') return 'Couverture';
  if (p.kind === 'cover-end') return 'Contacts & occasions';
  if (p.kind === 'lead-form') return 'Restez en contact';
  return '';
});

function onFlip(index) {
  currentPage.value = index;
}

function onGoToDay(index) {
  flipbookRef.value?.goTo(index);
}

function closeDiscount() {
  showDiscount.value = false;
  localStorage.setItem(SEEN_KEY, '1');
}

function onKeydown(e) {
  if (e.key === 'ArrowRight') flipbookRef.value?.next();
  if (e.key === 'ArrowLeft') flipbookRef.value?.prev();
}

onMounted(() => {
  if (!localStorage.getItem(SEEN_KEY)) showDiscount.value = true;
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

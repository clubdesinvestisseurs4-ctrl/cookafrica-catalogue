<template>
  <div ref="wrapEl" class="flipbook-wrap">
    <div ref="bookEl" class="flipbook" :style="bookStyle">
      <div
        v-for="page in pages"
        :key="page.id"
        class="page"
        :data-density="isHardCover(page) ? 'hard' : 'soft'"
      >
        <div class="page-content">
          <div v-if="page.kind === 'lead-form-cta'" class="cta-page">
            <span class="cta-icon" aria-hidden="true">📋</span>
            <h2>Restons en contact</h2>
            <p>Laissez vos coordonnées et recevez nos prochaines offres.</p>
            <button type="button" class="cta-btn" @click="$emit('open-lead-form')">Remplir la fiche</button>
          </div>
          <img
            v-else
            :src="resolveImage(page.image)"
            :alt="page.alt || page.dayLabel || 'Page du catalogue Cook Africa'"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>

    <div class="nav-arrows">
      <button class="nav-btn prev" @click="prev" aria-label="Page précédente">‹</button>
      <button class="nav-btn next" @click="next" aria-label="Page suivante">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { PageFlip } from 'page-flip';
import { resolveImage } from '../composables/useCatalog.js';

const props = defineProps({
  pages: { type: Array, required: true }
});
const emit = defineEmits(['ready', 'flip', 'open-lead-form']);

const wrapEl = ref(null);
const bookEl = ref(null);
const bookStyle = ref({});
let pageFlip = null;
let resizeObserver = null;

// Ratio réel des pages (853x1280). On mesure l'espace disponible directement en pixels via le
// DOM plutôt qu'avec des unités CSS vh/vw : sur un vrai navigateur mobile, la barre d'adresse qui
// apparaît/disparaît fausse le calcul de vh, ce qu'un calcul JS basé sur clientWidth/clientHeight
// n'a pas (il mesure l'espace réellement rendu, peu importe le moteur du navigateur).
const PAGE_RATIO = 853 / 1280;

function isHardCover(page) {
  return page.kind === 'cover-start' || page.kind === 'cover-end';
}

function prev() { pageFlip?.flipPrev(); }
function next() { pageFlip?.flipNext(); }
function goTo(index) { pageFlip?.flip(index); }

defineExpose({ goTo, next, prev });

function measure() {
  if (!wrapEl.value) return null;
  const cw = wrapEl.value.clientWidth;
  const ch = wrapEl.value.clientHeight;
  if (!cw || !ch) return null;

  let width = cw;
  let height = Math.round(width / PAGE_RATIO);
  if (height > ch) {
    height = ch;
    width = Math.round(height * PAGE_RATIO);
  }
  return { width: Math.max(width, 1), height: Math.max(height, 1) };
}

function applySize() {
  const size = measure();
  if (!size) return;
  bookStyle.value = { width: `${size.width}px`, height: `${size.height}px` };
  return size;
}

async function init() {
  await nextTick();
  if (!bookEl.value || !wrapEl.value || !props.pages.length) return;

  const size = applySize() || { width: 520, height: 780 };
  await nextTick();

  pageFlip = new PageFlip(bookEl.value, {
    width: size.width,
    height: size.height,
    size: 'stretch',
    // minWidth = maxWidth et minHeight = maxHeight (= la taille déjà calculée pour le bon
    // ratio) : sans cette contrainte stricte, St.PageFlip a la possibilité de décider que la
    // largeur autorisée laisse la place à un mode "paysage" deux-pages et rend le livre à moitié
    // de la hauteur prévue, même en mode portrait sur un écran de téléphone étroit.
    minWidth: size.width,
    maxWidth: size.width,
    minHeight: size.height,
    maxHeight: size.height,
    maxShadowOpacity: 0.55,
    showCover: true,
    usePortrait: true,
    autoSize: true,
    showPageCorners: true,
    // false : on peut tourner la page en swipant/cliquant n'importe où, pas seulement le coin —
    // plus naturel au doigt sur mobile. Sans risque pour le bouton de la page "Restons en
    // contact" : St.PageFlip transmet toujours les clics aux <button>/<a> (clickEventForward),
    // qui ouvrent la fenêtre du formulaire au lieu de déclencher un tournage de page.
    disableFlipByClick: false,
    // true (valeur par défaut St.PageFlip) : sur mobile, désactive le scroll natif pendant le
    // toucher du livre pour que le geste de glissement soit toujours interprété comme un
    // tournage de page plutôt que comme un défilement de l'écran — sinon le feuilletage tactile
    // devient peu fiable sur téléphone.
    mobileScrollSupport: true,
    swipeDistance: 30
  });

  pageFlip.loadFromHTML(bookEl.value.querySelectorAll('.page'));
  pageFlip.on('flip', (e) => emit('flip', e.data));
  emit('ready', pageFlip);
}

let resizeTimer = null;
function onWrapResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applySize, 80);
}

onMounted(() => {
  init();
  if (window.ResizeObserver && wrapEl.value) {
    resizeObserver = new ResizeObserver(onWrapResize);
    resizeObserver.observe(wrapEl.value);
  } else {
    window.addEventListener('resize', onWrapResize);
  }
});

watch(() => props.pages, async (next, prevPages) => {
  if (!prevPages?.length && next?.length) {
    pageFlip?.destroy();
    pageFlip = null;
    await init();
  }
});

onBeforeUnmount(() => {
  pageFlip?.destroy();
  pageFlip = null;
  resizeObserver?.disconnect();
  window.removeEventListener('resize', onWrapResize);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.flipbook-wrap {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.25rem, 1vh, 0.75rem) clamp(0.25rem, 1.5vw, 1rem);
  min-height: 0;
}

.flipbook {
  /* Largeur/hauteur fixées dynamiquement en JS (voir bookStyle), à partir de la taille réelle
     mesurée de .flipbook-wrap — plus fiable que des unités CSS vh/vw, qui sont faussées sur les
     vrais navigateurs mobiles par l'apparition/disparition de la barre d'adresse. */
  flex-shrink: 0;
}

.page {
  background: var(--cream);
  overflow: hidden;
}

.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
}

.page img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--cream);
  user-select: none;
  -webkit-user-drag: none;
}

.cta-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  padding: 2rem 1.5rem;
  text-align: center;
  background: linear-gradient(180deg, var(--red), var(--red-dark));
  color: var(--gold-soft);
}

.cta-icon { font-size: 2.6rem; }
.cta-page h2 { margin: 0; font-size: 1.3rem; }
.cta-page p { margin: 0; font-size: 0.9rem; opacity: 0.9; max-width: 280px; }

.cta-btn {
  margin-top: 0.5rem;
  background: var(--gold);
  color: var(--red-dark);
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  font-size: 0.95rem;
  min-height: 44px;
}
.cta-btn:active { transform: scale(0.97); }

.nav-arrows {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
  pointer-events: none;
}

.nav-btn {
  pointer-events: auto;
  background: rgba(122, 14, 14, 0.55);
  color: var(--gold-soft);
  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 999px;
  width: 2.4rem;
  height: 2.4rem;
  font-size: 1.4rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  transition: background 0.2s, transform 0.15s;
}

.nav-btn:hover { background: rgba(122, 14, 14, 0.85); transform: scale(1.06); }
.nav-btn:active { transform: scale(0.95); }

@media (max-width: 640px) {
  /* Cible tactile >= 44px (recommandation accessibilité mobile), un peu plus grande que la
     simple icône pour rester facile à toucher du pouce. */
  .nav-btn { width: 2.75rem; height: 2.75rem; font-size: 1.3rem; }
  .nav-arrows { padding: 0 0.4rem; }
}
</style>

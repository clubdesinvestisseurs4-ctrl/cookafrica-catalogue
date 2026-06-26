<template>
  <div class="flipbook-wrap">
    <div ref="bookEl" class="flipbook">
      <div
        v-for="page in pages"
        :key="page.id"
        class="page"
        :data-density="isHardCover(page) ? 'hard' : 'soft'"
      >
        <div class="page-content">
          <img
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
const emit = defineEmits(['ready', 'flip']);

const bookEl = ref(null);
let pageFlip = null;

function isHardCover(page) {
  return page.kind === 'cover-start' || page.kind === 'cover-end';
}

function prev() { pageFlip?.flipPrev(); }
function next() { pageFlip?.flipNext(); }
function goTo(index) { pageFlip?.flip(index); }

defineExpose({ goTo, next, prev });

async function init() {
  await nextTick();
  if (!bookEl.value || !props.pages.length) return;

  pageFlip = new PageFlip(bookEl.value, {
    width: 480,
    height: 720,
    size: 'stretch',
    minWidth: 260,
    maxWidth: 1100,
    minHeight: 380,
    maxHeight: 1600,
    maxShadowOpacity: 0.55,
    showCover: true,
    usePortrait: true,
    autoSize: true,
    showPageCorners: true,
    disableFlipByClick: false,
    mobileScrollSupport: false
  });

  pageFlip.loadFromHTML(bookEl.value.querySelectorAll('.page'));
  pageFlip.on('flip', (e) => emit('flip', e.data));
  emit('ready', pageFlip);
}

onMounted(init);

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
  padding: clamp(0.5rem, 2vh, 1.5rem) clamp(0.5rem, 3vw, 2rem);
  min-height: 0;
}

.flipbook {
  width: min(94vw, 1000px);
  height: min(78vh, 1500px);
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
  .flipbook { height: min(72vh, 1500px); }
  .nav-btn { width: 2rem; height: 2rem; font-size: 1.2rem; }
}
</style>

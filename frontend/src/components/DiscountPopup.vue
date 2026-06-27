<template>
  <div class="backdrop" @click.self="close">
    <div class="card" role="dialog" aria-modal="true" aria-label="Offre de réduction">
      <button class="close-x" @click="close" aria-label="Fermer">✕</button>
      <span class="badge">🎉</span>
      <h2>Une réduction pour vous !</h2>
      <p class="sub">Téléchargez votre coupon et venez en profiter au restaurant.</p>

      <canvas ref="canvasEl" class="coupon-canvas"></canvas>

      <button class="cta" @click="download">⬇ Télécharger mon coupon</button>
      <button class="ghost" @click="close">Continuer vers le catalogue</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { drawCoupon, downloadCanvas, formatDateFR, generateCouponCode } from '../composables/useCoupon.js';

const props = defineProps({
  offerText: { type: String, default: "-15% sur l'addition" },
  address: { type: String, default: '' },
  phones: { type: Array, default: () => [] }
});
const emit = defineEmits(['close']);

const canvasEl = ref(null);
let code = '';

onMounted(() => {
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 5);
  code = generateCouponCode();
  drawCoupon(canvasEl.value, {
    offerText: props.offerText,
    validUntilLabel: formatDateFR(validUntil),
    code,
    address: props.address,
    phones: props.phones
  });
});

function download() {
  downloadCanvas(canvasEl.value, `coupon-cookafrica-${code}.png`);
}
function close() {
  emit('close');
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 5, 5, 0.78);
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
  max-width: 360px;
  width: 100%;
  padding: 1.75rem 1.25rem 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
  text-align: center;
  max-height: 92vh;
  overflow-y: auto;
}

.close-x {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--red-dark);
  line-height: 1;
}

.badge { font-size: 2rem; display: block; }

h2 { margin: 0.35rem 0 0.4rem; font-size: 1.2rem; color: var(--red-dark); }
.sub { margin: 0 0 1rem; font-size: 0.88rem; opacity: 0.85; }

.coupon-canvas {
  width: 100%;
  max-width: 260px;
  height: auto;
  aspect-ratio: 1000 / 1400;
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  margin-bottom: 1.1rem;
}

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
  margin-bottom: 0.6rem;
}
.cta:hover { background: var(--red-dark); }

.ghost {
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: var(--red-dark);
  font-size: 0.82rem;
  text-decoration: underline;
}
</style>

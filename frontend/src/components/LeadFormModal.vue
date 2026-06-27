<template>
  <div class="backdrop" @click.self="close">
    <div class="card" role="dialog" aria-modal="true" aria-label="Fiche de renseignements">
      <button class="close-x" @click="close" aria-label="Fermer">✕</button>
      <LeadFormPage />
    </div>
  </div>
</template>

<script setup>
import LeadFormPage from './LeadFormPage.vue';

const emit = defineEmits(['close']);
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
  width: 100%;
  max-width: 380px;
  height: min(82vh, 640px);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
}

.close-x {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  z-index: 1;
  background: rgba(0, 0, 0, 0.25);
  border: none;
  border-radius: 50%;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1rem;
  color: #fff;
  line-height: 1;
}
</style>

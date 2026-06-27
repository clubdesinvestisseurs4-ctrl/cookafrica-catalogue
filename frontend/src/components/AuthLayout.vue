<template>
  <div class="auth-shell">
    <div class="auth-card">
      <span class="logo-mark">CA</span>
      <h1>{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: '' } });
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: radial-gradient(ellipse at top, var(--red) 0%, var(--red-dark) 70%);
}

.auth-card {
  background: var(--cream);
  border: 2px solid var(--gold);
  border-radius: 0.85rem;
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 2px solid var(--gold);
  border-radius: 50%;
  color: var(--red);
  background: var(--gold-soft);
  font-weight: bold;
  margin-bottom: 0.75rem;
}

h1 {
  margin: 0 0 1.25rem;
  font-size: 1.15rem;
  color: var(--red-dark);
}
</style>

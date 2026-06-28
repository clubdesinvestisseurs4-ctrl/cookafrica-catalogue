<template>
  <div class="auth-shell">
    <div class="auth-card">
      <img class="logo-mark" src="/assets/logo-cookafrica.jpeg" alt="Cook Africa" />
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
  animation: auth-card-in 0.35s ease-out;
}

@keyframes auth-card-in {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.logo-mark {
  display: block;
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 0.75rem;
  object-fit: cover;
  border: 2px solid var(--gold);
  border-radius: 0.6rem;
}

h1 {
  margin: 0 0 1.25rem;
  font-size: 1.15rem;
  color: var(--red-dark);
}
</style>

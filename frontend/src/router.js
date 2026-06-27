import { createRouter, createWebHistory } from 'vue-router';
import { adminToken, promoteurToken } from './composables/useAuth.js';

const routes = [
  { path: '/', name: 'catalog', component: () => import('./views/CatalogView.vue') },

  { path: '/promoteur/login', name: 'promoteur-login', component: () => import('./views/PromoterLoginView.vue') },
  { path: '/promoteur', name: 'promoteur', component: () => import('./views/PromoterFormView.vue'), meta: { requiresPromoteur: true } },

  { path: '/admin/login', name: 'admin-login', component: () => import('./views/AdminLoginView.vue') },
  { path: '/admin', name: 'admin', component: () => import('./views/AdminDashboardView.vue'), meta: { requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !adminToken.value) {
    return { name: 'admin-login', query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresPromoteur && !promoteurToken.value) {
    return { name: 'promoteur-login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;

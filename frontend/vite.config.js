import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['qr-code.png', 'catalogue-cookafrica.pdf'],
      manifest: {
        id: '/',
        name: 'Cook Africa — Le Catalogue',
        short_name: 'Cook Africa',
        description: "Catalogue numérique des menus Cook Africa — l'univers des mets africains",
        theme_color: '#7a0e0e',
        background_color: '#7a0e0e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'fr',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/pages\/.*\.jpg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'catalogue-pages',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /\/api\/catalog$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'catalogue-api', networkTimeoutSeconds: 4 }
          }
        ]
      }
    })
  ],
  server: { port: 5173 },
  build: { outDir: 'dist', assetsInlineLimit: 0 }
});

import path from 'path';
      import { defineConfig, loadEnv } from 'vite';
      import react from '@vitejs/plugin-react';
      
      export default defineConfig(({ mode }) => {
          const env = loadEnv(mode, '.', '');
          return {
            plugins: [react()],
            resolve: {
              alias: {
                '@': path.resolve(__dirname, '.'),
              }
            },
            // --- DIVISIÓN DE CÓDIGO ---
            build: {
              rollupOptions: {
                output: {
                  manualChunks(id) {
                    if (id.includes('node_modules')) {
                      if (id.includes('recharts') || id.includes('d3')) {
                        return 'vendor_charts';
                      }
                      if (id.includes('react') || id.includes('react-dom')) {
                        return 'vendor_react_dom';
                      }
                      return 'vendor'; // All other node_modules
                    }
                  },
                },
              },
            },
            // -------------------------------------------------------------
            server: {
              port: 3000,
              host: '0.0.0.0',
            },
          };
      });

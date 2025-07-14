import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from 'lovable-tagger'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    server: {
      host: '::',
      port: 3000,
      proxy: {
        '/auth': env.VITE_API_URL || 'http://localhost:8080',
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'build',
    },
  }
})

import reactPlugin from '@vitejs/plugin-react'
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [reactPlugin()],
  base: "./",
  optimizeDeps: {
    include: ['react/jsx-runtime']
  }
}

export default config

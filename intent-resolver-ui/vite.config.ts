import reactPlugin from '@vitejs/plugin-react'
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [reactPlugin()],
  optimizeDeps: {
    include: ['react/jsx-runtime']
  }
}

export default config

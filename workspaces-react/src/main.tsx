import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { IOConnectProvider } from '@interopio/react-hooks';
import IODesktop from "@interopio/desktop";
import IOWorkspaces from "@interopio/workspaces-api";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IOConnectProvider settings={{
      desktop: {
        factory: (_) => {
          return IODesktop({ libraries: [IOWorkspaces], appManager: "skipIcons" })
        }
      }
    }}>
      <App />
    </IOConnectProvider>
  </React.StrictMode>,

);

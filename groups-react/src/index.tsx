import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { IOConnectProvider } from "@interopio/react-hooks";
import IODesktop from '@interopio/desktop';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IOConnectProvider settings={{
      desktop: {
        factory: (config: any) => {
          return IODesktop();
        }
      }
    }}>
      <App />
    </IOConnectProvider>
  </React.StrictMode >
);

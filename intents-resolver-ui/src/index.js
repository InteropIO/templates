import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import IOBrowser from "@interopio/browser";
import Glue from "@glue42/desktop";
import IOConnectIntentsResolver from "@interopio/intents-resolver-api";
import { IOConnectProvider } from '@interopio/react-hooks';
import "@glue42/theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IOConnectProvider settings={{
    browser: {
      config: { libraries: [IOConnectIntentsResolver], appManager: "full", intents: { enableIntentsResolverUI: false } },
      factory: IOBrowser
    },
    desktop: {
      config: { libraries: [IOConnectIntentsResolver], appManager: "full", intents: { enableIntentsResolverUI: false } },
      factory: Glue
    }
  }}>
    <App />
  </IOConnectProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { IOConnectProvider } from '@interopio/react-hooks';
import IODesktop from "@interopio/desktop";
import IOWorkspaces from "@interopio/workspaces-api";

ReactDOM.render(
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
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

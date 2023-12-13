import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GlueProvider } from "@glue42/react-hooks";
import GlueWorkspaces from "@glue42/workspaces-api";
import Glue from "@glue42/desktop";
import GlueWeb from "@glue42/web";

import "@glue42/workspaces-ui-react/dist/styles/popups.css";
import "@glue42/workspaces-ui-react/dist/styles/goldenlayout-base.css";
import "@glue42/workspaces-ui-react/dist/styles/glue42-theme.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <GlueProvider settings={{
      web: {
        config: { libraries: [GlueWorkspaces] },
        factory: (config) => {
          return GlueWeb(config);
        }
      },
      desktop: {
        config: { libraries: [GlueWorkspaces], appManager: "skipIcons" },
        factory: (config) => {
          return Glue(config);
        }
      }
    }}>
      <App />
    </GlueProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

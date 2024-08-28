import React from 'react'
import ReactDOM from 'react-dom/client'
import { IOConnectProvider } from '@interopio/react-hooks'
import IOBrowser from "@interopio/browser";
import IODesktop from "@interopio/desktop";
import IOConnectIntentsResolver from '@interopio/intents-resolver-api';
import IOConnectIntentsResolverUI from "@interopio/intents-resolver-ui";
import { IOConnectDesktop } from "@interopio/desktop";
import "@interopio/intents-resolver-ui/styles";

const config = {
  browser: {
    config: {
      libraries: [IOConnectIntentsResolver]
    },
    factory: IOBrowser
  },
  desktop: {
    config: {
      libraries: [IOConnectIntentsResolver],
      appManager: "full" as IOConnectDesktop.AppManager.Mode
    },
    factory: IODesktop
  }
} 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IOConnectProvider settings={config}>
      <IOConnectIntentsResolverUI config={{}} />
    </IOConnectProvider>
  </React.StrictMode>,
)

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom/client";
import IOConnectIntentsResolverUI from "@interopio/intents-resolver-ui";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOConnectIntentsResolver from "@interopio/intents-resolver-api";
import "@interopio/intents-resolver-ui/styles";
import IOBrowser from "@interopio/browser";
import IODesktop from "@interopio/desktop";

// const initialize = async () => {
//   const io = await IOBrowser({ libraries: [IOConnectIntentsResolver] });

//   (window as any).io = io;

//   console.log("IO configured successfully");

//   return io;
// }

// const render = (io: any) => {
//   ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//       <IOConnectIntentsResolverUI config={{ io }}/>
//     </React.StrictMode>,
//   );
// }

// initialize().then((io) => render(io));

// ---------------------------------------------------------------------------------

const config = {
    browser: {
        config: {
            libraries: [IOConnectIntentsResolver],
            intents: {
                enableIntentsResolverUI: false,
            },
        },
        factory: IOBrowser,
    },
    desktop: {
        config: {
            libraries: [IOConnectIntentsResolver as any],
            intents: {
                enableIntentsResolverUI: false,
            },
            appManager: "full",
        },
        factory: IODesktop,
    },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <IOConnectProvider settings={config}>
        <IOConnectIntentsResolverUI config={{}}/>
    </IOConnectProvider>
);

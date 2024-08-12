import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { IOConnectInitSettings, IOConnectProvider } from "@interopio/react-hooks";
import IOConnectIntentsResolver from "@interopio/intents-resolver-api";
import IOBrowser from "@interopio/browser";
import IODesktop from "@interopio/desktop";

// TODO: remove 'prop-types' dep when @interopio/react-hooks@3.3.1 is released

const config: IOConnectInitSettings = {
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
            libraries: [IOConnectIntentsResolver],
            intents: {
                enableIntentsResolverUI: false,
            },
            appManager: "full",
        },
        factory: IODesktop,
    },
};

ReactDOM.render(
    <IOConnectProvider settings={config}>
        <App />
    </IOConnectProvider>,
    document.getElementById("root")
);

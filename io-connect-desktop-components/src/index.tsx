import { createRoot } from "react-dom/client";
import App from "./App";
import { IOConnectProvider } from "@interopio/react-hooks";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No root element found");
}

const root = createRoot(rootElement);

root.render(
  <IOConnectProvider
    fallback={<h2>Loading...</h2>}
    settings={{ desktop: { config: { appManager: "full" } } }}
  >
    <App />
  </IOConnectProvider>
);

import { useMemo } from "react";
import { IOConnectHome, IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIOConfig } from "./helpers";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
import "@interopio/home-ui-react/index.css";

export function App() {
  const ioConnectHomeConfig: IOConnectHomeConfig = useMemo(
    () => ({
      getIOConnectConfig: getIOConfig
    }),
    []
  );

  return <IOConnectHome config={ioConnectHomeConfig} />;
}

export default App;

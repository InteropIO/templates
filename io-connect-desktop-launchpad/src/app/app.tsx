import { lazy, Suspense, useContext, useEffect } from "react";
import { IOConnectContext, IOConnectProvider } from "@interopio/react-hooks";
import { ioConfig } from "../constants/constants";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
import "@interopio/components-react/dist/styles/components/ui/dropdown-menu.css";
import "@interopio/components-react/dist/styles/components/ui/overlay-scrollbars-container.css";
import "@interopio/components-react/dist/styles/features/active-panel-renderer/styles.css";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";
import "@interopio/components-react/dist/styles/features/preferences/styles.css";
import "@interopio/components-react/dist/styles/features/profile/styles.css";
import "@interopio/components-react/dist/styles/features/launchpad/styles.css";
import "@interopio/components-react/dist/styles/features/launchpad-desktop/styles.css";

const Launchpad = lazy(() => import("../components/launchpad"));

// IOConnectProvider owns the only io.Connect initialization - read the resulting instance from context instead of initializing again.
function GlobalIOBinder() {
  const io = useContext(IOConnectContext);

  useEffect(() => {
    if (io) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).io = io;
    }
  }, [io]);

  return null;
}

export function App() {
  return (
    <IOConnectProvider settings={ioConfig}>
      <GlobalIOBinder />
      <Suspense fallback={null}>
        <Launchpad />
      </Suspense>
    </IOConnectProvider>
  );
}

export default App;

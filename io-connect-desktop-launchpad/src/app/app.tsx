import { lazy, Suspense, useRef } from "react";
import { useIOConnectInit, IOConnectProvider } from "@interopio/react-hooks";
import { ioConfig } from "../constants/constants";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
import "@interopio/home-ui-react/index.css";
import "@interopio/components-react/dist/styles/components/ui/dropdown-menu.css";
import "@interopio/components-react/dist/styles/components/ui/overlay-scrollbars-container.css";
import "@interopio/components-react/dist/styles/features/active-panel-renderer/styles.css";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";
import "@interopio/components-react/dist/styles/features/preferences/styles.css";

const Launchpad = lazy(() => import("../components/launchpad"));

export function App() {
    const io = useIOConnectInit(ioConfig);
    const ioRef = useRef(io);

    if (!ioRef.current && io) {
        ioRef.current = io;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).io = ioRef.current;

    return (
        <IOConnectProvider settings={ioConfig}>
            <Suspense fallback={null}>
                <Launchpad />
            </Suspense>
        </IOConnectProvider>
    );
}

export default App;

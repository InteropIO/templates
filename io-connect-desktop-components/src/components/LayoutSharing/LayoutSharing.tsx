import { useContext, useEffect, useState } from "react";
import IODesktop, { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext, IOConnectInitSettings, IOConnectProvider } from "@interopio/react-hooks";
import IOModalsAPI from "@interopio/modals-api";
import IOWorkspaces from "@interopio/workspaces-api";
import { ManagerLib } from "@interopio/manager-api/desktop";
import { IOLayoutSharing, ThemeProvider } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/components/form/select.css";
import "@interopio/components-react/dist/styles/components/ui/overlay-scrollbars-container.css";
import "@interopio/components-react/dist/styles/features/layout-sharing/styles.css";
import "./LayoutSharing.css";

const ioConfig = {
  desktop: {
    factory: IODesktop,
    config: {
      gateway: {
        logging: {
          level: "warn",
        },
      },
      libraries: [IOModalsAPI, IOWorkspaces, ManagerLib],
      appManager: "full",
      channels: false,
      metrics: false,
      contexts: true,
      systemLogger: {
        level: "warn",
      },
    },
  },
} as IOConnectInitSettings;

const { LayoutSharingProvider, LayoutSharing } = IOLayoutSharing;

type LayoutSharingContext = {
  variant?: IOLayoutSharing.LayoutSharingVariant;
  id?: string;
  workspaceId?: string;
} | null;

function LayoutSharingInner() {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const [variant, setVariant] = useState<IOLayoutSharing.LayoutSharingVariant>("share-layout");
  const [id, setId] = useState<string | undefined>(undefined);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);

  const applyContext = (context: LayoutSharingContext) => {
    if (context?.variant != null) {
      setVariant(context.variant);
    }

    if (context?.id != null) {
      setId(context.id);
    }

    // workspaceId must be cleared on updates that omit it, unlike variant/id which persist
    setWorkspaceId(context?.workspaceId);
  };

  useEffect(() => {
    if (!io?.apps) {
      return;
    }

    const fetchAppContext = async () => {
      try {
        const appId = io.apps.my.instance.id;
        const context = (await io.apps.instances.getContext({ id: appId })) as LayoutSharingContext;

        applyContext(context);
      } catch (error) {
        console.error("useLayoutSharing: Failed to fetch app context:", error);
      }
    };

    fetchAppContext();

    const unsubscribe = io?.windows?.my()?.onContextUpdated((context) => {
      applyContext(context as LayoutSharingContext);
    });

    return () => {
      unsubscribe?.();
    };
  }, [io]);

  return <LayoutSharing variant={variant} id={id} workspaceId={workspaceId} />;
}

function LayoutSharingWrapper() {
  return (
    <IOConnectProvider settings={ioConfig}>
      <ThemeProvider>
        <LayoutSharingProvider>
          <LayoutSharingInner />
        </LayoutSharingProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

export default LayoutSharingWrapper;

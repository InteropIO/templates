import { useEffect, useState, useRef } from "react";
import { IOConnectDesktop } from "@interopio/desktop";

const DEFAULT_PANEL_APP_NAME = "io-connect-notifications-panel-application";

// Helper to get app from registry with error handling
async function getAppFromRegistry(
  registry: IOConnectDesktop.Apps.AppRegistry,
  appName: string,
  errorMessage: string
): Promise<IOConnectDesktop.Apps.Application | null> {
  const app = await registry.get({ name: appName });

  if (!app) {
    console.warn(errorMessage);
    return null;
  }

  return app;
}

// Helper function to fetch panel application from registry
async function fetchPanelApplication(
  appsAPI: IOConnectDesktop.Apps.API,
  myAppName: string
): Promise<IOConnectDesktop.Apps.Application | null> {
  const registry = appsAPI.registry;

  if (!registry) {
    console.warn("Apps registry is not available");

    return null;
  }

  const app = await getAppFromRegistry(
    registry,
    myAppName,
    `Application with name ${myAppName} not found in registry`
  );

  if (!app) {
    return null;
  }

  const panelAppName = app.customProperties?.notificationsPanelAppName ?? DEFAULT_PANEL_APP_NAME;

  return getAppFromRegistry(
    registry,
    panelAppName,
    `Panel application with name ${panelAppName} not found in registry`
  );
}

/**
 * Custom hook to manage notification panel lifecycle
 * Handles fetching panel app, subscribing to instance events, and showing/hiding the panel
 */
export function useNotificationPanel(io: IOConnectDesktop.API, isPanelVisible: boolean) {
  const [panelApp, setPanelApp] = useState<IOConnectDesktop.Apps.Application | null>(null);
  const isStartingPanelRef = useRef(false);
  const panelInstanceIdRef = useRef<string | null>(null);
  const appsAPI = io.apps;

  // Fetch panel application from registry
  useEffect(() => {
    if (!appsAPI) return;

    fetchPanelApplication(appsAPI, appsAPI.my.appName).then((app) => {
      setPanelApp(app);
    });
  }, [appsAPI]);

  // Subscribe to instance stopped events
  useEffect(() => {
    const notificationsPanelAPI = io?.notifications?.panel;
    const instances = appsAPI?.instances;

    if (!notificationsPanelAPI || !instances) {
      console.warn("Cannot subscribe to instance stopped events - API not available");
      return;
    }

    const handleInstanceStopped = (instance: IOConnectDesktop.Apps.ApplicationInstance) => {
      if (instance.id === panelInstanceIdRef.current) {
        panelInstanceIdRef.current = null;
        notificationsPanelAPI.hide();
      }
    };

    let unsubscribeOnStopped: (() => void) | undefined;

    instances
      .onStopped(({ instance }) => handleInstanceStopped(instance))
      .then((unsubscribe) => {
        unsubscribeOnStopped = unsubscribe;
      });

    return () => {
      unsubscribeOnStopped?.();
    };
  }, [io, appsAPI?.instances]);

  // Show/hide panel based on visibility state
  useEffect(() => {
    if (!isPanelVisible || !panelApp || isStartingPanelRef.current) {
      return;
    }

    const instances = appsAPI?.instances;

    if (!instances) {
      console.warn("Apps instances API is not available");
      return;
    }

    const startOrShowPanelApplication = async () => {
      // Check if panel is already running
      const activeInstances = await instances.getMany();
      const existingPanelInstance = activeInstances.find(
        (instance) => instance.appName === panelApp.name
      );

      if (existingPanelInstance) {
        panelInstanceIdRef.current = existingPanelInstance.id;
        return;
      }

      // Start new instance if none exists
      const newInstance = await instances.start({ name: panelApp.name });

      panelInstanceIdRef.current = newInstance.id;
    };

    isStartingPanelRef.current = true;

    startOrShowPanelApplication()
      .catch((error) => {
        console.error("Failed to show panel:", error);
      })
      .finally(() => {
        isStartingPanelRef.current = false;
      });
  }, [isPanelVisible, panelApp, appsAPI?.instances]);

  return { panelApp };
}

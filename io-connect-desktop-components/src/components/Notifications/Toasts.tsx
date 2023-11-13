import {
  ThemeProvider,
  NotificationsProvider,
  useNotificationsContext,
  Toasts,
  useShowHideWindow,
} from "@interopio/components-react";
import { IOConnectProvider, IOConnectContext } from "@interopio/react-hooks";
import API, { IOConnectDesktop } from "@interopio/desktop";
import { useContext, useEffect, useState } from "react";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

function NotificationToastsWrapper() {
  useEffect(() => {
    document.title = "Notifications";
  }, []);

  return (
    <IOConnectProvider
      settings={{
        desktop: {
          factory: () => {
            return API({
              appManager: "full",
            });
          },
        },
      }}
    >
      <ThemeProvider>
        <NotificationsProvider>
          <Notifications />
        </NotificationsProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

function Notifications() {
  const { notifications, isPanelVisible, settings } = useNotificationsContext();
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const [panelApplication, setPanelApplication] =
    useState<IOConnectDesktop.AppManager.Application | null>(null);

  useEffect(() => {
    const myApplication = io.appManager.myInstance.application;
    const panelAppName =
      myApplication.userProperties?.panelApplicationName ??
      "io-connect-notifications-panel-application";
    const panelApp = io.appManager.application(panelAppName);

    setPanelApplication(panelApp);
  }, [io]);

  useEffect(() => {
    const showPanel = async () => {
      if (isPanelVisible) {
        const instances = panelApplication?.instances;

        if (instances && instances.length > 0) {
          const gdWindow = await instances[0].getWindow();

          gdWindow.show();
        } else {
          panelApplication?.start();
        }
      }
    };

    showPanel();
  }, [isPanelVisible, panelApplication]);

  useShowHideWindow(notifications.some((n) => n.state === "Active"));

  return settings.enabledNotification && !isPanelVisible ? (
    <Toasts
      style={{
        display: `${
          notifications.some((n) => n.state === "Active") ? "block" : "none"
        }`,
      }}
    />
  ) : null;
}

export default NotificationToastsWrapper;

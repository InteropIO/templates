import {
  ThemeProvider,
  NotificationsProvider,
  useNotificationsContext,
  Toasts,
  useShowHideWindow,
} from "@interopio/components-react";
import { GlueProvider, GlueContext } from "@glue42/react-hooks";
import Glue, { Glue42 } from "@glue42/desktop";
import { useContext, useEffect, useState } from "react";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

function NotificationToastsWrapper() {
  useEffect(() => {
    document.title = "Notifications";
  }, []);

  return (
    <GlueProvider
      settings={{
        desktop: {
          factory: () => {
            return Glue({
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
    </GlueProvider>
  );
}

function Notifications() {
  const { notifications, isPanelVisible, settings } = useNotificationsContext();
  const glue = useContext(GlueContext) as Glue42.Glue;
  const [panelApplication, setPanelApplication] =
    useState<Glue42.AppManager.Application | null>(null);

  useEffect(() => {
    const myApplication = glue.appManager.myInstance.application;
    const panelAppName =
      myApplication.userProperties?.panelApplicationName ??
      "io-connect-notifications-panel-application";
    const panelApp = glue.appManager.application(panelAppName);

    setPanelApplication(panelApp);
  }, [glue]);

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

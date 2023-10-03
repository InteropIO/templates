import {
  ThemeProvider,
  NotificationsProvider,
  useNotificationsContext,
  Toasts,
} from "@interopio/components-react";
import { GlueProvider, GlueContext } from "@glue42/react-hooks";
import Glue, { Glue42 } from "@glue42/desktop";
import { useCallback, useContext, useEffect, useState } from "react";
import "@interopio/components-react/src/features/notifications/assets/styles/styles.css";

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

const Notifications = () => {
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

  const showWindow = useCallback(() => {
    const myWnd = glue?.windows.my();

    if (myWnd && !myWnd.isVisible) {
      return myWnd.show();
    }

    return Promise.resolve();
  }, [glue?.windows]);

  const hideWindow = useCallback(() => {
    const myWnd = glue?.windows.my();

    if (myWnd?.isVisible) {
      return myWnd.hide();
    }

    return Promise.resolve();
  }, [glue?.windows]);

  useEffect(() => {
    if (notifications.some((n) => n.state === "Active")) {
      showWindow();
    } else {
      hideWindow();
    }
  }, [notifications, showWindow, hideWindow]);

  if (isPanelVisible) {
    return null;
  }

  return settings.enabledNotification ? (
    <Toasts
      style={{
        display: `${
          notifications.some((n) => n.state === "Active") ? "block" : "none"
        }`,
      }}
    />
  ) : null;
};

export default NotificationToastsWrapper;

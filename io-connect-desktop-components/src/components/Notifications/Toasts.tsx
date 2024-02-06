import { useContext, useEffect, useState } from "react";
import {
  ThemeProvider,
  useShowHideWindow,
  IONotifications,
} from "@interopio/components-react";
import { IOConnectProvider, IOConnectContext } from "@interopio/react-hooks";
import API, { IOConnectDesktop } from "@interopio/desktop";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

const { NotificationsProvider, useNotificationsContext, Toasts } =
  IONotifications;

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
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const { notifications, isPanelVisible, settings } = useNotificationsContext();
  const [panelApplication, setPanelApplication] =
    useState<IOConnectDesktop.AppManager.Application | null>(null);
  const [appInstance, setAppInstance] =
    useState<IOConnectDesktop.AppManager.Instance | null>(null);

  useEffect(() => {
    const myApplication = io.appManager.myInstance.application;
    const panelAppName =
      myApplication.userProperties?.panelApplicationName ??
      "io-connect-notifications-panel-application";
    const panelApp = io.appManager.application(panelAppName);

    setPanelApplication(panelApp);
  }, [io]);

  useEffect(() => {
    const un = appInstance?.onStopped(() => {
      io?.notifications?.panel?.hide();
    });

    return () => {
      if (un) {
        un();
      }
    };
  }, [io?.notifications?.panel, appInstance]);

  useEffect(() => {
    const showPanel = async () => {
      if (isPanelVisible) {
        const instances = panelApplication?.instances;

        if (instances && instances.length > 0) {
          const instance = instances[0];
          setAppInstance(instance);

          const gdWindow = await instance.getWindow();
          gdWindow.show();
        } else {
          const instance = await panelApplication?.start();

          if (instance) {
            setAppInstance(instance);
          }
        }
      }
    };

    showPanel();
  }, [isPanelVisible, panelApplication, io]);

  useShowHideWindow(notifications.some((n) => n.state === "Active"));

  return settings.enabledToasts && !isPanelVisible ? (
    <Toasts
      style={{
        display: `${
          notifications.some((n) => n.state === "Active") ? "flex" : "none"
        }`,
      }}
    />
  ) : null;
}

export default NotificationToastsWrapper;

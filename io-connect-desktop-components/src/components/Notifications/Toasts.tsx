import { useContext, useEffect, useState } from "react";
import { ThemeProvider, useShowHideWindow, IONotifications } from "@interopio/components-react";
import { IOConnectProvider, IOConnectContext } from "@interopio/react-hooks";
import API, { IOConnectDesktop } from "@interopio/desktop";
import "@interopio/components-react/dist/styles/components/ui/dropdown-menu.css";
import "@interopio/components-react/dist/styles/components/ui/overlay-scrollbars-container.css";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";
import "./Toasts.css";

const {
  NotificationsProvider,
  NotificationsPanelProvider,
  useNotificationsContext,
  useNotificationsPanelContext,
  Toasts,
} = IONotifications;

function NotificationToastsWrapper() {
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
          <NotificationsPanelProvider>
            <NotificationToasts />
          </NotificationsPanelProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

function NotificationToasts() {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const { notifications, settings } = useNotificationsContext();
  const { isPanelVisible } = useNotificationsPanelContext();
  const [panelApplication, setPanelApplication] =
    useState<IOConnectDesktop.AppManager.Application | null>(null);
  const [appInstance, setAppInstance] = useState<IOConnectDesktop.AppManager.Instance | null>(null);

  const notificationsPanelAPI = io?.notifications?.panel;

  useEffect(() => {
    const myApplication = io.appManager.myInstance.application;
    const panelAppName =
      myApplication.userProperties?.panelApplicationName ??
      "io-connect-notifications-panel-application";
    const panelApp = io.appManager.application(panelAppName) ?? null;

    setPanelApplication(panelApp);
  }, [io]);

  useEffect(() => {
    if (!notificationsPanelAPI) {
      return;
    }

    const unsubscribe = appInstance?.onStopped(() => {
      notificationsPanelAPI.hide();
    });

    return () => {
      unsubscribe?.();
    };
  }, [notificationsPanelAPI, appInstance]);

  useEffect(() => {
    const showPanel = async () => {
      try {
        if (!isPanelVisible || !panelApplication) {
          return;
        }

        const instances = panelApplication.instances;

        if (instances?.length) {
          const instance = instances[0];
          setAppInstance(instance);
          const gdWindow = await instance.getWindow();
          gdWindow.show();
          return;
        }

        const instance = await panelApplication.start();

        if (!instance) {
          return;
        }

        setAppInstance(instance);
        instance.window?.show();
      } catch (error) {
        console.error("Failed to show panel:", error);
        setAppInstance(null);
      }
    };

    showPanel();
  }, [isPanelVisible, panelApplication]);

  useShowHideWindow(
    notifications.some((n) => n.state === "Active"),
    false
  );

  return settings.enabledToasts && !isPanelVisible ? (
    <Toasts
      style={{
        display: notifications.some((n) => n.state === "Active") ? "flex" : "none",
      }}
    />
  ) : null;
}

export default NotificationToastsWrapper;

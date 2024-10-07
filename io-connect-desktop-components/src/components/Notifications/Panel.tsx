import { useEffect } from "react";
import {
  ThemeProvider,
  useShowHideWindow,
  useHideWindowOnFocusLost,
  IONotifications,
} from "@interopio/components-react";
import { IOConnectProvider } from "@interopio/react-hooks";
import API from "@interopio/desktop";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

const {
  NotificationsProvider,
  NotificationsPanelProvider,
  useNotificationsContext,
  Panel,
  useHidePanelOnFocusLost,
  useHidePanelOnKeyUp,
} = IONotifications;

function NotificationsWrapper() {
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
          <NotificationsPanelProvider>
            <Notifications />
          </NotificationsPanelProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

function Notifications() {
  const { isPanelVisible, settings } = useNotificationsContext();

  useHidePanelOnKeyUp();
  useHidePanelOnFocusLost(settings.autoHidePanel);
  useShowHideWindow(isPanelVisible);

  return isPanelVisible ? <Panel /> : null;
}

export default NotificationsWrapper;

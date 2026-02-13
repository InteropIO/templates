import { useContext } from "react";
import API, { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectProvider, IOConnectContext } from "@interopio/react-hooks";
import { ThemeProvider, useShowHideWindow, IONotifications } from "@interopio/components-react";
import { useNotificationPanel } from "./useNotificationPanel";
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
          factory: () => API({ appManager: false }),
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

  const hasActiveNotifications = notifications.some((n) => n.state === "Active");

  // Manage notification panel lifecycle
  useNotificationPanel(io, isPanelVisible);

  // Show/hide window based on active notifications
  useShowHideWindow(hasActiveNotifications, false);

  if (!io.apps) {
    console.warn("Apps API is not available");
    return null;
  }

  if (!settings.enabledToasts || isPanelVisible) {
    return null;
  }

  return (
    <Toasts
      style={{
        display: hasActiveNotifications ? "flex" : "none",
      }}
    />
  );
}

export default NotificationToastsWrapper;

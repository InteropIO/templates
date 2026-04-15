import { useContext, useEffect, useState, useCallback } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { IONotifications } from "@interopio/home-ui-react";

const { useNotificationsContext } = IONotifications;

export const useNotificationCounterAndBadge = () => {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const { settings } = useNotificationsContext();
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const notificationsApi = io?.notifications;

    if (!notificationsApi) {
      return;
    }

    const handleCounterChange = (info: { count: number }) => {
      setNotificationsCount(info.count);
    };

    const unsubscribe = notificationsApi.onCounterChanged(handleCounterChange);
    return () => unsubscribe?.();
  }, [io?.notifications]);

  const toggleNotificationPanel = useCallback(async () => {
    if (!io?.notifications?.panel) {
      console.error("Notifications panel API not available");
      return;
    }

    try {
      const isPanelVisible = await io.notifications.panel.isVisible();

      if (isPanelVisible) {
        await io.notifications.panel.hide();
      } else {
        await io.notifications.panel.show();
      }
    } catch (error) {
      console.error("Failed to toggle notifications panel:", error);
    }
  }, [io]);

  return {
    showNotificationBadge: settings.showNotificationBadge,
    notificationsCount,
    toggleNotificationPanel,
  };
};

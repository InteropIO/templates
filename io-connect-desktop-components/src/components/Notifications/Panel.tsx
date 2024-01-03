import {
  ThemeProvider,
  NotificationsProvider,
  useNotificationsContext,
  Panel,
  useShowHideWindow,
  useHideWindowOnKeyUp,
  useHideWindowOnFocusLost,
} from "@interopio/components-react";
import { IOConnectProvider } from "@interopio/react-hooks";
import API from "@interopio/desktop";
import { useEffect } from "react";
import "@interopio/components-react/dist/styles/components/ui/header.css";
import "@interopio/components-react/dist/styles/components/ui/footer.css";
import "@interopio/components-react/dist/styles/components/ui/block.css";
import "@interopio/components-react/dist/styles/components/ui/modal.css";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

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
          <Notifications />
        </NotificationsProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

function Notifications() {
  const { isPanelVisible, settings, hidePanel } = useNotificationsContext();

  useShowHideWindow(isPanelVisible);
  useHideWindowOnKeyUp("Escape", hidePanel);
  useHideWindowOnFocusLost(settings.autoHidePanel, hidePanel);

  return <Panel style={{ display: `${isPanelVisible ? "flex" : "none"}` }} />;
}

export default NotificationsWrapper;

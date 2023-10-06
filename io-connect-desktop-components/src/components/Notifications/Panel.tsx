import {
  ThemeProvider,
  NotificationsProvider,
  useNotificationsContext,
  Panel,
  useShowHideWindow,
  useHideWindowOnKeyUp,
  useHideWindowOnFocusLost,
} from "@interopio/components-react";
import { GlueProvider } from "@glue42/react-hooks";
import Glue from "@glue42/desktop";
import { useEffect } from "react";
import "@glue42/theme/dist/t42bootstrap.bundle.css";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

function NotificationsWrapper() {
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
  const { isPanelVisible, settings, hidePanel } = useNotificationsContext();

  useShowHideWindow(isPanelVisible);
  useHideWindowOnKeyUp("Escape", hidePanel);
  useHideWindowOnFocusLost(settings.autoHidePanel, hidePanel);

  return <Panel style={{ display: `${isPanelVisible ? "flex" : "none"}` }} />;
};

export default NotificationsWrapper;

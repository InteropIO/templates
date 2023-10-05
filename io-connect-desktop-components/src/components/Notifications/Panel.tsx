import {
  ThemeProvider,
  NotificationsProvider,
  useNotificationsContext,
  Panel,
} from "@interopio/components-react";
import { GlueProvider, GlueContext } from "@glue42/react-hooks";
import Glue, { Glue42 } from "@glue42/desktop";
import { useCallback, useContext, useEffect } from "react";
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
  const glue = useContext(GlueContext) as Glue42.Glue;

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
    if (isPanelVisible) {
      showWindow();
    } else {
      hideWindow();
    }
  }, [isPanelVisible, showWindow, hideWindow]);

  useEffect(() => {
    const keyUpHandler = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        hidePanel();
      }
    };

    document.addEventListener("keyup", keyUpHandler);

    return () => document.removeEventListener("keyup", keyUpHandler);
  }, [hidePanel]);

  useEffect(() => {
    const unFocusChanged = glue?.windows.my().onFocusChanged((w) => {
      if (!w.isFocused && settings.autoHidePanel === true) {
        hidePanel();
      }
    });

    return () => unFocusChanged();
  }, [settings.autoHidePanel, hidePanel, glue?.windows]);

  return <Panel style={{ display: `${isPanelVisible ? "flex" : "none"}` }} />;
};

export default NotificationsWrapper;

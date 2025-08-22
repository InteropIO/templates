import { useContext, useEffect } from "react";
import { ThemeProvider, IONotifications } from "@interopio/components-react";
import { IOConnectContext, IOConnectProvider } from "@interopio/react-hooks";
import API, { IOConnectDesktop } from "@interopio/desktop";
import "@interopio/components-react/dist/styles/components/ui/dropdownmenu.css";
import "@interopio/components-react/dist/styles/components/ui/separator.css";
import "@interopio/components-react/dist/styles/features/notifications/styles.css";

const {
  NotificationsProvider,
  NotificationsPanelProvider,
  useNotificationsContext,
  Panel,
  useShowHidePanelWindow,
  useHidePanelOnFocusLost,
  useHidePanelOnKeyUp,
  PanelHeaderCaption,
  PanelHeaderCaptionButtons,
  PanelHeaderCaptionTitle,
  PanelHeaderCaptionFilter,
  PanelHeader,
  NotificationsList,
} = IONotifications;

declare global {
  interface Window {
    io: IOConnectDesktop.API;
  }
}

function NotificationsWrapper() {
  useEffect(() => {
    document.title = "Notifications";
  }, []);
  // Access the io.Connect APIs by using the `io` object
  // assigned as a value to `IOConnectContext` by the `<IOConnectProvider />` component.
  const io = useContext(IOConnectContext);
  window.io = io as IOConnectDesktop.API;

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
  const { settings } = useNotificationsContext();

  useShowHidePanelWindow();
  useHidePanelOnKeyUp();
  useHidePanelOnFocusLost(settings.autoHidePanel);

  const onDockClick = () => {
    (async () => {
      try {
        const myWindow = window.io.windows.my();
        console.log("🚀 ~ myWindow:", myWindow);

        if (!myWindow) {
          console.log("🚀 ~ onDockClick ~ myWindow is undefined");
          return;
        }

        const options: { position: any; claimScreenArea: boolean } = {
          position: "right",
          claimScreenArea: true,
        };

        const dockingPlacement = await myWindow.dock(options);
        
      } catch (err) {
        console.log("🚀 ~ onDockClick ~ err:", err);
        // setMessage(err);
      }
    })();
  };

  return (
    <Panel
      // @ts-ignore
      hideOnFocusLost={false}
      components={{
        NotificationsList: NotificationsList,
        Header: () => {
          return (
            <div>
              <PanelHeaderCaption />
                    <div>
                        {/* <HeaderSortButtons /> */}
                    </div>
              <button onClick={onDockClick}>Dock</button>
            </div>
          );
        },
        // HeaderSortButtons: () => {
        //     return (
        //         <ButtonGroup>
        //             <HeaderSortButtonsTimestamp />
        //             <HeaderSortButtonsPriority />
        //             <HeaderSortButtonsApplication />
        //         </ButtonGroup>
        //     );
        // },
      }}
    />
  );
}

export default NotificationsWrapper;

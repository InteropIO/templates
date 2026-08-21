import {
  ThemeProvider,
  PlatformPrefsProvider,
  IOActivePanelRenderer,
  IODownloadManager,
  IOLaunchpadDesktop,
  IONotifications,
} from "@interopio/components-react";

const { PanelManagerProvider } = IOActivePanelRenderer;
const { DownloadManagerProvider } = IODownloadManager;
const { LaunchpadProvider, LaunchpadBodyPopupProvider, PanelPopupProvider, Launchpad } = IOLaunchpadDesktop;
const { NotificationsProvider } = IONotifications;

function LaunchpadWrapper() {
  return (
    <ThemeProvider>
      <PlatformPrefsProvider>
        <NotificationsProvider>
          <DownloadManagerProvider>
            <PanelManagerProvider>
              <LaunchpadProvider>
                <LaunchpadBodyPopupProvider>
                  <PanelPopupProvider>
                    <Launchpad />
                  </PanelPopupProvider>
                </LaunchpadBodyPopupProvider>
              </LaunchpadProvider>
            </PanelManagerProvider>
          </DownloadManagerProvider>
        </NotificationsProvider>
      </PlatformPrefsProvider>
    </ThemeProvider>
  );
}

export default LaunchpadWrapper;
